import{i as s}from"./wlConfigForm.stories-Cu4G2WEI.js";import{k as l,l as m,p as u,q as i,z as d,A as f,B as c}from"./vue.esm-bundler-DL_Z5ZQB.js";import{_ as v}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./iframe-Dva_HZaO.js";import"../sb-preview/runtime.js";const a=l({name:"wlRate",props:{prop:{type:String,default:""},model:{type:Object,default:()=>({})},config:{type:Object,default:()=>({})}},data(){return{show:!0,Event:{},Options:{}}},watch:{config:{handler(e){const{show:o,event:t,...n}=e;s(o,"boolean")&&(this.show=!!o),this.Options=n,this.Event=t||{}},immediate:!0,deep:!0}}});function y(e,o,t,n,g,w){const p=m("el-rate");return e.show?(u(),i(p,d({key:0,modelValue:e.model[e.prop],"onUpdate:modelValue":o[0]||(o[0]=r=>e.model[e.prop]=r)},e.Options,f(e.Event)),null,16,["modelValue"])):c("",!0)}const C=v(a,[["render",y]]);a.__docgenInfo={displayName:"wlRate",exportName:"default",description:"",tags:{},props:[{name:"prop",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"model",type:{name:"object"},defaultValue:{func:!1,value:"{}"}},{name:"config",type:{name:"object"},defaultValue:{func:!1,value:"{}"}}],sourceFiles:["E:/project/component/vue-component/src/components/wlConfigForm/components/components/rarelyComponents/wlRate/index.vue"]};export{C as default};
