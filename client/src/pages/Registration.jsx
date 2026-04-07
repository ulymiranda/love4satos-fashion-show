import { useState, useEffect } from 'react'
import axios from '../api'
import toast from 'react-hot-toast'

const COSTUME_THEMES = [
  'Hollywood Glamour',
  'Fairy Tales',
  'Pop Culture',
  'Historical Era',
  'Matching Duo',
  'Professional Attire',
]

const CONTEST_CATEGORIES = [
  { id: 'Best in Show', label: 'Best in Show 🏆' },
  { id: 'Most Fashionable', label: 'Most Fashionable 👗' },
  { id: 'Funniest', label: 'Funniest 😂' },
  { id: 'Most Glamorous', label: 'Most Glamorous 💎' },
  { id: 'Best Trick', label: 'Best Trick 🎩' },
  { id: 'Best Story', label: 'Best Story 📖' },
  { id: 'Best Duo', label: 'Best Duo 👫' },
  { id: 'Best Handmade', label: 'Best Handmade Costume 🧵' },
  { id: 'Cutest Puppy', label: 'Cutest Puppy 🐶' },
  { id: 'Senior Dog Star', label: 'Senior Dog Star ⭐' },
  { id: 'Most Charming', label: 'Most Charming ✨' },
]

export default function Registration() {
  const [dogCount, setDogCount] = useState(0)
  const [form, setForm] = useState({
    owner_name: '', email: '', phone: '',
    dog_name: '', dog_breed: '', dog_age: '',
    costume_theme: '', categories: [], special_accommodations: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    axios.get('/api/registrations/count').then(r => setDogCount(r.data.count)).catch(() => {})
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handleCategory(id) {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter(c => c !== id)
        : [...f.categories, id]
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.categories.length === 0) {
      toast.error('Please select at least one contest category.')
      return
    }
    setSubmitting(true)
    try {
      const res = await axios.post('/api/registrations', form)
      setSuccess(res.data)
      setDogCount(c => c + 1)
      toast.success('Registration successful! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="bg-gray-900 border-2 border-satos-gold rounded-2xl p-8">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-satos-gold font-serif font-black text-4xl mb-2">You're In!</h2>
            <p className="text-white text-lg mb-4">{success.message}</p>
            <div className="bg-black border border-satos-gold rounded-xl p-5 mb-6">
              <div className="text-gray-400 text-sm mb-1">Your Contestant Number</div>
              <div className="text-satos-gold font-serif font-black text-6xl">
                #{String(success.dog_number).padStart(3, '0')}
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6">A confirmation email with your printable badge has been sent. See you on the red carpet!</p>
            <div className="flex gap-3 justify-center">
              <a
                href={`/api/registrations/${success.dog_number}/badge`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                Download Badge PDF
              </a>
              <button onClick={() => setSuccess(null)} className="btn-primary">
                Register Another Dog
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-satos-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Walk the Red Carpet
          </div>
          <h1 className="section-title">Register Your Dog</h1>
          <div className="gold-divider"></div>
          {dogCount > 0 && (
            <p className="text-gray-400 mt-2">
              Join <strong className="text-satos-gold">{dogCount}</strong> dogs already registered!
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Owner Info */}
          <div className="card-dark">
            <h3 className="text-satos-gold font-serif font-bold text-lg mb-4">Owner Information</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Full Name *</label>
                <input
                  type="text" name="owner_name" value={form.owner_name} onChange={handleChange} required
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address *</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Phone Number *</label>
                <input
                  type="tel" name="phone" value={form.phone} onChange={handleChange} required
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                  placeholder="(787) 555-0000"
                />
              </div>
            </div>
          </div>

          {/* Dog Info */}
          <div className="card-dark">
            <h3 className="text-satos-gold font-serif font-bold text-lg mb-4">Dog Information</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Dog's Name *</label>
                <input
                  type="text" name="dog_name" value={form.dog_name} onChange={handleChange} required
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                  placeholder="Your dog's name"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Dog Breed *</label>
                <input
                  type="text" name="dog_breed" value={form.dog_breed} onChange={handleChange} required
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                  placeholder="e.g. Sato Mix, Labrador, Poodle"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Dog Age *</label>
                <input
                  type="text" name="dog_age" value={form.dog_age} onChange={handleChange} required
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                  placeholder="e.g. 2 years, 6 months"
                />
              </div>
            </div>
          </div>

          {/* Costume Theme */}
          <div className="card-dark">
            <h3 className="text-satos-gold font-serif font-bold text-lg mb-4">Costume Theme *</h3>
            <select
              name="costume_theme" value={form.costume_theme} onChange={handleChange} required
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
            >
              <option value="">Select a costume theme...</option>
              {COSTUME_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Contest Categories */}
          <div className="card-dark">
            <h3 className="text-satos-gold font-serif font-bold text-lg mb-2">Contest Categories *</h3>
            <p className="text-gray-500 text-sm mb-4">Select all categories you'd like to enter</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CONTEST_CATEGORIES.map(cat => (
                <label key={cat.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                  form.categories.includes(cat.id)
                    ? 'border-satos-gold bg-satos-gold/10 text-white'
                    : 'border-gray-800 text-gray-400 hover:border-gray-600'
                }`}>
                  <input
                    type="checkbox"
                    checked={form.categories.includes(cat.id)}
                    onChange={() => handleCategory(cat.id)}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                    form.categories.includes(cat.id) ? 'bg-satos-gold border-satos-gold' : 'border-gray-600'
                  }`}>
                    {form.categories.includes(cat.id) && <span className="text-black text-xs font-bold">✓</span>}
                  </span>
                  <span className="text-sm">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Accommodations */}
          <div className="card-dark">
            <h3 className="text-satos-gold font-serif font-bold text-lg mb-4">Special Accommodations</h3>
            <textarea
              name="special_accommodations" value={form.special_accommodations} onChange={handleChange}
              rows={3}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors resize-none"
              placeholder="Any special needs, allergies, mobility requirements, or other accommodations we should know about?"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-gold text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Registering...' : '🎬 Register for the Show!'}
          </button>
        </form>
      </div>
    </div>
  )
}
