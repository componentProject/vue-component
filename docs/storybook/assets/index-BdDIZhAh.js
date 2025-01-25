import{k as p,l as m,p as f,q as h,u as g,C as y,G as b,B as v,v as V,z as $}from"./vue.esm-bundler-DL_Z5ZQB.js";import{_ as w}from"./_plugin-vue_export-helper-DlAUqK2U.js";const c=p({name:"throttleButton",props:{title:{type:String,default:""},debounce:{type:Boolean,default:!1},throttle:{type:Boolean,default:!1},wait:{type:[String,Number],default:200},async:{type:Boolean,default:!1},isLoad:{type:Boolean,default:!1},depValue:{type:[Array,Object,String,Number,Boolean,void 0,null],default:"依赖"},isDeep:{type:Boolean,default:!1},message:void 0,eventConfig:{type:Object,default:()=>({click:{message:"正在操作中,请稍后",depValue:void 0}})}},data(){return{loading:!1,asyncEventQueue:new Set,depValueQueue:new Set}},beforeMount(){const n=t=>{var e;return this.$message.warning(this.message||((e=this.eventConfig[t])==null?void 0:e.message)||"正在操作中,请稍后...")},o=(t,e)=>async(...a)=>{if(this.isLoad)this.loading=!0,await t(...a),this.loading=!1;else{if(this.asyncEventQueue.has(e))return n(e);this.asyncEventQueue.add(e),await t(...a),this.asyncEventQueue.delete(e)}},u=(t,e)=>(...a)=>{const s=[],d=()=>{this.depValueQueue.delete(e),s.forEach(l=>l==null?void 0:l())};s.push(this.$watch(`eventConfig${e}.depValue`,d,{deep:this.isDeep}),this.$watch("depValue",d,{deep:this.isDeep})),this.depValueQueue.has(e)?n(e):(t(...a),this.depValueQueue.add(e))},i=t=>{let e;return(...a)=>{clearTimeout(e),e=setTimeout(()=>{t(...a)},+this.wait)}},r=t=>{let e,a;return(...s)=>{e||(t(...s),e=!0,clearTimeout(a),a=setTimeout(()=>e=!1,+this.wait))}};for(const t of Object.keys(this.$listeners)){const e=this.$listeners[t];this.throttle?this.$listeners[t]=r(e):this.debounce?this.$listeners[t]=i(e):this.async?this.$listeners[t]=o(e,t):this.depValue!="依赖"&&(this.$listeners[t]=u(e,t))}}}),B={key:0};function _(n,o,u,i,r,t){const e=m("el-button");return f(),h(e,$({class:"button",loading:n.loading},n.$attrs),{default:g(()=>[n.title?(f(),y("span",B,b(n.title),1)):v("",!0),V(n.$slots,"default",{},void 0,!0)]),_:3},16,["loading"])}const E=w(c,[["render",_],["__scopeId","data-v-e9ad4a54"]]);c.__docgenInfo={displayName:"throttleButton",exportName:"default",description:"",tags:{},props:[{name:"title",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"debounce",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"throttle",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"wait",type:{name:"string|number"},defaultValue:{func:!1,value:"200"}},{name:"async",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"isLoad",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"depValue",type:{name:"array|object|string|number|boolean|undefined|null"},defaultValue:{func:!1,value:"'依赖'"}},{name:"isDeep",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"message",type:{name:"undefined"}},{name:"eventConfig",type:{name:"object"},defaultValue:{func:!1,value:`{\r
  click: {\r
    message: '正在操作中,请稍后',\r
    depValue: undefined\r
  }\r
}`}}],slots:[{name:"default"}],sourceFiles:["E:/project/component/vue-component/src/components/wlConfigForm/components/components/wlButton/components/throttleButton/index.vue"]};export{E as default};
