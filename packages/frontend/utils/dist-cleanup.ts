import { readFileSync, copyFileSync, existsSync, mkdirSync } from 'fs'

const targetDir = 'bundle'

/*
copy required files, from networks tabls, copy all, copy requests in requests.txt file
cat requests.txt | grep -Eoi "(http|https)://[a-zA-Z0-9./?=_%:-]*"
*/

const requests = readFileSync('./utils/urls.txt', 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((r) => r.replace(/http:\/\/localhost:8080\//g, ''))

const uniqueRequests = [...new Set(requests)]

uniqueRequests.forEach((r) => {
  // copy as file to targetDir
  const path = r.split('/')
  const filename = path[path.length - 1]
  const dir = path.slice(0, path.length - 1).join('/')

  const finalDir = `./${targetDir}/${dir}`
  if (!existsSync(finalDir)) {
    mkdirSync(finalDir, { recursive: true })
  }

  copyFileSync(`./dist/${r}`, `./${targetDir}/${dir}/${filename}`)
})

// this one is not loaded by the browser but needed for the dist test yaml config file
copyFileSync(`./dist/manifest.json`, `./${targetDir}/manifest.json`)
