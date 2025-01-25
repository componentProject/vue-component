import{r as L,j as I,w as M,k as _,C as P,v as H,O as R,S as k,L as j,p as U,I as v,E as y}from"./vue.esm-bundler-DL_Z5ZQB.js";const J=e=>!!e&&e.constructor===Object,Q=(e,t)=>!e||!t?e??t??{}:Object.entries({...e,...t}).reduce((u,[i,r])=>({...u,[i]:J(e[i])?Q(e[i],r):r}),{});function B(e){return Object.prototype.toString.call(e)==="[object Number]"&&e===e}const b=(e,t)=>{if(e===void 0)return t;if(B(e))return e;const u=parseFloat(e);return B(u)?u:t},w={rotate:-20,zIndex:1,width:100,gap:[100,100],fontStyle:{fontSize:"16px",color:"rgba(0, 0, 0, 0.15)",fontFamily:"sans-serif",fontWeight:"normal"}},V=(e={})=>{var r,c,n,a,o,p;const t={...e,rotate:e.rotate||w.rotate,zIndex:e.zIndex||w.zIndex,fontStyle:{...w.fontStyle,...e.fontStyle},width:b(e.width,e.image?w.width:void 0),height:b(e.height,void 0),container:e.container,gap:[b((r=e.gap)==null?void 0:r[0],w.gap[0]),b(((c=e.gap)==null?void 0:c[1])||((n=e.gap)==null?void 0:n[0]),w.gap[1])]},u=b((a=t.offset)==null?void 0:a[0],0),i=b(((o=t.offset)==null?void 0:o[1])||((p=t.offset)==null?void 0:p[0]),0);return t.offset=[u,i],t},X=(e,t,u)=>{let i=0,r=0;const c=[];t.forEach(a=>{const{width:o,fontBoundingBoxAscent:p,fontBoundingBoxDescent:f}=e.measureText(a),h=p+f;o>i&&(i=o),r+=h,c.push({height:h,width:o})});const n=u*Math.PI/180;return{originWidth:i,originHeight:r,width:Math.ceil(Math.abs(Math.sin(n)*r)+Math.abs(Math.cos(n)*i)),height:Math.ceil(Math.abs(Math.sin(n)*i)+Math.abs(r*Math.cos(n))),lineSize:c}},Y=async e=>{const{rotate:t,image:u,content:i,fontStyle:r,gap:c}=e,n=document.createElement("canvas"),a=n.getContext("2d"),o=window.devicePixelRatio,p=l=>{const s=c[0]+l.width,m=c[1]+l.height;n.setAttribute("width",`${s*o}px`),n.setAttribute("height",`${m*o}px`),n.style.width=`${s}px`,n.style.height=`${m}px`,a.translate(s*o/2,m*o/2),a.scale(o,o);const d=t*Math.PI/180;a.rotate(d)},f=()=>{const{fontSize:l,color:s,fontWeight:m,fontFamily:d}=r,q=b(l,0)||r.fontSize;a.font=`${m} ${q}px ${d}`;const g=X(a,[...i],t),$=e.width||g.width,E=e.height||g.height;return p({width:$,height:E}),a.fillStyle=s,a.font=`${m} ${q}px ${d}`,a.textBaseline="top",[...i].forEach((D,x)=>{const{height:S,width:z}=g.lineSize[x],A=-z/2,T=-(e.height||g.originHeight)/2+S*x;a.fillText(D,A,T,e.width||g.originWidth)}),Promise.resolve({base64Url:n.toDataURL(),height:E,width:$})};function h(){return new Promise(l=>{const s=new Image;s.crossOrigin="anonymous",s.referrerPolicy="no-referrer",s.src=u,s.onload=()=>{let{width:m,height:d}=e;return(!m||!d)&&(m?d=s.height/s.width*+m:m=s.width/s.height*+d),p({width:m,height:d}),a.drawImage(s,-m/2,-d/2,m,d),l({base64Url:n.toDataURL(),width:m,height:d})},s.onerror=()=>f()})}return u?h():f()};function G(e={}){const t=L(e||{}),u=I(()=>V(t.value)),i=L(),r=L();function c(){const n=u.value.container;console.log("mergedOptions.value",u.value);const{zIndex:a,gap:o}=u.value;n&&Y(u.value).then(({base64Url:p,width:f,height:h})=>{var d,q;const l=u.value.offset[0]+"px",s=u.value.offset[1]+"px",m=`
      width:calc(100% - ${l});
      height:calc(100% - ${s});
      position:absolute;
      top:${s};
      left:${l};
      bottom:0;
      right:0;
      pointer-events: none;
      z-index:${a};
      background-position: 0 0;
      background-size:${o[0]+f}px ${o[1]+h}px;
      background-repeat: repeat;
      background-image:url(${p})`;if(!i.value){const g=document.createElement("div");if(i.value=g,!n)return;n.append(g),n.style.position="relative"}(d=i.value)==null||d.setAttribute("style",m.trim()),n&&((q=r.value)==null||q.disconnect(),r.value=new MutationObserver(g=>{var E,D;g.some(x=>{let S=!1;return x.removedNodes.length&&(S=Array.from(x.removedNodes).some(z=>z===i.value)),x.type==="attributes"&&x.target===i.value&&(S=!0),S})&&((D=(E=i.value)==null?void 0:E.parentNode)==null||D.removeChild(i.value),i.value=void 0,c())}),r.value.observe(n,{attributes:!0,subtree:!0,childList:!0}))})}return M(()=>t.value,()=>{c()},{immediate:!0,deep:!0}),{generateWatermark:n=>{t.value=Q(t.value,n)}}}const O=_({__name:"index",props:{style:{},className:{},zIndex:{},width:{},height:{},rotate:{},image:{},content:{},fontStyle:{},gap:{},offset:{},container:{}},setup(e){const t=e,{className:u,style:i,zIndex:r,width:c,height:n,rotate:a,image:o,content:p,fontStyle:f,gap:h,offset:l}=t,s=L(),m=I(()=>t.container||s.value),{generateWatermark:d}=G({zIndex:r,width:c,height:n,rotate:a,image:o,content:p,fontStyle:f,gap:h,offset:l,container:m});return M(()=>[r,c,n,a,o,p,JSON.stringify(t.fontStyle),JSON.stringify(t.gap),JSON.stringify(t.offset),s.value],()=>{d({zIndex:r,width:c,height:n,rotate:a,image:o,content:p,fontStyle:f,gap:h,offset:l,container:m})},{immediate:!0,deep:!0}),(q,g)=>(U(),P("div",{class:R(["relative",k(u)]),ref_key:"containerRef",ref:s,style:j(k(i))},[H(q.$slots,"default")],6))}});O.__docgenInfo={exportName:"default",displayName:"Watermark",description:"",tags:{},props:[{name:"style",required:!1,type:{name:"CSSProperties"}},{name:"className",required:!1,type:{name:"string"}},{name:"zIndex",required:!1,type:{name:"union",elements:[{name:"string"},{name:"number"}]}},{name:"width",required:!1,type:{name:"number"}},{name:"height",required:!1,type:{name:"number"}},{name:"rotate",description:"旋转角度",required:!1,type:{name:"number"}},{name:"image",description:"图片路径,与文字互斥",required:!1,type:{name:"string"}},{name:"content",description:"文字内容",required:!1,type:{name:"union",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}]}]}},{name:"fontStyle",required:!1,type:{name:`{\r
    color?: string;\r
    fontFamily?: string;\r
    fontSize?: number | string;\r
    fontWeight?: number | string;\r
}`}},{name:"gap",description:"x轴和y轴的间隔",required:!1,type:{name:"tuple",elements:[{name:"number"},{name:"number"}]}},{name:"offset",description:"x轴和y轴的偏移量",required:!1,type:{name:"tuple",elements:[{name:"number"},{name:"number"}]}},{name:"container",required:!1,type:{name:"HTMLElement"}}],slots:[{name:"default"}],sourceFiles:["E:/project/component/vue-component/src/components/Watermark/index.vue"]};const ee={title:"水印",component:O,args:{},argTypes:{},parameters:{docs:{description:{component:`利用父元素会被子元素撑开的特点,将子组件包裹在relative的父元素内,\r
通过width:calc(100% - \${offsetLeft}); height:calc(100% - \${offsetTop}); position:absolute;将水印画布撑大到与子元素同大小\r

利用canvas将图片/文字绘制到画布中,并转换为base64,\r

通过useEffect监视配置变化,重新绘制水印,\r

通过mutationObserver监视dom元素变化,重新绘制水印`}}}},K=e=>v(O,e,{default:()=>[v("div",{style:{height:800}},[v("p",null,[y("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!")]),v("p",null,[y("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!")]),v("p",null,[y("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!")]),v("p",null,[y("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!")]),v("p",null,[y("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!")]),v("p",null,[y("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!")]),v("p",null,[y("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!")])])]}),C=K.bind({});C.args={content:["测试水印","小汪的水印"],gap:[20,0]};var F,N,W;C.parameters={...C.parameters,docs:{...(F=C.parameters)==null?void 0:F.docs,source:{originalSource:`props => {
  return <Watermark {...props}>\r
      <div style={{
      height: 800
    }}>\r
        <p>\r
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas\r
          in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum\r
          exercitationem esse sapiente? Eveniet, id provident!\r
        </p>\r
        <p>\r
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas\r
          in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum\r
          exercitationem esse sapiente? Eveniet, id provident!\r
        </p>\r
        <p>\r
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas\r
          in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum\r
          exercitationem esse sapiente? Eveniet, id provident!\r
        </p>\r
        <p>\r
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas\r
          in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum\r
          exercitationem esse sapiente? Eveniet, id provident!\r
        </p>\r
        <p>\r
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas\r
          in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum\r
          exercitationem esse sapiente? Eveniet, id provident!\r
        </p>\r
        <p>\r
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas\r
          in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum\r
          exercitationem esse sapiente? Eveniet, id provident!\r
        </p>\r
        <p>\r
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas\r
          in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum\r
          exercitationem esse sapiente? Eveniet, id provident!\r
        </p>\r
      </div>\r
    </Watermark>;
}`,...(W=(N=C.parameters)==null?void 0:N.docs)==null?void 0:W.source}}};const te=["watermark"];export{te as __namedExportsOrder,ee as default,C as watermark};
