import React, { useEffect, useState } from 'react'

export default function App() {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME
  const CLOUD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET
  const INSTAGRAM_CLIENT_ID = import.meta.env.VITE_INSTAGRAM_CLIENT_ID
  const INSTAGRAM_REDIRECT = import.meta.env.VITE_INSTAGRAM_REDIRECT || (window.location.origin + '/.netlify/functions/instagram-callback')

  const [posts, setPosts] = useState([])
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchPosts()
    const url = new URL(window.location.href)
    const igUser = url.searchParams.get('ig_user')
    if (igUser) {
      try { setUser(JSON.parse(igUser)) } catch (e) {}
      url.searchParams.delete('ig_user')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch('/.netlify/functions/get-posts')
      const data = await res.json()
      setPosts(data || [])
    } catch (err) { console.error(err) }
  }

  function loginWithInstagram() {
    const redirect_uri = INSTAGRAM_REDIRECT
    const url = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=user_profile,user_media&response_type=code`
    window.location.href = url
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return alert('Pick a photo')
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('upload_preset', CLOUD_PRESET)
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: form })
      const cloudJson = await cloudRes.json()
      const imageUrl = cloudJson.secure_url
      const body = { imageUrl, caption, author: user?.username || null }
      await fetch('/.netlify/functions/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      setFile(null); setCaption('')
      fetchPosts()
    } catch (err) {
      console.error(err); alert('Upload failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-4">
      <header className="max-w-4xl mx-auto flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">My Photo Journal 🌸</h1>
        <div>
          {user ? <div className="text-sm">Signed in as <strong>{user.username}</strong></div> :
            <button onClick={loginWithInstagram} className="px-3 py-1 rounded shadow bg-white">Login with Instagram</button>}
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <section className="bg-white p-4 rounded shadow mb-6">
          <form onSubmit={handleUpload} className="flex flex-col gap-3">
            <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0])} />
            <input value={caption} onChange={(e)=>setCaption(e.target.value)} placeholder="Write a caption..." className="p-2 border rounded" />
            <div className="flex gap-2">
              <button disabled={loading} type="submit" className="px-4 py-2 rounded bg-pink-300">
                {loading ? 'Uploading...' : 'Post'}
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {posts.map(p => (
              <article key={p.id} className="bg-white rounded shadow overflow-hidden">
                <img src={p.image_url} alt={p.caption || 'photo'} className="w-full h-48 object-cover" />
                <div className="p-2">
                  <div className="text-xs text-gray-500">{p.author || 'anon'}</div>
                  <div className="text-sm">{p.caption}</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
