define(["SessionManager","dojo/_base/declare","dojo/_base/event","dojo/_base/lang","dojo/query","Quoin/View","dojo/text!/templates/dashboard/dashboard","dojo/text!/templates/dashboard/ie","dojo/text!/templates/application-manager/nav","ApplicationManager/helpers/handlebars"],function(e,t,n,r,i,s,o,u,a){return[].map?t([s],{templateString:o,bindings:{serviceUsage:function(){i(".creditsRemaining",this.domNode).text(Math.round(e.organization.availableCredits)),this.createGraph()},creditsUsed:".lastThirtyDays innerHTML",averagePerDay:".averagePerDay innerHTML",timeRangePhrase:".phrase innerHTML"},createGraph:function(){nv.dev=!1;var e=this.model.get("serviceUsage"),t=this.model.get("timeRangePhrase");i("#loader1",this.domNode).addClass("hidden");var n=d3.scale.category20();keyColor=function(e,t){return n(t)};var r="%b %e",s;switch(t){case"Last 7 Days":r="%b %e, %I %p";break;case"Last 30 Days":r="%b %e";break;case"Last 6 Months":r="%b %e";break;case"Last Year":r="%b %e"}nv.addGraph(function(){return s=nv.models.stackedAreaChart().x(function(e){return e[0]}).y(function(e){return e[1]}).color(keyColor).showControls(!1).tooltips(!0),s.xAxis.tickFormat(function(e){return d3.time.format(r)(new Date(e))}),s.yAxis.tickFormat(d3.format(",.2f")),d3.select("#chart-1").datum(e).call(s),nv.utils.windowResize(s.update),s})}}):t([s],{templateString:u,bindings:{serviceUsage:function(){i(".creditsRemaining",this.domNode).text(Math.round(e.organization.availableCredits)),this.createGraph()},creditsUsed:".lastThirtyDays innerHTML",averagePerDay:".averagePerDay innerHTML",timeRangePhrase:".phrase innerHTML"},createGraph:function(){var e=this.model.get("serviceUsage"),t=this.model.get("timeRangePhrase");i("#loader1",this.domNode).addClass("hidden");switch(t){case"Last 7 Days":timeFormat="%b %e, %I %p";break;case"Last 30 Days":timeFormat="%b %e";break;case"Last 6 Months":timeFormat="%b %e";break;case"Last Year":timeFormat="%b %e"}}})});