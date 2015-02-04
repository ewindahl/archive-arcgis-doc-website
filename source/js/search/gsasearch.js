//tchen: remove this
"use restrict";

function dbg (s) {
  sitecfg["debug"] && window.console && console.info (s);
}

//tchen: remove this once core.js is integrated
if (!String.prototype.format) {
    String.prototype.format = function() {
    var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number){
                    return typeof args[number] != 'undefined' ? args[number] : match;
                });
    };
}

var app = {};

//todo: this should be update to use core.js later
//      bad name
app.langRsrc = GLangLabels;

//todo: all these cfg code should be refactor and move to a place that's site-specific

app.cfg = {
    getLang: function () {
      var txt = "";

      //todo: redo/refactor this code app.util.query2kv
      txt = $.trim(window.location.search);
      if (txt.indexOf ("?")===0) {
        txt = txt.substring(1);
      }
      
      var r = {};
      if (txt.length>0) {
        _.reduce (txt.split ("&"), function (m, kv){
          l = kv.split("=");
          if (l.length===2) {
            m[l[0]] = l[1];
          }
          return m
        }, r);
      }

      var langv = $.trim(r["language"] || "en").toLowerCase(),
          langL = langv.split ("_"),
          lg = langL[0];
          
      return (lg in app.langRsrc) ? lg : "en"     
    },

    getInc: function () {
      return 15;      
    }
};

//todo: defined in searchcfg.js
app.filterCfgDefaults = (function(winloc){
  var query = decodeURIComponent(window.location.search),
      r = filterCfgDefaults["default"];

  if (query.indexOf ("product=marketplace")>=0 && ("marketplace" in filterCfgDefaults)) {
    r = filterCfgDefaults["marketplace"];
  };

  return r || {};
})(window.location)

//defined in searchcfg.js
app.filterCfg = (function(winloc) {
  var query = decodeURIComponent(window.location.search),
      r = filterCfg["default"];

  if (query.indexOf ("product=marketplace")>=0 && ("marketplace" in filterCfg)) {
    r = filterCfg["marketplace"];
  };

  return r || [];
})(window.location);

app.rsrc = (function (lang){
              return _.defaults (localeJsonObj[lang], localeJsonObj["en"]);
            })(app.cfg.getLang());



//--- gsa query engine

app.tmplt = {};

app.QueryStatement = Backbone.Model.extend ({

  defaults: {
    cfg: app.cfg,

    q: "", 
    p: 0,
    language: "en",

    status: -1, //-1: init, 0:fail, 1: succ    
    ts: -1 //timestamp: force update event to happen
  },

  getQueryDefaults : function () {
    //define the default values for the url query parameter
    return _.extend ({
            q : "", 
            p : "0",
            language : "en",
            product : "any",
		   version : "",
            n: "" + this.get ("cfg").getInc()
          }, 
          app.filterCfgDefaults);
  },

  genAjaxData : function () {
    var increment = app.cfg.getInc(),
        self = this;

    dbg ("QueryStatement.genAjaxData");
    //dbg (this.attributes);

    function andStmt () {
      var ll = Array.prototype.slice.call (arguments);
      //remove empty string then do AND
      return _.filter (_.flatten(ll), 
                        function (x) {return x.length>0}).join (".");
    };

    function addFilter (fldtype) {
      dbg ("genFields: "+fldtype);

      var l = _.map (app.filterCfg, function (ele) {
         var k = ele.k,
             v = _.findWhere (ele.v, {k:self.get (k)}) || {q:{}};

          if (fldtype == "requiredfields") {
            return ("r" in v.q) ? v.q["r"] : ""  
          } else {
            return ("p" in v.q) ? v.q["p"] : ""  
          }
      });

      return l;
    };

    function addLanguage () {
      //return [""];
      var lang = self.get ("language"),
          langL = lang.split ("_"),
          baseLang = "en",
          v = '(content-language:en)';

      if (langL.length >=1) {
          var lg = langL[0].toLowerCase();
          baseLang = (lg in app.langRsrc) ? lg : "en" 
      }

      if (baseLang !== "en") {
        if (langL.length>1) {
          v = '(content-language:{0}|content-language:en)'.format (baseLang);
        } else {
          v = '(content-language:{0})'.format (baseLang);
        }
      }

      return [v];
    }

    function addVersion () {
      //return [""];
      var version = self.get ("version"),
          v = '';

      if (version && version.length >=1) {
          // Related GSA params doesn't like '.'. '.' need to be replaced with an encoded value
      v = '(version:{0})'.format (version.replace(/\./g,"%2E"));
      }

      return [v];
    }

    var vDefaults = {
      "event": "search.renderSearch",

      "interfaceName" : sitecfg["searchIfc"],
      "searchViewname" : sitecfg["searchView"],

      "oe" : "utf8",
      "tlen" : 150,
      "filter" : 0,
      "getfields" : "*",
      "format": "jsonp",

      "q" : "",
      "start" : 0,
      "num" : increment
    };

    v = _.extend (
                  { "q" : this.get ("q"), 
                    "start" : this.get ("p") * increment
                  }, 
                  {
                    "requiredfields": andStmt (addFilter ("requiredfields"), addVersion())
                  }, 
                  { 
                    "partialfields": andStmt (addFilter ("partialfields"), addLanguage())
                  }
                );

    v = _.defaults (v, vDefaults);

    dbg (v);

    return v;
  },

  toUrl : function (i) {
    //dbg ("toUrl");

    var keys = _.keys (this.getQueryDefaults()),
        vL = _.map (keys, function (k) {

           //dbg ("toUrl: k="+k);

           if (k === "p") {
              if (typeof i === "undefined") {
               return k +"="+encodeURIComponent(this.get (k)) 
              } else {
               return k +"="+encodeURIComponent(""+i); 
              }
           } else {
             return k +"="+encodeURIComponent(this.get (k)) 
          }

        }, this);

    v =  "?"+vL.join("&");
    return v;
  }

});


app.QueryResult = Backbone.Model.extend ({

  defaults: {
    cfg: app.cfg,

    data: null,

    status: -1, //-1: init, 0:fail, 1: succ
    ts: -1 //timestamp: force update event to happen
  },

  getResultN: function () {
    var n = 0;

    if (this.get("status")) {
        var data = this.get ("data");
        n = parseInt (data.res?data.res.m:"0", 10);      
    }
    
    return n;
  },

  getPageN: function () {
    return Math.ceil (this.getResultN()/this.get("cfg").getInc());
  },

  getRes: function () {
    var data = this.get ("data");
    return data ? data.res: []; 
  }

});

app.SearchBoxView = Backbone.View.extend ({

  events: {
    "submit #gsaSearchForm" : "search" 
  },

  initialize: function () {
    dbg ("searchboxview.init");

    this.listenTo (this.model, "change", this.render);
  },

  render: function() {
    dbg ("searchboxview.render");

    $("#gsaSearchForm > input[name='q']").val(this.model.get("q")); 
    return this;
  },

  search : function (e) {

    dbg ("searchboxview.search");

    e.stopImmediatePropagation();
    var query = $("#gsaSearchForm > input[name='q']").val(); 

    this.model.set ({"q":query, "p":0}, {silent:true});

    //app.router.query (this.model.toUrl());
    window.location = "./" + this.model.toUrl();

    return false;
  }
});


//tchen: correct?
app.tmplt.filter = _.template('<div><header><h4><%= header %></a></header></h4>' +
                          '<ul>' +
                          '<%= filters %>' +
                          '</ul>');

app.tmplt.filterItem = _.template ('<li class="<%= liClass %>"><a data-fkey="<%= key %>" data-fval="<%= value %>" title="<%= hovertext %>" href="#"><%= label %></a></li>');

app.SearchFilterView = Backbone.View.extend ({

  events: {
    "click a[data-fkey]" : "choose" 
  },

  initialize: function () {
    dbg ("SearchFilterView.init");

    this.listenTo (this.model, "change", this.render);
  },

  render: function() {
    dbg ("SearchFilterView.render");
    
    var self = this;

    function genFilterHtml (cfg) {

      var data = null;

      function genFilterItem (filterKey, item) {
        var data = {
          label: app.util.getLabel (item["k"]),
          hovertext: app.util.getLabel (item["k"]+"-ht"),
          liClass: item["k"] === self.model.get (filterKey) ? "current": "",
          key: filterKey,
          value: item["k"]
        };

        return app.tmplt.filterItem (data);        
      };

      data = {
        header: app.util.getLabel (cfg["l"]),
        filters: _.map (cfg["v"], 
                        function (x) {return genFilterItem(cfg["k"], x);}).join ("")
      };

      return app.tmplt.filter (data);
    } 
   
    this.$el.empty();

    var sl = _.map (app.filterCfg, genFilterHtml);

    this.$el.html (sl.join (""));
    
    return this;
  },

  choose : function (e) {

    dbg ("SearchFilterView.choose");

    e.stopImmediatePropagation();

    var ctarget = $(e.currentTarget), 
        fkey = ctarget.data ("fkey"),
        fval = ctarget.data ("fval");
        v = {};

    v[fkey] = fval;
    v["p"] = 0;

    if(fval != this.model.get ('product')){
      this.model.set("version","");
    }

    this.model.set (v, {silent:true});

    //app.router.query (this.model.toUrl());
    window.location = "./" + this.model.toUrl();

    return false;

  }
});

//app.SearchLangView ({model:app.qStmt, el: $("#searchLang")});

app.SearchLangView = Backbone.View.extend({

  events: {
    "click a[data-langkey]" : "choose" 
  },

  initialize: function() {
    dbg ("SearchLang.init");

    this.listenTo (this.model, "change", this.render);
  },

  render: function() {

    var mdl = this.model,
        lang = mdl.get ("language"),
        langL = lang.split ("_"),
        baseLang = "en";

    dbg ("SearchLang.render: "+lang);

    if (langL.length >=1) {
        var lg = langL[0].toLowerCase();
        baseLang = (lg in app.langRsrc) ? lg : "en" 
    }

    this.$el.empty();

    if (baseLang !== "en") {
      var s = '<a class="{3}" data-langkey="{0}" href="#">{1}</a> / <a class="{4}" data-langkey="{0}_en" href="#">{1} + {2}</a>',
          selected = "btn secondary small",
          cls0 =  (langL.length>1) ? "" : selected,
          cls1 =  (langL.length>1) ? selected : "";

      this.$el.html (s.format (baseLang, app.langRsrc[baseLang], app.rsrc["english"],
                               cls0, cls1));
    }
    
    return this;
  },
  
  choose : function (e) {


    e.stopImmediatePropagation();

    var ctarget = $(e.currentTarget), 
        lang = ctarget.data ("langkey");

    dbg ("SearchLang.choose: " + lang);

    this.model.set ({"language":lang, "p":0}, {silent:true});

    //app.router.query (this.model.toUrl());
    window.location = "./" + this.model.toUrl();

    return false;

  }

});

app.SRStatView = Backbone.View.extend({

  initialize: function() {
    dbg ("srstatview.init");

    this.listenTo (this.model, "change", this.render);
  },

  render: function() {
    dbg ("srstat.render");

    var mdl = this.model,
        status = mdl.get ("status"),
        resultN = mdl.getResultN(),
        pageN = mdl.getPageN(),
        p = app.qStmt.get ("p");

    this.$el.empty();
    
    if (status) {
      if (resultN <=0) {
        this.$el.html (app.util.getLabel("results_zero"));
      } else {
        this.$el.html (app.util.getLabel("results_n").format(resultN, p+1, pageN));
      }
    } else {
      this.$el.html (app.util.getLabel("tryagain"));
    }
    return this;
  }
});

app.SRPagerView = Backbone.View.extend({

  initialize: function () {
    dbg ("srpagerview.init");

    this.listenTo (this.model, "change", this.render);
  },

  render: function () {
    dbg ("srpagerview.render");
    //dbg (this.model.changedAttributes());
  
    var mdl = this.model,
        status = mdl.get ("status"),
        pageN = mdl.getPageN(),
        buf = ["<ul class='search-pager'>"];
    
    this.$el.empty();
    
    if (status) {
      var i = 0,
          p = app.qStmt.get ("p"),
          q = app.qStmt.get ("q"),
          url = "";
          

      begI = Math.max (p-5, 0);
      endI = Math.min (begI+10, pageN);


      if (begI>0) {
        url = app.qStmt.toUrl (p-1), 
        className = "";
        buf.push ("<li><a "+ className +" href='"+ url +"'>" + "&lt;" + "</a></li>");
      }

      for (i=begI; i<endI; i++) {
        var url = app.qStmt.toUrl (i), 
            className = (p === i)? "class='current'" : "";

        buf.push ("<li><a "+ className +" href='"+ url +"'>" + (i+1) + "</a></li>");
      }

      if (endI < pageN) {
        url = app.qStmt.toUrl (p+1), 
        className = "";
        buf.push ("<li><a "+ className +" href='"+ url +"'>" + "&gt;" + "</a></li>");
      }  

      buf.push ("</ul>");
      this.$el.html (buf.join (""));
    } else {
      //err: noop
    }
    
    return this;
  }

});


app.SRListView = Backbone.View.extend ({

    template: _.template('<div class="result"><h4 class="no-trailer"><a class="searchTitle" href="<%= url %>"><%= t %></a></h4>' +
                     '<p class="resultMeta"><%= mdType %><%= mdTpc %><%= dateTpc %></p>' + 
                     '<p class="item-snippet1"><%= txt %></p></div>'),

    initialize: function () {
      dbg ("SRListView.init");

      this.listenTo (this.model, "change", this.render);
    },

    render: function() {
      dbg ("SRListView.render");

      var res = this.model.getRes();

      function genMD (r) {
        var mt = r ? r.mt : [],
            i = mt.length,
            kv =null,
            md = {};


        function parseDate (s) {
          var dL = s.split ("-");
          try {
            return new Date (parseInt (dL[0], 10), 
                             parseInt (dL[1], 10) -1, 
                             parseInt (dL[2], 10));
          } catch (e) {
            return null;
          }
        }

        while (i--) {
          kv = mt[i];
          md[kv["@n"]] = kv["@v"];
        }
        
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];

        var subj = md["subject_label"] || md["subject"] || "",
            cat = md["sub_category_label"] || md["sub_category"] || "",
            date = md["last-modified"] ? (parseDate (md["last-modified"]) || null) : null,
            mdTpc = "",
            dateTpc = "";

        subj = subj.split (",")[0];

        if (subj && cat) {
          mdTpc = " | " + subj + " - " + cat; 

        } else if (subj) {
          mdTpc = " | " + subj ; 

        } else if (cat) {
          mdTpc = " | " + cat; 
        };
        
        dateTpc = ""; //| <%= mdDate %>
        mdDate =  date ? monthNames[date.getMonth()] + " " + date.getDate() +", " + date.getFullYear() : "";
        if (mdDate) {
          dateTpc = " | " + mdDate;
        }

        return {
          "mdType" : md["content_type_label"] || md["content_type"] || "",
          "mdTpc" : mdTpc,
          "dateTpc" : dateTpc
        };
      }

      this.$el.empty();

      //dbg (res);

      if (res) { 
        var rL = $.isArray (res.r) ? res.r : [res.r],
            l = _.map (rL, _.bind (function (x) {
              var data = {
                t: x.t,
                url: x.u, //u or ue?
                txt: x.s,
                mdSubj: "",
                mdCat: "",
                mdDate : ""
              };

              _.extend (data, genMD(x));

              return this.template (data);

          }, this));

        this.$el.html (l.join (""));
      }  

      return this;
    }

});


//todo: maybe should be in core.js?
app.util = {};
app.util.query2kv = function (txt) {
  dbg ("query2kv: -"+txt+"-");

  txt = $.trim(txt);
  if (txt.indexOf ("?")===0) {
    txt = txt.substring(1);
  }
  
  var r = {};
  if (txt.length>0) {
    _.reduce (txt.split ("&"), function (m, kv){
      l = kv.split("=");
      if (l.length===2) {
        m[l[0]] = l[1];
      }
      return m
    }, r);
  }
   
  qDefaults  = app.qStmt.getQueryDefaults();

  r = _.pick (r, _.keys (qDefaults));
  r = _.defaults (r, qDefaults);

  r.p = parseInt (r.p, 10);

  //dbg (r);

  return r;
}

app.util.getLabel = function (key) {  
  return app.rsrc[key] || "undefined";
} 

app.util.changeL10NLabel = function () {
  //this is copy from langSelector.js
  //once refactor is done, this should get fold back into core lib.
  var dict = app.rsrc;

  if (app.cfg.getLang() !== "en" && dict) {
      $("*[data-langlabel]").each (function(i) {
          var o = $(this),
              txt = dict[o.attr("data-langlabel")];
          
          if (this.tagName === "INPUT" || this.tagName === "input") {
              o.val (txt);
          }
          if (txt) {
              o.html (txt);
          }
      });                
  }

}

app.doSearch = function () {
  dbg ("doSearch");

  $.ajax ({
    url: sitecfg["searchUrl"],
    dataType: "jsonp",
    data: app.qStmt.genAjaxData(),
    timeout: 5000,

    beforeSend: function () {
      //TODO replace with defer
      $("#spinner").show();
    }
  })
  .then(function(data, status, jqxhr) {
    var dom = $.parseXML(data.content);
    if (dom) {
      return getXMLData (dom.documentElement);
    } else {
      //TODO handle err?
      dbg ("ajax: empty dom")
      return null;
    }

  }, function(jqxhr, status, err) {
    dbg ("ajax: failed");
    //TODO handle err?
    return null;
  })
  .then (function() {
    dbg ("doSearch: succ");

    $("#spinner").hide();
    data = Array.prototype.slice.call (arguments,0)[0];
    //dbg (data);
    
    if (data) {
            
      app.qStmt.set ({
        status:1,
        ts: Date.now()
      });

      app.qResult.set({
        data: data,
        status:1,
        ts: Date.now()        
      });

    } else {
      //TODO ???
      app.qStmt.set ({
        status: 0,
        ts: Date.now()
      });

      app.qResult.set({
        status: 0,
        ts: Date.now()        
      });

    }

    return data;

  }, function(){
    dbg ("doSearch: fail");

    $("#spinner").hide();

    app.qStmt.set ({
      status:0,
      ts: Date.now()
    });
    
    app.qResult.set({
      status:0,
      ts: Date.now()        
    });
    
    return null;
  });
};

app.SearchRouter = Backbone.Router.extend({
    routes: {
      "*q*": "query"
    },


    query: function (query) {
      dbg ("searchRouter.query: " + query);


      if (!query) {
        dbg ("searchRouter.query: empty query");
        query = decodeURIComponent(window.location.search);
      } else {
      }
      
      //this.navigate ("./"+query, {trigger:false, replace:true});

      app.qStmt.set (_.extend (app.util.query2kv(query), {status:-1, ts:0}), {silent:true});

      app.doSearch ();
 
    }
});



