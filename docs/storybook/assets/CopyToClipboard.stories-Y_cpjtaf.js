import{k as S,C as k,v as R,p as q}from"./vue.esm-bundler-DL_Z5ZQB.js";import{g as A}from"./_commonjsHelpers-CqkleIqs.js";var y,T;function F(){return T||(T=1,y=function(){var t=document.getSelection();if(!t.rangeCount)return function(){};for(var r=document.activeElement,p=[],a=0;a<t.rangeCount;a++)p.push(t.getRangeAt(a));switch(r.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":r.blur();break;default:r=null;break}return t.removeAllRanges(),function(){t.type==="Caret"&&t.removeAllRanges(),t.rangeCount||p.forEach(function(s){t.addRange(s)}),r&&r.focus()}}),y}var g,x;function _(){if(x)return g;x=1;var t=F(),r={"text/plain":"Text","text/html":"Url",default:"Text"},p="Copy to clipboard: #{key}, Enter";function a(n){var e=(/mac os x/i.test(navigator.userAgent)?"⌘":"Ctrl")+"+C";return n.replace(/#{\s*key\s*}/g,e)}function s(n,e){var l,b,v,d,i,o,m=!1;e||(e={}),l=e.debug||!1;try{v=t(),d=document.createRange(),i=document.getSelection(),o=document.createElement("span"),o.textContent=n,o.ariaHidden="true",o.style.all="unset",o.style.position="fixed",o.style.top=0,o.style.clip="rect(0, 0, 0, 0)",o.style.whiteSpace="pre",o.style.webkitUserSelect="text",o.style.MozUserSelect="text",o.style.msUserSelect="text",o.style.userSelect="text",o.addEventListener("copy",function(c){if(c.stopPropagation(),e.format)if(c.preventDefault(),typeof c.clipboardData>"u"){l&&console.warn("unable to use e.clipboardData"),l&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var f=r[e.format]||r.default;window.clipboardData.setData(f,n)}else c.clipboardData.clearData(),c.clipboardData.setData(e.format,n);e.onCopy&&(c.preventDefault(),e.onCopy(c.clipboardData))}),document.body.appendChild(o),d.selectNodeContents(o),i.addRange(d);var h=document.execCommand("copy");if(!h)throw new Error("copy command was unsuccessful");m=!0}catch(c){l&&console.error("unable to copy using execCommand: ",c),l&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(e.format||"text",n),e.onCopy&&e.onCopy(window.clipboardData),m=!0}catch(f){l&&console.error("unable to copy using clipboardData: ",f),l&&console.error("falling back to prompt"),b=a("message"in e?e.message:p),window.prompt(b,n)}}finally{i&&(typeof i.removeRange=="function"?i.removeRange(d):i.removeAllRanges()),o&&document.body.removeChild(o),v()}return m}return g=s,g}var B=_();const U=A(B),C=S({__name:"index",props:{text:{default:""},onCopy:{},debug:{type:Boolean},message:{},format:{}},setup(t){const r=t,p=()=>{console.log("props",r);const{onCopy:a,text:s,...n}=r,e=U(s,n);a&&a(s,e)};return(a,s)=>(q(),k("div",{onClick:p},[R(a.$slots,"default")]))}});C.__docgenInfo={exportName:"default",displayName:"CopyToClipboard",description:"",tags:{},props:[{name:"text",description:"点击时,实际复制的文本",required:!0,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"onCopy",description:`额外的点击参数,

text 实际复制的文本

result 接收copy-to-clipboard调用后的返回值result`,required:!1,type:{name:"TSFunctionType"}},{name:"debug",description:"copy-to-clipboard的options参数",required:!1,type:{name:"boolean"}},{name:"message",description:"copy-to-clipboard的options参数",required:!1,type:{name:"string"}},{name:"format",description:"copy-to-clipboard的options参数",required:!1,type:{name:"string"}}],slots:[{name:"default"}],sourceFiles:["E:/project/component/vue-component/src/components/CopyToClipboard/index.vue"]};const j={title:"CopyToClipboard",component:C,args:{},parameters:{docs:{description:{component:`点击时复制传入的text到剪切板,\r

通过copy-to-clipboard实现`}}},argTypes:{}},I=t=>({template:`
    <CopyToClipboard v-bind="args">
      <div>复制</div>
    </CopyToClipboard>`,components:{CopyToClipboard:C},setup(){return{args:t}}}),u=I.bind({});u.args={text:"hello world"};var w,D,E;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`args => ({
  template: \`
    <CopyToClipboard v-bind="args">
      <div>复制</div>
    </CopyToClipboard>\`,
  components: {
    CopyToClipboard
  },
  setup() {
    return {
      args
    };
  }
})`,...(E=(D=u.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};const H=["copyToClipboard"];export{H as __namedExportsOrder,u as copyToClipboard,j as default};
