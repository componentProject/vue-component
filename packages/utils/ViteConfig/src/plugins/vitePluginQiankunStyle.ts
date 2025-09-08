// qiankun-css-inject-plugin.js
// 说明：
// - 开发环境下给 CSS 选择器增加 data-qiankun="appId" 前缀，实现子应用样式隔离
// - 在 dev server 中注入脚本，将含标识的 <style> 节点移动到子应用容器中，避免样式污染
import { createFilter } from 'vite'
import type { Plugin, ViteDevServer } from 'vite'
import postcss from 'postcss'
import type { AtRule as PostcssAtRule, Root as PostcssRoot, Rule as PostcssRule } from 'postcss'
import process from 'node:process'
import type { IncomingMessage, ServerResponse } from 'node:http'
// 没有类型定义也可使用，若缺失类型请安装 @types 或用自定义声明
// 这里直接导入运行时函数
import selectorParser from 'postcss-selector-parser'

export interface QiankunCssInjectOptions {
  target?: string
  include?: string | string[]
  exclude?: string | string[]
  cssInclude?: string | string[]
  cssExclude?: string | string[]
  appId?: string
}

export default function qiankunCssInject(options: QiankunCssInjectOptions = {}): Plugin | false {
  if (process.env.NODE_ENV !== 'development') {
    return false
  }
  const {
    // 默认使用 Qiankun 的子应用容器选择器
    target = 'qiankun-head',
    include = '**/*.html',
    exclude,
    cssInclude = '**/*.{css,scss,sass,less,styl}',
    cssExclude,
    // 添加子应用标识前缀
    appId = 'TSIDS',
  } = options

  const filter = createFilter(include, exclude)
  // const cssInclude = '**/*.{css,scss,sass,less,style}'; // 处理的文件类型
  const filterCss = createFilter(cssInclude, cssExclude)
  const identifier = `/* ${appId}-css-identifier */`
  // 创建属性前缀
  const attributePrefix = `data-qiankun="${appId}"`
  return {
    name: 'vite-plugin-qiankun-css-inject',
    apply: 'serve',
    // 添加 CSS 标识
    // transform(code, id) {
    //   if (id.endsWith('.css')) {
    //     const s = new MagicString(code);
    //     s.prepend(identifier + '\n');

    //     return {
    //       code: s.toString(),
    //       map: s.generateMap()
    //     };
    //   }
    // },
    async transform(code: string, id: string) {
      if (!filterCss(id))
        return
      try {
        // 使用 PostCSS 处理 CSS
        const result = await postcss([
          // 添加属性前缀的处理器
          (css: PostcssRoot) => {
            css.walkRules((rule: PostcssRule) => {
              // 跳过 @font-face 规则
              const parentNode = rule.parent
              if (
                parentNode
                && (parentNode as any).type === 'atrule'
                && (parentNode as PostcssAtRule).name === 'font-face'
              ) {
                return
              }

              rule.selectors = rule.selectors.map((selector: string) => {
                return selectorParser((selectors: any) => {
                  selectors.walk((sel: any) => {
                    // 跳过关键帧名称
                    if (sel.type === 'atrule' && sel.name === 'keyframes')
                      return

                    // 处理 :root 选择器
                    if (sel.type === 'selector' && sel.nodes?.[0]?.value === ':root') {
                      sel.nodes[0].value = `[data-qiankun="${appId}"]`
                      return
                    }

                    // 为其他选择器添加属性前缀
                    if (sel.type === 'selector') {
                      const attributeNode = selectorParser.attribute({
                        attribute: attributePrefix,
                      })

                      // 将属性选择器插入到最前面
                      sel.nodes.unshift(selectorParser.combinator({
                        value: ' ',
                      }))
                      sel.nodes.unshift(attributeNode)
                    }
                  })
                }).processSync(selector)
              })
            })
          },
        ]).process(code, {
          from: id,
          map: {
            inline: false,
            annotation: false,
          },
        })
        // if (id.endsWith('.css')) {
        return {
          code: `/* ${appId}-css-identifier */\n${result.css}`,
          map: null,
        }
        // }
        // return {
        //   code: result.css,
        //   map: result.map
        // };
      }
      catch (e) {
        console.error(`[vite-plugin-qiankun-css-selector] Error processing file: ${id}`, e)
        return null
      }
    },

    configureServer(server: ViteDevServer) {
      type NextFunction = (err?: any) => void
      server.middlewares.use(async (
        req: IncomingMessage,
        res: ServerResponse,
        next: NextFunction,
      ) => {
        const originalEnd: typeof res.end = res.end.bind(res)
        ;(res as any).end = function (chunk?: any, encoding?: any, callback?: any) {
          try {
            if (typeof chunk !== 'string' || !filter(req.url)) {
              return originalEnd(chunk, encoding, callback)
            }
            // 注入增强版脚本
            const injectionScript = `
              <script type="module">
                (function() {
                  // const appId = '${appId}';
                  const targetSelector = '${target}';
                  const identifier = '${identifier}';

                  // 样式缓存，用于应用切换恢复
                  const styleCache = new Map();
                  let containerObserver = null;

                  // 移动样式到子应用容器
                  const moveStyles = function(force = false) {
                    const targetEl = document.querySelector(targetSelector);
                    if (!targetEl) return false;

                    // 处理现有样式
                    document.querySelectorAll('head > style').forEach(style => {
                      if (style.textContent.includes(identifier) && (!style.dataset.qiankunMoved || force)) {
                        let dataViteDevId = style.getAttribute('data-vite-dev-id')

                        styleCache.set(dataViteDevId,style);
                        // styleCache.set(style.textContent, true);
                        // const clonedStyle = style.cloneNode(true);
                        targetEl.appendChild(style);

                        style.dataset.qiankunMoved = 'true';
                      }
                    });
                    return true;
                  };

                  // 初始化容器观察器
                  const initContainerObserver = function() {

                    if (containerObserver) containerObserver.disconnect();

                    containerObserver = new MutationObserver(() => moveStyles());
                    containerObserver.observe(document.body, {
                      childList: true,
                      subtree: true
                    });

                    // 立即尝试移动
                    moveStyles();
                  };

                  // 监听样式变化
                  const styleObserver = new MutationObserver(mutations => {

                    mutations.forEach(mutation => {
                      mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'STYLE' &&
                            node.textContent.includes(identifier)) {
                              // let dataViteDevId = node.dataset.viteDevId
                          const targetEl = document.querySelector(targetSelector);
                          if (targetEl) {
                            // 缓存样式内容
                            // styleCache.set(dataViteDevId,node.textContent);

                            // 克隆样式
                            // const clonedStyle = node.cloneNode(true);
                            targetEl.appendChild(node);

                            node.dataset.qiankunMoved = 'true';
                          }
                        }
                      });
                    });
                  });

                  styleObserver.observe(document.head, {
                    childList: true,
                    subtree: true
                  });

                  const styleObserverChild  = new MutationObserver(mutations => {

                    mutations.forEach(mutation => {
                      mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'STYLE' &&
                            node.textContent.includes(identifier)) {
                              let dataViteDevId = node.dataset.viteDevId

                          // 缓存样式内容
                          styleCache.set(dataViteDevId,node);
                        } else if (node.nodeName === '#text' &&
                            node.parentNode.tagName === 'STYLE') {
                              let dataViteDevId = node.parentNode.dataset.viteDevId

                          // 缓存样式内容
                          styleCache.set(dataViteDevId,node.parentNode);
                        }
                      });
                    });
                  });
                  styleObserverChild.observe(document.querySelector(targetSelector), {
                    childList: true,
                    subtree: true
                  });
                  // 恢复缓存的样式（用于应用切换后恢复）
                  const restoreStyles = function() {
                    const targetEl = document.querySelector(targetSelector);
                    if (!targetEl) return;
                    // 清除容器内的旧样式
                    let styleList = targetEl.querySelectorAll('style')
                    if(styleList.length!=0) return

                    styleList.forEach(style => {
                      if (style.textContent.includes(identifier)) {
                        style.remove();
                      }
                    });
                    //添加缓存的样式
                    styleCache.forEach((content, _) => {
                      // const style = document.createElement('style');
                      // style.setAttribute('data-vite-dev-id',_)
                      // style.setAttribute('qiankunMoved',true)
                      // style.type="text/css"
                      // style.textContent = content;
                      targetEl.appendChild(content);
                    });
                  };

                  // 监听应用切换事件
                  const handleAppSwitch = function() {
                    initContainerObserver();
                    restoreStyles();
                  };

                  // 初始化
                  initContainerObserver();

                  // 暴露函数供外部调用
                  window.__qiankun_css_inject__ = Object.assign(
                    window.top.__qiankun_css_inject__ || {},
                    {
                      handleAppSwitch,
                      restoreStyles
                    }
                  );
                })();
              </script>
            `

            chunk = chunk.replace(/<\/body>/, `${injectionScript}</body>`)
          }
          catch (e) {
            console.error('[vite-plugin-qiankun-css-inject] Error:', e)
          }

          return originalEnd(chunk, encoding, callback)
        }
        next()
      })
    },
  }
}
