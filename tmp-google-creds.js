const fs = require('fs')
const path = require('path')

const credsPath = 'c:/Users/Sharon/Downloads/client_secret_495587277271-6buhq47qgkm695sgfl281i3jq8pdotu7.apps.googleusercontent.com.json'

try {
  const data = JSON.parse(fs.readFileSync(credsPath, 'utf8'))
  // console.log('Add to .env:')
  // console.log('GOOGLE_CLIENT_ID=' + data.client_id)
  // console.log('GOOGLE_CLIENT_SECRET=' + data.client_secret)
} catch (e) {
  console.error('Error reading creds:', e)
}
