const fetch = require('node-fetch')

exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {}
    const code = params.code
    if (!code) return { statusCode: 400, body: 'Missing code' }

    const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID
    const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET
    const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI

    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: INSTAGRAM_CLIENT_ID,
        client_secret: INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code
      })
    })

    const tokenJson = await tokenRes.json()
    const access_token = tokenJson.access_token
    if (!access_token) return { statusCode: 500, body: JSON.stringify(tokenJson) }

    const profileRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${access_token}`)
    const profile = await profileRes.json()

    const redirectTo = `${process.env.NETLIFY_SITE_URL || ''}/?ig_user=${encodeURIComponent(JSON.stringify(profile))}`
    return { statusCode: 302, headers: { Location: redirectTo }, body: '' }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
