"use strict";(self.webpackChunkstlite=self.webpackChunkstlite||[]).push([[1558],{31558:function(e,t,n){n.r(t),n.d(t,{default:function(){return v}});var i=n(19065),r=n(57994),o=n(98907),a=n(64428),l=n(82359),u=n(30969),s=n(88108),p=n(16492),d=n(51590),m=n(38364),c=n(42663),f=n(32283),h=n(37574),g=function(e){(0,a.Z)(n,e);var t=(0,l.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var o=arguments.length,a=new Array(o),l=0;l<o;l++)a[l]=arguments[l];return(e=t.call.apply(t,[this].concat(a))).formClearHelper=new p.Kz,e.state={value:e.initialValue},e.commitWidgetValue=function(t){e.props.widgetMgr.setStringValue(e.props.element,e.state.value,t)},e.onFormCleared=function(){e.setState((function(e,t){return{value:t.element.default}}),(function(){return e.commitWidgetValue({fromUi:!0})}))},e.handleChange=function(t){var n;n=null===t?e.initialValue:e.dateToString(t),e.setState({value:n},(function(){return e.commitWidgetValue({fromUi:!0})}))},e.stringToDate=function(e){var t=e.split(":").map(Number),n=(0,i.Z)(t,2),r=n[0],o=n[1],a=new Date;return a.setHours(r),a.setMinutes(o),a},e.dateToString=function(e){var t=e.getHours().toString().padStart(2,"0"),n=e.getMinutes().toString().padStart(2,"0");return"".concat(t,":").concat(n)},e}return(0,o.Z)(n,[{key:"initialValue",get:function(){var e=this.props.widgetMgr.getStringValue(this.props.element);return void 0!==e?e:this.props.element.default}},{key:"componentDidMount",value:function(){this.props.element.setValue?this.updateFromProtobuf():this.commitWidgetValue({fromUi:!1})}},{key:"componentDidUpdate",value:function(){this.maybeUpdateFromProtobuf()}},{key:"componentWillUnmount",value:function(){this.formClearHelper.disconnect()}},{key:"maybeUpdateFromProtobuf",value:function(){this.props.element.setValue&&this.updateFromProtobuf()}},{key:"updateFromProtobuf",value:function(){var e=this,t=this.props.element.value;this.props.element.setValue=!1,this.setState({value:t},(function(){e.commitWidgetValue({fromUi:!1})}))}},{key:"render",value:function(){var e,t=this.props,n=t.disabled,i=t.width,r=t.element,o=t.widgetMgr,a={width:i},l={Select:{props:{disabled:n,overrides:{ControlContainer:{style:{borderLeftWidth:"1px",borderRightWidth:"1px",borderTopWidth:"1px",borderBottomWidth:"1px"}},IconsContainer:{style:function(){return{paddingRight:".5rem"}}},ValueContainer:{style:function(){return{paddingRight:".5rem",paddingLeft:".5rem",paddingBottom:".5rem",paddingTop:".5rem"}}},SingleValue:{props:{className:"stTimeInput-timeDisplay"}},Dropdown:{style:function(){return{paddingTop:0,paddingBottom:0}}},Popover:{props:{overrides:{Body:{style:function(){return{marginTop:"1px"}}}}}}}}}};return this.formClearHelper.manageFormClearListener(o,r.formId,this.onFormCleared),(0,h.jsxs)("div",{className:"stTimeInput",style:a,children:[(0,h.jsx)(d.ON,{label:r.label,disabled:n,labelVisibility:(0,f.iF)(null===(e=r.labelVisibility)||void 0===e?void 0:e.value),children:r.help&&(0,h.jsx)(d.dT,{children:(0,h.jsx)(m.ZP,{content:r.help,placement:c.ug.TOP_RIGHT})})}),(0,h.jsx)(s.Z,{format:"24",step:r.step?Number(r.step):900,value:this.stringToDate(this.state.value),onChange:this.handleChange,overrides:l,creatable:!0,"aria-label":r.label})]})}}]),n}(u.PureComponent),v=g}}]);
//# sourceMappingURL=1558.5fec1e4a.chunk.js.map