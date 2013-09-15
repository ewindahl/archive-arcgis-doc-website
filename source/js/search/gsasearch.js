function dbg (s) {
  //console.info (s);
}

var app = {
  searchBox: null,
  srPager: null,
  srStat: null
};


app.QueryState = Backbone.Model.extend ({
  defaults: {
    q:"", 
    p:0, 

    increment:5, 
    resultN:0,
    
    status: -1, //-1: init, 0:fail, 1: succ
    
    ts: -1 //timestamp: force update event to happen
  },

  getPageN: function () {
    return Math.ceil (this.get("resultN")/this.get("increment"));
  },

  getStart: function () {
    return this.get("p") * this.get("increment");
  }
});


app.SearchBoxView = Backbone.View.extend ({

  events: {
    "submit #gsaSearchForm" : "search" 
  },

  initialize: function () {
    dbg ("searchboxview.init");
  },

  render: function() {
    dbg ("searchboxview.render");
    $("#gsaSearchForm > input[name='q']").val(app.queryState.get("q")); 
    return this;
  },

  search : function (e) {
    dbg ("searchboxview.search");

    e.stopImmediatePropagation();
    var query = $("#gsaSearchForm > input[name='q']").val(); 
    app.router.navigate ("?q=" + encodeURIComponent(query), {trigger:true});
    return false;
  }
});

app.SRStatView = Backbone.View.extend({
  initialize: function() {
    dbg ("srstatview.init");
  },

  render: function() {
    dbg ("srstat.render");
    var status = app.queryState.get ("status"),
        resultN = app.queryState.get ("resultN"),
        p = app.queryState.get ("p"),
        pageN = app.queryState.getPageN();

    this.$el.empty();
    
    if (status) {
      if (resultN <=0) {
        this.$el.html ("0 result");
      } else {
        this.$el.html ("About " + resultN +" results (page "+(p+1)+" of "+ pageN +")");
      }
    } else {
      this.$el.html ("Please try again later");
    }
    return this;
  }
});

app.SRPagerView = Backbone.View.extend({

  initialize: function () {
    dbg ("srpagerview.init");
  },

  render: function () {
    dbg ("srpagerview.render");
    dbg (app.queryState.changedAttributes());
  
    var status = app.queryState.get ("status"),
        maxN = app.queryState.getPageN(),
        buf = ["<ul class='search-pager'>"];
    
    this.$el.empty();
    
    if (status) {
      for (var i=0; i<maxN; i++) {
        var q = app.queryState.get ("q"),
            p = app.queryState.get ("p"),
            url = "./?q="+encodeURIComponent (q) + "&p="+i,
            className = (p === i)? "class='current'" : "";

        buf.push ("<li><a "+ className +" href='"+ url +"'>" + (i+1) + "</a></li>")
      }
      buf.push ("</ul>");
      this.$el.html (buf.join (""));
    } else {
      //err: noop
    }
    return this;
  }

});

app.util = {};
app.util.search2kv = function (txt) {
  dbg ("search2kv: -"+txt+"-");

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
  return r;
}

app.genGSAQuery  = function (qkv) {
  var increment = app.queryState.get ("increment");
  return {
    "event": "search.renderSearch",
    "interfaceName" : "developers",
    "searchViewname" : "arcgis_doc_marketplace",
    "oe" : "utf8",
    "filter" : 0,
    "start" : qkv.p * increment,
    "num" : increment,
    "getfields" : "*",
    "format": "jsonp",
    "q" : qkv.q
  }
}

app.doSearch = function (qkv) {
  dbg ("doSearch");
  dbg (qkv);

  $.ajax ({
    url: sitecfg["helpSearch"],
    dataType: "jsonp",
    data: app.genGSAQuery(qkv),
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
    dbg ("succ");
    $("#spinner").hide();
    data = Array.prototype.slice.call (arguments,0)[0];
    //dbg (data);
    
    if (data) {
      app.renderResult (data.res);
      app.queryState.set ({
        q:qkv.q, 
        p: parseInt (qkv.p, 10) || 0, 
        resultN:parseInt (data.res?data.res.m:"0", 10),
        status:1,
        ts: Date.now()
      });
    } else {
      //TODO ???
      app.queryState.set ({
        status: 0,
        ts: Date.now()
      });
    }

    return data;

  }, function(){
    dbg("fail");
    $("#spinner").hide();
    app.queryState.set ({
      status:0,
      ts: Date.now()
    });
    
    return null;
  });
};

app.srTmplt = _.template('<div class="result"><h4><a class="searchTitle" href="<%= url %>"><%= t %></a></h4>' +
                     '<p class="resultMeta"><%= mdType %> | <%= mdSubj %> - <%= mdCat %> | <%= mdDate %></p>' + 
                     '<p class="item-snippet1"><%= txt %></p></div>');


app.renderResult = function (res) {

  function genMD (r) {
    var mt = r ? r.mt : [],
        i = mt.length,
        kv =null,
        md = {};

    while (i--) {
      kv = mt[i];
      md[kv["@n"]] = kv["@v"];
    }
    
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    var subj = md["subject_label"] || "",
        date = new Date (md["last-modified"]) || Date.now(),
        
    subj = subj.split (",")[0];
    
    return {
      "mdType" : md["content_type_label"] || "",
      "mdSubj" : subj,
      "mdCat" :  md["sub_category_label"] || "",
      "mdDate" : monthNames[date.getMonth()] + " " + date.getDate() +", " + date.getFullYear()
    };
  }

  $("#dynamicContent").empty();
  
  if (res) { 
    var l = _.map (res.r, function (r) {
      var data = {
        t: r.t,
        url: r.u, //TODO u or ue?
        txt: r.s,
        mdSubj: "",
        mdCat: "",
        mdDate : ""
      };

      _.extend (data, genMD(r));
      return app.srTmplt (data);
    });

  $("#dynamicContent").html (l.join (""));

  }  
};

app.SearchRouter = Backbone.Router.extend({
    routes: {
      "*q": "query"
    },

    query: function (query) {
      dbg ("searchRouter.query");

      if (!query) {
        dbg ("esearchRouter.query: mpty query");
        query = decodeURIComponent(window.location.search);
      };

      qkv = app.util.search2kv(query);

      app.doSearch (qkv);
 
    }
});


$(document).ready(function() {
 
  dbg ("doc.ready");

  app.router = new app.SearchRouter();
  app.queryState = new app.QueryState;
  
  app.searchBox = new app.SearchBoxView ({model:app.queryState, el: $("#searchBox")});
  app.srPager = new app.SRPagerView ({model: app.queryState, el: $("#gl-pagenav")});
  app.srStat = new app.SRStatView ({model: app.queryState, el: $(".gl-pnavinfo-s")});

  app.queryState.on ("change", app.srPager.render, app.srPager);
  app.queryState.on ("change", app.searchBox.render, app.searchBox);
  app.queryState.on ("change", app.srStat.render, app.srStat);

  Backbone.history.start({pushState: true, root: "/search/"});

});



