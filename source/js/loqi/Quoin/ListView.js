define(["dojo/_base/declare","dojo/_base/lang","Quoin/View","Quoin/Handlebars","dojo/_base/array","dojo/dom-style","dojo/dom-construct","dojo/query","dojo/NodeList-traverse","dojo/NodeList-dom","dojo/NodeList-data"],function(e,t,n,r,i,s,o,u){return r.registerHelper("list-container",function(){return"<div data-dojo-attach-point='listContainer'></div>"}),e("Quoin.ListView",[n],{index:{},views:{},activeItems:function(){return u(this.listContainer).children(":not(._quoin-filtered)").length},filter:function(e,n){var r=this.collection.query(e,n);u(this.listContainer).children().style("display","none").addClass("_quoin-filtered"),r.forEach(t.hitch(this,function(e,t){var n=this.viewForModel(e.get("id"));u(n.domNode).style("display","block").removeClass("_quoin-filtered")}))},addItem:function(e,t){var n,r=t.index||0,i=e.get("id");this.views[i]?n=this.views[i]:(n=new this.view({model:e}),this.views[n.get("id")]=n,this.index[e.get("id")]=n.get("id")),n.placeAt(this.listContainer,r)},removeItem:function(e){var t=this.index[e],n=this.views[t].model.get("id");this.views[t].destroy(),delete this.views[t],delete this.index[n]},renderCollection:function(){this.collection.forEach(function(e,t){this.addItem(e,{index:t})},this)},postCreate:function(){this.inherited(arguments),this.renderCollection()},viewForModel:function(e){var t=this.index[e];return this.views[t]},constructor:function(e){this.collection=e.collection,this.view=e.view,this.collection.on("item:added",t.hitch(this,function(e){this.addItem(e.additions[0],{index:e.index})})),this.collection.on("item:removed",t.hitch(this,function(e){this.removeItem(e.removals[0].get("id"))})),this.collection.on("index-altered",t.hitch(this,function(e){this.index[e.newId]=this.index[e.oldId],delete this.index[e.oldId];var t=this.index[e.newId],n=this.viewForModel(e.newId),r=dojo.query(".application").indexOf(dojo.query(t)[0]);n.destroyRendering(),n.buildRendering(),n._createEvents(),o.place(n.domNode,this.listContainer,r)}))}})});