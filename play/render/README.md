# vue-template

Vue 3 + TypeScript + Vite + TailwindCSS + qiankun搭建的vue模板

基于文件系统的布局,根据layout目录结构自动生成布局,默认使用element布局

基于文件系统的路由,根据views目录结构自动生成路由,目前仅支持两级菜单

基于env变量的插件配置,项目默认采用VITE_GLOB_APP_CODE作为 路由 + css前缀 + 项目启动前缀 用于适配qiankun

## 依赖下载

```sh
pnpm install
```

### 项目启动

```sh
pnpm dev
```

### 项目打包

```sh
pnpm build
```
