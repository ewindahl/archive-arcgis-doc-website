define(["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojox/lang/functional/object","dojo/topic"],function(e,t,n,r,i){return e("Quoin.Base",null,{_subscriptions:[],subscribe:function(e,n){var r=i.subscribe(e,t.hitch(this,n));return r},publish:function(){var e=Array.prototype.slice.call(arguments);i.publish.apply(this,e)},destroy:function(){n.forEach(this._subscriptions,t.hitch(this,function(e,t){e.remove()}))}})});