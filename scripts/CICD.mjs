import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../.env')
const envText = fs.readFileSync(envPath, 'utf-8')
const envObj = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter(line => line.includes('='))
    .map(line => line.split('=')),
)

const appCode = envObj.VITE_GLOB_APP_CODE.replace(/["']/g, '')

const ciPath = path.resolve(__dirname, '../.gitlab-ci.yml')
if (fs.existsSync(ciPath)) {
  const ciText = fs.readFileSync(ciPath, 'utf-8')
  const oldCiText = ciText.match(/variables:\s+systemCode: '(.*)'/)
  const oldAppCode = oldCiText && oldCiText[1]
  // 处理.gitlab-ci.yml文件
  if (oldAppCode === appCode) {
    console.log(
      'appCode in .gitlab-ci.yml is the same as the environment variable, no need to update',
    )
  }
  else {
    const newCiText = ciText.replace(
      /variables:\s+systemCode: '.*'/,
      `variables:\r  systemCode: '${appCode}'`,
    )

    fs.writeFileSync(ciPath, newCiText)

    execSync('git add .gitlab-ci.yml')
    execSync('git commit -m "chore: update appCode in .gitlab-ci.yml"  --no-verify')

    // 处理.gitignore文件
    const gitignorePath = path.resolve(__dirname, '../.gitignore')
    if (fs.existsSync(gitignorePath)) {
      const gitignoreText = fs.readFileSync(gitignorePath, 'utf-8')
      if (gitignoreText.includes(appCode)) {
        console.log(
          'appCode in .gitignore is the same as the environment variable, no need to update',
        )
      }
      else {
        const newGitignoreText = gitignoreText.replaceAll(oldAppCode, `${appCode}`)
        fs.writeFileSync(gitignorePath, newGitignoreText)

        execSync('git add .gitignore')
        execSync('git commit --no-verify -m "chore: update appCode in .gitignore" --no-verify')
      }
    }
    else {
      console.log('.gitignore file not found')
    }
  }
}
