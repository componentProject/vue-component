import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import process from 'node:process'

const baseDir = path.resolve(process.cwd(), 'moluoxixi')
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

const components = fs.readdirSync(baseDir).filter((name) => {
  return fs.existsSync(path.join(baseDir, name, 'package.json'))
})

for (const comp of components) {
  const compDir = path.join(baseDir, comp)
  console.log(`\n==== 发布组件: ${comp} ====`)
  try {
    execSync(`pnpm publish${dryRun ? ' --dry-run' : ''} --access public`, { cwd: compDir, stdio: 'inherit' })
  }
  catch (e) {
    console.error(`组件 ${comp} 发布失败:`, e.message)
  }
}

console.log('\n所有组件发布流程已完成！')
