import{S as c}from"./index-CDP5B36I.js";import"./vue.esm-bundler-DL_Z5ZQB.js";import"./_commonjsHelpers-CqkleIqs.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";const b={title:"Space",component:c,args:{className:"",style:{},size:"small",direction:"horizontal",align:"start",wrap:!1,height:"200px"},parameters:{docs:{description:{}}},argTypes:{direction:{control:"radio",options:["horizontal","vertical"]},align:{control:"radio",options:["start","end","center","baseline"]},size:{control:"radio",options:["small","middle","large",32]}},tags:["autodocs"]},d=p=>({template:`
    <Space v-bind="args">
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </Space>`,components:{Space:c},setup(){return{args:p}}}),a=d.bind({});a.args={direction:"horizontal"};const e=d.bind({});e.args={direction:"vertical"};var s,r,o;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`args => ({
  template: \`
    <Space v-bind="args">
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </Space>\`,
  components: {
    Space
  },
  setup() {
    return {
      args
    };
  }
})`,...(o=(r=a.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};var n,t,i;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`args => ({
  template: \`
    <Space v-bind="args">
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </Space>\`,
  components: {
    Space
  },
  setup() {
    return {
      args
    };
  }
})`,...(i=(t=e.parameters)==null?void 0:t.docs)==null?void 0:i.source}}};const u=["horizontal","vertical"];export{u as __namedExportsOrder,b as default,a as horizontal,e as vertical};
