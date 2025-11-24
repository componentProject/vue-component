// 此文件由ViteConfig自动生成，请勿手动修改
declare module 'virtual:auto-routes' {
  interface RouteModule {
    path: string
    name: string
    meta?: any
    component: () => Promise<any>
    children?: RouteModule[]
  }

  const routes: RouteModule[]
  const findDefaultRoute: (routes: any[]) => string
  export { findDefaultRoute, routes }
  export default routes
}
