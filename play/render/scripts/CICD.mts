import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
// 使用 resolve 确保跨平台兼容性（支持 Linux 和 Windows）
const rootDir = resolve(__dirname, '..')
const envPath = resolve(rootDir, '.env')
const envText = readFileSync(envPath, 'utf-8')
const envObj = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter(line => line.includes('='))
    .map(line => line.split('=')),
)

const appCode = envObj.VITE_APP_CODE.replace(/["']/g, '')
const ciPath = resolve(rootDir, '.gitlab-ci.yml')
if (existsSync(ciPath)) {
  const ciText = readFileSync(ciPath, 'utf-8')
  const oldCiText = ciText.match(/variables:\s+systemCode: (.*)/)
  const oldAppCode = oldCiText && oldCiText[1]
  // 处理.gitlab-ci.yml文件
  if (oldAppCode === appCode) {
    console.log(
      'appCode in .gitlab-ci.yml is the same as the environment variable, no need to update',
    )
  }
  else {
    const newCiText = ciText.replace(
      /variables:\s+systemCode:(.*)/,
      `variables:\r  systemCode: ${appCode}`,
    )

    writeFileSync(ciPath, newCiText)

    execSync('git add .gitlab-ci.yml')
    execSync('git commit -m "chore: update appCode in .gitlab-ci.yml"  --no-verify')

    // 处理.gitignore文件
    const gitignorePath = resolve(rootDir, '.gitignore')
    if (existsSync(gitignorePath)) {
      const gitignoreText = readFileSync(gitignorePath, 'utf-8')
      if (gitignoreText.includes(appCode)) {
        console.log(
          'appCode in .gitignore is the same as the environment variable, no need to update',
        )
      }
      else {
        if (oldAppCode) {
          const newGitignoreText = gitignoreText.replaceAll(oldAppCode, `${appCode}`)
          writeFileSync(gitignorePath, newGitignoreText)

          execSync('git add .gitignore')
          execSync('git commit --no-verify -m "chore: update appCode in .gitignore" --no-verify')
        }
        else {
          console.log('oldAppCode is null, cannot update .gitignore')
        }
      }
    }
    else {
      console.log('.gitignore file not found')
    }
  }
}
