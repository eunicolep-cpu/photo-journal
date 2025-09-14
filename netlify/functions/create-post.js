const fetch = require('node-fetch')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_KEY = process.env.SUPABASE_KEY
    const body = JSON.parse(event.body || '{}')
    const { imageUrl, caption, author } = body

    const payload = { image_url: imageUrl, caption: caption || null, author: author || null }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
