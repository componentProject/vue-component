import{i as k}from"./wlConfigForm.stories-Cu4G2WEI.js";import z from"./index-C8_I-j6S.js";import{k as j,l,p as t,C as r,I as m,u as i,F as O,D as $,q as E,s as _,v as c,z as a,A as N,B as g,O as P}from"./vue.esm-bundler-DL_Z5ZQB.js";import{_ as S}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./iframe-Dva_HZaO.js";import"../sb-preview/runtime.js";const o={wlTableColumn:z},T=Object.keys(o);o.install=function(e){T.forEach(n=>{e.component(n,o[n])})};console.log("components",o);const h=j({name:"wlTable",components:o,props:{prop:{type:String,default:""},slots:{type:Object,default:()=>({})},model:{type:Object,default:()=>({})},config:{type:Object,default:()=>({})}},data(){return{show:!0,Event:{},Options:{},pageConfig:{}}},watch:{config:{handler(e){const{columns:n,show:s,event:p,pageConfig:u,...f}=e;k(s,"boolean")&&(this.show=!!s),this.pageConfig=u,this.Options=f,this.Event=p||{},n||(e.columns=[])},immediate:!0,deep:!0}},methods:{sizeChange(e){this.$emit("change",{...this.pageConfig,pageSize:e})},currentChange(e){this.$emit("change",{...this.pageConfig,pageNo:e,currentPage:e})}},beforeMount(){const{model:e,prop:n}=this;e[n]||console.error("表格数据不能为空",n,e)}}),V={key:0,style:{"align-self":"flex-end"}};function B(e,n,s,p,u,f){const C=l("wl-table-column"),b=l("el-table"),y=l("el-pagination");return e.show?(t(),r("div",{key:0,class:P(["wflex wflex-col wlTable",{tableExpandContainer:e.config.isExpand}])},[m(b,a({data:e.model[e.prop]},e.Options,N(e.Event),{height:"100%",border:""}),{default:i(()=>[(t(!0),r(O,null,$(e.config.columns,(d,v)=>(t(),E(C,a({ref_for:!0},d,{column:d,key:v}),_({_:2},[e.slots.default?{name:"default",fn:i(w=>[c(e.$slots,"default",a({ref_for:!0},w),void 0,!0)]),key:"0"}:void 0,e.slots.append?{name:"append",fn:i(()=>[c(e.$slots,"append",{},void 0,!0)]),key:"1"}:void 0]),1040,["column"]))),128))]),_:3},16,["data"]),e.pageConfig?(t(),r("div",V,[m(y,a(e.pageConfig,{onSizeChange:e.sizeChange,onCurrentChange:e.currentChange,onPrevClick:e.currentChange,onNextClick:e.currentChange,layout:"prev, pager, next, jumper,sizes,total","page-sizes":e.pageConfig.pageSizes||[10,20,50,100],currentPage:e.pageConfig.currentPage||e.pageConfig.pageNo,total:e.pageConfig.total||e.model[e.prop].length}),null,16,["onSizeChange","onCurrentChange","onPrevClick","onNextClick","page-sizes","currentPage","total"])])):g("",!0)],2)):g("",!0)}const L=S(h,[["render",B],["__scopeId","data-v-e827d792"]]);h.__docgenInfo={displayName:"wlTable",exportName:"default",description:"",tags:{},props:[{name:"prop",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"slots",type:{name:"object"},defaultValue:{func:!1,value:"{}"}},{name:"model",type:{name:"object"},defaultValue:{func:!1,value:"{}"}},{name:"config",type:{name:"object"},defaultValue:{func:!1,value:"{}"}}],events:[{name:"change",type:{names:["undefined"]}}],slots:[{name:"default",scoped:!0,bindings:[]},{name:"append"}],sourceFiles:["E:/project/component/vue-component/src/components/wlConfigForm/components/components/wlTable/index.vue"]};export{L as default};
