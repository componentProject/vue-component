import{k as z,j as h,C as N,v as _,O as w,L as q,a as b,p as j}from"./vue.esm-bundler-DL_Z5ZQB.js";import{g as C}from"./_commonjsHelpers-CqkleIqs.js";import{_ as A}from"./_plugin-vue_export-helper-DlAUqK2U.js";var d={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/var g;function O(){return g||(g=1,function(o){(function(){var s={}.hasOwnProperty;function t(){for(var e="",a=0;a<arguments.length;a++){var n=arguments[a];n&&(e=l(e,m(n)))}return e}function m(e){if(typeof e=="string"||typeof e=="number")return e;if(typeof e!="object")return"";if(Array.isArray(e))return t.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var a="";for(var n in e)s.call(e,n)&&e[n]&&(a=l(a,n));return a}function l(e,a){return a?e?e+" "+a:e+a:e}o.exports?(t.default=t,o.exports=t):window.classNames=t})()}(d)),d.exports}var V=O();const E=C(V),S=z({name:"Space",__name:"index",props:{height:{},width:{},className:{},style:{},size:{default:"small"},direction:{default:"horizontal"},align:{default:"start"},wrap:{type:Boolean,default:!1}},setup(o){const s=o,t=h(()=>{const{align:n,direction:i,className:f}=s,c=i==="horizontal"&&n==null?"center":n;return E("space",`space-${i}`,{[`space-align-${c}`]:c},f)}),m={small:8,middle:16,large:24};function l(n){return typeof n=="string"?m[n]:n||0}const e=b("configProvider",{}),a=h(()=>{const{size:n,wrap:i,height:f,width:c}=s,p=e.space||n,[v,x]=(Array.isArray(p)?p:[p,p]).map(r=>l(r)),u={};u["column-gap"]=v+"px",u.rowGap=x+"px";function y(r){if(r)return Number.isNaN(+r)?r:r+"px"}return i&&(u.flexWrap="wrap"),{height:y(f),width:y(c),...u,...s.style}});return(n,i)=>(j(),N("div",{class:w(t.value),style:q(a.value)},[_(n.$slots,"default",{},void 0,!0)],6))}}),$=A(S,[["__scopeId","data-v-288fab59"]]);S.__docgenInfo={name:"Space",exportName:"default",displayName:"Space",description:"",tags:{},props:[{name:"height",required:!1,type:{name:"string"}},{name:"width",required:!1,type:{name:"string"}},{name:"className",required:!1,type:{name:"string"}},{name:"style",required:!1,type:{name:"CSSProperties"}},{name:"size",description:`子元素的间距,

支持传入数组,eg:[横向间距, 纵向间距],

也支持传入单个值,eg:间距

也可以使用'small' | 'middle' | 'large'`,required:!1,type:{name:"union",elements:[{name:"SizeType"},{name:"tuple",elements:[{name:"SizeType"},{name:"SizeType"}]}]},defaultValue:{func:!1,value:"'small'"}},{name:"direction",description:"flex主轴方向: horizontal横向 | vertical纵向",required:!1,type:{name:"union",elements:[{name:'"horizontal"'},{name:'"vertical"'}]},defaultValue:{func:!1,value:"'horizontal'"}},{name:"align",description:"flex副轴方向: start | end | center | baseline",required:!1,type:{name:"union",elements:[{name:'"start"'},{name:'"end"'},{name:'"center"'},{name:'"baseline"'}]},defaultValue:{func:!1,value:"'start'"}},{name:"wrap",description:"是否换行,默认否",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],slots:[{name:"default"}],sourceFiles:["E:/project/component/vue-component/src/components/Space/index.vue"]};export{$ as S};
