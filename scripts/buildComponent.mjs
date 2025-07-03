import { build } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import glob from 'fast-glob'
import fsp from 'node:fs/promises'
// vite vue插件
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// tailwind
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

function getBaseConfig() {
  return {
    root: rootDir,
    base: './',
    configFile: false,
    plugins: [
      pluginVue(),
      vueJsx(),
    ],
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          tailwindcss(),
        ],
      },
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      alias: {
        '@': resolve(rootDir, './src'),
      },
    },
  }
}

// 获取组件列表（只分目录的组件）
async function getComponentNames() {
  const componentDirs = await glob(['src/components/*'], {
    cwd: rootDir,
    onlyDirectories: true,
    ignore: ['src/components/_*'],
  })
  return componentDirs.map(dir => dir.split('/').pop())
}

// 封装单个组件的打包逻辑
async function buildSingleComponent({ comp, entry, format, outDir, entryFileName, chunkExt }) {
  await build({
    ...getBaseConfig(),
    build: {
      outDir,
      emptyOutDir: true,
      minify: 'esbuild',
      cssCodeSplit: false,
      assetsInlineLimit: 0,
      copyPublicDir: false,
      lib: {
        entry,
        name: comp,
        fileName: () => entryFileName,
        formats: [format],
      },
      rollupOptions: {
        external: ['vue', 'element-plus'],
        output: {
          entryFileNames: entryFileName,
          chunkFileNames: (chunkInfo) => {
            if (chunkInfo.name && chunkInfo.name !== 'index') {
              return `src/[name].${chunkExt}`
            }
            return `_shared/js/[name].${chunkExt}`
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'style/index.css'
            }
            // 其他资源放到 _shared/style 或 _shared/js
            if (assetInfo.name && assetInfo.name.endsWith('.js')) {
              return '_shared/js/[name].[ext]'
            }
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return '_shared/style/[name].[ext]'
            }
            return '_shared/[name].[ext]'
          },
          manualChunks: undefined,
        },
      },
    },
  })
  // 打包后自动复制README.md
  const readmeSrc = resolve(rootDir, `src/components/${comp}/README.md`)
  try {
    await fsp.access(readmeSrc)
    await fsp.copyFile(readmeSrc, resolve(outDir, 'README.md'))
    console.log(`已复制README.md到: ${outDir}`)
  }
  catch {
    // 没有README.md则跳过
  }
}

async function buildComponents() {
  try {
    const componentNames = await getComponentNames()
    console.log('将为每个组件单独打包:', componentNames)
    // 并发打包ES和CJS模块
    const buildTasks = []
    for (const comp of componentNames) {
      let entry = ''
      if (fs.existsSync(resolve(rootDir, `src/components/${comp}/index.vue`))) {
        entry = resolve(rootDir, `src/components/${comp}/index.vue`)
      }
      else if (fs.existsSync(resolve(rootDir, `src/components/${comp}/index.ts`))) {
        entry = resolve(rootDir, `src/components/${comp}/index.ts`)
      }
      else {
        console.warn(`组件${comp}没有入口文件，跳过`)
        continue
      }
      buildTasks.push((async () => {
        console.log(`开始打包ES模块: ${comp}`)
        await buildSingleComponent({
          comp,
          entry,
          format: 'es',
          outDir: `moluoxixi/es/${comp}`,
          entryFileName: 'index.mjs',
          chunkExt: 'mjs',
        })
      })())
      buildTasks.push((async () => {
        console.log(`开始打包CJS模块: ${comp}`)
        await buildSingleComponent({
          comp,
          entry,
          format: 'cjs',
          outDir: `moluoxixi/lib/${comp}`,
          entryFileName: 'index.cjs',
          chunkExt: 'cjs',
        })
      })())
    }
    await Promise.all(buildTasks)
    console.log('所有组件打包完成！')
  }
  catch (error) {
    console.error('打包过程中发生错误:', error)
    return 1
  }
  return 0
}

buildComponents().then((exitCode) => {
  if (exitCode !== 0) {
    console.error('构建失败')
  }
})
