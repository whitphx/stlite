(self.webpackChunkstlite=self.webpackChunkstlite||[]).push([[7446],{97446:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return R}});var o=n(57994),r=n(98907),i=n(64428),l=n(82359),a=n(30969),s=n(46578),u=n(75359),c=n.n(u),p=n(42421),d=n(16492),f=n(41720),h=n(84172),m=n(81982),v=n(51590),g=(0,n(13137).Z)("div",{target:"e10apx9u0"})((function(e){return{"span[aria-disabled='true']":{background:e.theme.colors.fadedText05}}}),""),y=n(38364),x=n(42663),b=n(69625),S=n(82912),w=n(32283),k=n(37574),C=function(e){(0,i.Z)(n,e);var t=(0,l.Z)(n);function n(){var e;(0,o.Z)(this,n);for(var r=arguments.length,i=new Array(r),l=0;l<r;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).formClearHelper=new d.Kz,e.state={value:e.initialValue},e.commitWidgetValue=function(t){e.props.widgetMgr.setIntArrayValue(e.props.element,e.state.value,t)},e.onFormCleared=function(){e.setState((function(e,t){return{value:t.element.default}}),(function(){return e.commitWidgetValue({fromUi:!0})}))},e.onChange=function(t){e.props.element.maxSelections&&"select"===t.type&&e.state.value.length>=e.props.element.maxSelections||e.setState(e.generateNewState(t),(function(){e.commitWidgetValue({fromUi:!0})}))},e.filterOptions=function(t,n){if(e.overMaxSelections())return[];var o=t.filter((function(t){return!e.state.value.includes(Number(t.value))}));return(0,S.H)(o,n)},e}return(0,r.Z)(n,[{key:"overMaxSelections",value:function(){return this.props.element.maxSelections>0&&this.state.value.length>=this.props.element.maxSelections}},{key:"getNoResultsMsg",value:function(){if(0===this.props.element.maxSelections)return"No results";var e=1!==this.props.element.maxSelections?"options":"option";return"You can only select up to ".concat(this.props.element.maxSelections," ").concat(e,". Remove an option first.")}},{key:"initialValue",get:function(){var e=this.props.widgetMgr.getIntArrayValue(this.props.element);return void 0!==e?e:this.props.element.default}},{key:"componentDidMount",value:function(){this.props.element.setValue?this.updateFromProtobuf():this.commitWidgetValue({fromUi:!1})}},{key:"componentDidUpdate",value:function(){this.maybeUpdateFromProtobuf()}},{key:"componentWillUnmount",value:function(){this.formClearHelper.disconnect()}},{key:"maybeUpdateFromProtobuf",value:function(){this.props.element.setValue&&this.updateFromProtobuf()}},{key:"updateFromProtobuf",value:function(){var e=this,t=this.props.element.value;this.props.element.setValue=!1,this.setState({value:t},(function(){e.commitWidgetValue({fromUi:!1})}))}},{key:"valueFromState",get:function(){var e=this;return this.state.value.map((function(t){var n=e.props.element.options[t];return{value:t.toString(),label:n}}))}},{key:"generateNewState",value:function(e){var t=function(){var t,n=null===(t=e.option)||void 0===t?void 0:t.value;return parseInt(n,10)};switch(e.type){case"remove":return{value:c()(this.state.value,t())};case"clear":return{value:[]};case"select":return{value:this.state.value.concat([t()])};default:throw new Error("State transition is unknown: ".concat(e.type))}}},{key:"render",value:function(){var e,t=this.props,n=t.element,o=t.theme,r=t.width,i=t.widgetMgr,l={width:r},a=n.options,u=0===a.length||this.props.disabled,c=0===a.length?"No options to select.":"Choose an option",p=a.map((function(e,t){return{label:e,value:t.toString()}}));this.formClearHelper.manageFormClearListener(i,n.formId,this.onFormCleared);var d=a.length>10;return(0,k.jsxs)("div",{className:"row-widget stMultiSelect",style:l,children:[(0,k.jsx)(v.ON,{label:n.label,disabled:u,labelVisibility:(0,w.iF)(null===(e=n.labelVisibility)||void 0===e?void 0:e.value),children:n.help&&(0,k.jsx)(v.dT,{children:(0,k.jsx)(y.ZP,{content:n.help,placement:x.ug.TOP_RIGHT})})}),(0,k.jsx)(g,{children:(0,k.jsx)(h.Z,{options:p,labelKey:"label",valueKey:"value","aria-label":n.label,placeholder:c,type:m.wD.select,multi:!0,onChange:this.onChange,value:this.valueFromState,disabled:u,size:"compact",noResultsMsg:this.getNoResultsMsg(),filterOptions:this.filterOptions,closeOnSelect:!1,overrides:{SelectArrow:{component:f.Z,props:{overrides:{Svg:{style:function(){return{width:o.iconSizes.xl,height:o.iconSizes.xl}}}}}},IconsContainer:{style:function(){return{paddingRight:o.spacing.sm}}},ControlContainer:{style:{borderLeftWidth:"1px",borderRightWidth:"1px",borderTopWidth:"1px",borderBottomWidth:"1px"}},Placeholder:{style:function(){return{flex:"inherit"}}},ValueContainer:{style:function(){return{minHeight:"38.4px",paddingLeft:o.spacing.sm,paddingTop:0,paddingBottom:0,paddingRight:0}}},ClearIcon:{props:{overrides:{Svg:{style:{color:o.colors.darkGray,transform:"scale(1.5)",width:o.spacing.twoXL,":hover":{fill:o.colors.bodyText}}}}}},SearchIcon:{style:{color:o.colors.darkGray}},Tag:{props:{overrides:{Root:{style:{borderTopLeftRadius:o.radii.md,borderTopRightRadius:o.radii.md,borderBottomRightRadius:o.radii.md,borderBottomLeftRadius:o.radii.md,fontSize:o.fontSizes.sm,paddingLeft:o.spacing.sm,marginLeft:0,marginRight:o.spacing.sm,height:"28px"}},Action:{style:{paddingLeft:0}},ActionIcon:{props:{overrides:{Svg:{style:{width:"10px",height:"10px"}}}}},Text:{style:{fontSize:o.fontSizes.md}}}}},MultiValue:{props:{overrides:{Root:{style:{fontSize:o.fontSizes.sm}}}}},Input:{props:{readOnly:s.tq&&!1===d?"readonly":null}},Dropdown:{component:b.s}}})})]})}}]),n}(a.PureComponent),R=(0,p.b)(C)},24918:function(e,t,n){var o=n(52830);e.exports=function(e,t){return!!(null==e?0:e.length)&&o(e,t,0)>-1}},93528:function(e){e.exports=function(e,t,n){for(var o=-1,r=null==e?0:e.length;++o<r;)if(n(t,e[o]))return!0;return!1}},73360:function(e,t,n){var o=n(81294),r=n(24918),i=n(93528),l=n(26306),a=n(25098),s=n(82195),u=200;e.exports=function(e,t,n,c){var p=-1,d=r,f=!0,h=e.length,m=[],v=t.length;if(!h)return m;n&&(t=l(t,a(n))),c?(d=i,f=!1):t.length>=u&&(d=s,f=!1,t=new o(t));e:for(;++p<h;){var g=e[p],y=null==n?g:n(g);if(g=c||0!==g?g:0,f&&y===y){for(var x=v;x--;)if(t[x]===y)continue e;m.push(g)}else d(t,y,c)||m.push(g)}return m}},8453:function(e){e.exports=function(e,t,n,o){for(var r=e.length,i=n+(o?1:-1);o?i--:++i<r;)if(t(e[i],i,e))return i;return-1}},52830:function(e,t,n){var o=n(8453),r=n(5307),i=n(81821);e.exports=function(e,t,n){return t===t?i(e,t,n):o(e,r,n)}},5307:function(e){e.exports=function(e){return e!==e}},81821:function(e){e.exports=function(e,t,n){for(var o=n-1,r=e.length;++o<r;)if(e[o]===t)return o;return-1}},75359:function(e,t,n){var o=n(73360),r=n(90280),i=n(95788),l=r((function(e,t){return i(e)?o(e,t):[]}));e.exports=l}}]);
//# sourceMappingURL=7446.6c232fc1.chunk.js.map