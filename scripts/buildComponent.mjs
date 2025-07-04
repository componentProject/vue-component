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

import parser from '@babel/parser'
import traverse from '@babel/traverse'
import { parse as parseSFC } from '@vue/compiler-sfc'
import dts from 'vite-plugin-dts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

function getBaseConfig(options = {}) {
  const { enableDts = false, comp = '', entry = '', outDir = '' } = options

  const plugins = [
    pluginVue(),
    vueJsx(),
  ]

  // 如果启用 dts，添加 dts 插件
  if (enableDts && comp && entry && outDir) {
    plugins.push(
      dts({
        vue: true,
        tsconfigPath: resolve(rootDir, 'tsconfig.dts.json'),
        // 关键：entryRoot 指向 src/components，类型声明 mirror 组件根目录结构
        entryRoot: resolve(rootDir, 'src/components'),
        include: [`src/components/${comp}/**/*`],
        outDir,
        skipDiagnostics: true,
        copyDtsFiles: true,
        logLevel: 'warn',
        cleanVueFileName: true,
        insertTypesEntry: true,
        staticImport: true,
        excludeExternals: true,
        rollupTypes: true,
        dtsFileName: 'index.d.ts',
        outExtension: () => '.d.ts',
      }),
    )
  }

  return {
    root: rootDir,
    base: './',
    configFile: false,
    plugins,
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
async function buildSingleComponent({ comp, entry, format, outDir, enableDts = false }) {
  await build({
    ...getBaseConfig({ enableDts, comp, entry, outDir }),
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
        formats: [format],
      },
      rollupOptions: {
        external: ['vue', 'element-plus'],
        output: {
          // 关键：preserveModulesRoot 指向 src/components，mirror 组件根目录结构
          preserveModules: true,
          preserveModulesRoot: resolve(rootDir, 'src/components'),
          entryFileNames: format === 'es' ? `[name].mjs` : `[name].cjs`,
          chunkFileNames: format === 'es' ? `[name].mjs` : `[name].cjs`,
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'style/[name][extname]'
            }
            return '[name][extname]'
          },
        },
      },
    },
  })
  // 只在第一次打包时复制README.md到moluoxixi/组件名/
  if (format === 'es') {
    const readmeSrc = resolve(rootDir, `src/components/${comp}/README.md`)
    const readmeDest = resolve(rootDir, `moluoxixi/${comp}/README.md`)
    try {
      await fsp.access(readmeSrc)
      await fsp.copyFile(readmeSrc, readmeDest)
      console.log(`已复制README.md到: moluoxixi/${comp}/`)
    }
    catch {
      // 没有README.md则跳过
    }
  }
}

// 读取主项目package.json依赖版本
function getMainPkgDeps() {
  const pkg = JSON.parse(fs.readFileSync(resolve(rootDir, 'package.json'), 'utf-8'))
  return {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  }
}

// 递归分析文件依赖，支持.vue、.ts、.js
function extractImports(file, seen = new Set()) {
  if (!fs.existsSync(file) || seen.has(file))
    return []
  seen.add(file)
  let code = ''
  const ext = file.split('.').pop()
  if (ext === 'vue') {
    // 提取<script>内容
    const sfc = parseSFC(fs.readFileSync(file, 'utf-8'))
    code = sfc.descriptor.script?.content || ''
    if (sfc.descriptor.scriptSetup) {
      code += `\n${sfc.descriptor.scriptSetup.content}`
    }
  }
  else {
    code = fs.readFileSync(file, 'utf-8')
  }
  let imports = []
  let ast
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    })
  }
  catch {
    return []
  }
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      if (node.source.value && !node.source.value.startsWith('.')) {
        imports.push(node.source.value)
      }
      // 递归分析本地依赖
      if (node.source.value && node.source.value.startsWith('.')) {
        let depPath = node.source.value
        // 处理.vue/.ts/.js后缀
        const base = depPath.replace(/\.[a-z]+$/, '')
        const tryExts = ['.ts', '.js', '.vue']
        let found = false
        for (const ext of tryExts) {
          const fullPath = resolve(dirname(file), base + ext)
          if (fs.existsSync(fullPath)) {
            depPath = base + ext
            found = true
            break
          }
        }
        if (!found) {
          // 可能是目录，尝试index文件
          for (const ext of tryExts) {
            const fullPath = resolve(dirname(file), depPath, `index${ext}`)
            if (fs.existsSync(fullPath)) {
              depPath = `${depPath}/index${ext}`
              found = true
              break
            }
          }
        }
        if (found) {
          imports = imports.concat(extractImports(resolve(dirname(file), depPath), seen))
        }
      }
    },
  })
  return imports
}

// 生成package.json
async function generateComponentPkgJson({ comp, entry }) {
  const mainDeps = getMainPkgDeps()
  const imports = Array.from(new Set(extractImports(entry)))
  // 归类依赖
  const peerList = ['vue', 'element-plus']
  const peerDependencies = {}
  const dependencies = {}
  // 仅保留主项目package.json声明的依赖（npm包），过滤本地路径/类型文件
  const mainPkgNames = Object.keys(mainDeps)
  imports.forEach((pkg) => {
    if (!mainPkgNames.includes(pkg))
      return // 只保留npm包
    if (peerList.includes(pkg)) {
      peerDependencies[pkg] = mainDeps[pkg] || '*'
    }
    else {
      dependencies[pkg] = mainDeps[pkg] || '*'
    }
  })
  // 生成exports字段，支持多子路径
  const exports = {
    '.': {
      types: './es/index.d.ts',
      import: './es/index.mjs',
      require: './lib/index.cjs',
    },
    './es': {
      types: './es/index.d.ts',
      import: './es/index.mjs',
    },
    './lib': {
      types: './lib/index.d.ts',
      require: './lib/index.cjs',
    },
  }
  // 生成package.json内容
  const pkgJson = {
    name: `@moluoxixi/${comp}`,
    version: '1.0.0',
    description: `${comp} 组件`,
    main: 'lib/index.cjs',
    module: 'es/index.mjs',
    types: 'es/index.d.ts',
    exports,
    sideEffects: false,
    peerDependencies,
    dependencies,
    devDependencies: {},
    license: 'MIT',
    readme: './README.md',
    publishConfig: {
      access: 'public',
    },
  }
  // 检查es/style/index.css是否存在，存在则写入style字段
  const stylePath = resolve(rootDir, `moluoxixi/${comp}/es/style/index.css`)
  if (fs.existsSync(stylePath)) {
    pkgJson.style = 'es/style/index.css'
  }
  const dest = resolve(rootDir, `moluoxixi/${comp}/package.json`)
  await fsp.writeFile(dest, JSON.stringify(pkgJson, null, 2), 'utf-8')
  console.log(`已生成package.json: moluoxixi/${comp}/package.json`)
}

// 修改buildComponents，打包后生成d.ts
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
        console.log(`开始打包ES模块和类型声明: ${comp}`)
        await buildSingleComponent({
          comp,
          entry,
          format: 'es',
          outDir: `moluoxixi/${comp}/es`,
          enableDts: true,
        })
      })())
      buildTasks.push((async () => {
        console.log(`开始打包CJS模块: ${comp}`)
        await buildSingleComponent({
          comp,
          entry,
          format: 'cjs',
          outDir: `moluoxixi/${comp}/lib`,
        })
      })())
      // 打包后生成package.json
      buildTasks.push(generateComponentPkgJson({ comp, entry }))
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
