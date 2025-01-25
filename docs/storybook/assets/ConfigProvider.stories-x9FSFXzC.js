import{k as f,J as g,C as v,v as C,K as S,p as b,I as e}from"./vue.esm-bundler-DL_Z5ZQB.js";import{S as x}from"./index-CDP5B36I.js";import{C as _}from"./index-BLKcToAE.js";import"./_commonjsHelpers-CqkleIqs.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./dayjs.min-BZmTKRGw.js";const d=f({__name:"index",props:{locale:{},space:{}},setup(i){const p=i,u=g();return console.log("slots",u),S("configProvider",p),(m,N)=>(b(),v("div",null,[C(m.$slots,"default")]))}});d.__docgenInfo={exportName:"default",displayName:"ConfigProvider",description:"",tags:{},props:[{name:"locale",description:"组件的语言",required:!1,type:{name:"union",elements:[{name:'"zh-CN"'},{name:'"en-US"'}]}},{name:"space",description:"Space组件的间隔",required:!1,type:{name:"number"}}],slots:[{name:"default"}],sourceFiles:["E:/project/component/vue-component/src/components/ConfigProvider/index.vue"]};const B={title:"ConfigProvider",component:d,args:{}},o={args:{space:"small",default:()=>e(x,null,{default:()=>[e("div",{class:"box"},null),e("div",{class:"box"},null),e("div",{class:"box"},null)]})},argTypes:{default:{control:"disabled"},space:{control:"radio",options:["small","middle","large",32]}}},a={args:{locale:"zh-CN",default:()=>e(_,null,null)},argTypes:{default:{control:"disabled"},locale:{control:"radio",options:["zh-CN","en-US"]}}};var n,s,r;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    space: 'small',
    // 默认插槽
    default: () => <Space>\r
        <div class="box"></div>\r
        <div class="box"></div>\r
        <div class="box"></div>\r
      </Space>
  },
  argTypes: {
    default: {
      control: 'disabled'
    },
    space: {
      control: 'radio',
      options: ['small', 'middle', 'large', 32]
    }
  }
}`,...(r=(s=o.parameters)==null?void 0:s.docs)==null?void 0:r.source}}};var l,t,c;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    locale: 'zh-CN',
    // 默认插槽
    default: () => <Calendar />
  },
  argTypes: {
    default: {
      control: 'disabled'
    },
    locale: {
      control: 'radio',
      options: ['zh-CN', 'en-US']
    }
  }
}`,...(c=(t=a.parameters)==null?void 0:t.docs)==null?void 0:c.source}}};const T=["space","calendar"];export{T as __namedExportsOrder,a as calendar,B as default,o as space};
