const fetch = require('node-fetch')

exports.handler = async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_KEY = process.env.SUPABASE_KEY

    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })

    const posts = await res.json()
    return { statusCode: 200, body: JSON.stringify(posts) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
