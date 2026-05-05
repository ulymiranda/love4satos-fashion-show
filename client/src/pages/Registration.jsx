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
  'Other',
]

export default function Registration() {
  const [tab, setTab] = useState('dog') // 'dog' | 'spectator'
  const [dogCount, setDogCount] = useState(0)

  // Dog registration form
  const [dogForm, setDogForm] = useState({
    owner_name: '', email: '', phone: '',
    dog_name: '', dog_breed: '', dog_age: '',
    costume_theme: '', special_accommodations: ''
  })
  const [dogSubmitting, setDogSubmitting] = useState(false)
  const [dogSuccess, setDogSuccess] = useState(null)

  // Spectator form
  const [specForm, setSpecForm] = useState({
    name: '', email: '', phone: '', tickets: '1'
  })
  const [specSubmitting, setSpecSubmitting] = useState(false)
  const [specSuccess, setSpecSuccess] = useState(null)

  useEffect(() => {
    axios.get('/api/registrations/count').then(r => setDogCount(r.data.count)).catch(() => {})
  }, [])

  function handleDogChange(e) {
    const { name, value } = e.target
    setDogForm(f => ({ ...f, [name]: value }))
  }

  function handleSpecChange(e) {
    const { name, value } = e.target
    setSpecForm(f => ({ ...f, [name]: value }))
  }

  async function handleDogSubmit(e) {
    e.preventDefault()
    setDogSubmitting(true)
    try {
      const res = await axios.post('/api/registrations', dogForm)
      setDogSuccess(res.data)
      setDogCount(c => c + 1)
      toast.success('Registration successful! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setDogSubmitting(false)
    }
  }

  async function handleSpecSubmit(e) {
    e.preventDefault()
    setSpecSubmitting(true)
    try {
      const res = await axios.post('/api/registrations/spectators', specForm)
      setSpecSuccess(res.data)
      toast.success('Spectator registration confirmed! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setSpecSubmitting(false)
    }
  }

  // ── Dog registration success screen ──────────────────────────────────────
  if (dogSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="bg-gray-900 border-2 border-satos-gold rounded-2xl p-8">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-satos-gold font-serif font-black text-4xl mb-2">You're In!</h2>
            <p className="text-white text-lg mb-4">{dogSuccess.message}</p>

            {/* Cash payment reminder */}
            <div className="bg-satos-red/20 border border-satos-red rounded-xl p-4 mb-5 text-left">
              <div className="text-satos-gold font-bold mb-1">💵 Payment Reminder</div>
              <p className="text-gray-300 text-sm">
                Please bring <strong className="text-white">$25 cash</strong> on event day to complete your entry.
                Payment is collected at the check-in desk.
              </p>
            </div>

            <div className="bg-black border border-satos-gold rounded-xl p-5 mb-6">
              <div className="text-gray-400 text-sm mb-1">Your Contestant Number</div>
              <div className="text-satos-gold font-serif font-black text-6xl">
                #{String(dogSuccess.dog_number).padStart(3, '0')}
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              A confirmation email with your printable badge has been sent. See you on the red carpet!
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a
                href={`/api/registrations/${dogSuccess.dog_number}/badge`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                Download Badge PDF
              </a>
              <button onClick={() => setDogSuccess(null)} className="btn-primary">
                Register Another Dog
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Spectator success screen ──────────────────────────────────────────────
  if (specSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="bg-gray-900 border-2 border-satos-gold rounded-2xl p-8">
            <div className="text-8xl mb-4">🌟</div>
            <h2 className="text-satos-gold font-serif font-black text-4xl mb-2">See You There!</h2>
            <p className="text-white text-lg mb-4">{specSuccess.message}</p>

            {/* Cash payment reminder */}
            <div className="bg-satos-red/20 border border-satos-red rounded-xl p-4 mb-5 text-left">
              <div className="text-satos-gold font-bold mb-1">💵 Payment Reminder</div>
              <p className="text-gray-300 text-sm">
                Please bring <strong className="text-white">
                  ${specSuccess.tickets * 10} cash
                </strong> on event day ({specSuccess.tickets} ticket{specSuccess.tickets > 1 ? 's' : ''} × $10 each).
                Payment is collected at the entrance.
              </p>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              A confirmation email has been sent to you. We can't wait to see you at the show!
            </p>
            <button onClick={() => setSpecSuccess(null)} className="btn-gold">
              Register More Spectators
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main page ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-black min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Page header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-satos-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Walk the Red Carpet
          </div>
          <h1 className="section-title">Register for the Show</h1>
          <div className="gold-divider"></div>
          {dogCount > 0 && (
            <p className="text-gray-400 mt-2">
              Join <strong className="text-satos-gold">{dogCount}</strong> dogs already registered!
            </p>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl overflow-hidden border border-gray-700 mb-8">
          <button
            onClick={() => setTab('dog')}
            className={`flex-1 py-3 text-sm font-bold transition-all ${
              tab === 'dog'
                ? 'bg-satos-red text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            🐾 Register Your Dog — $25
          </button>
          <button
            onClick={() => setTab('spectator')}
            className={`flex-1 py-3 text-sm font-bold transition-all border-l border-gray-700 ${
              tab === 'spectator'
                ? 'bg-satos-red text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            🎟️ Attend as Spectator — $10
          </button>
        </div>

        {/* ── DOG REGISTRATION ── */}
        {tab === 'dog' && (
          <>
            {/* Fee notice */}
            <div className="bg-satos-gold/10 border border-satos-gold rounded-xl p-4 mb-6 flex gap-3 items-start">
              <span className="text-2xl shrink-0">💵</span>
              <div>
                <div className="text-satos-gold font-bold text-sm mb-0.5">Entry Fee: $25 per dog — Cash Only</div>
                <p className="text-gray-400 text-xs">
                  Payment is collected at the check-in desk on event day. Your spot is reserved once you submit this form.
                  Every registered dog automatically competes in all contest categories.
                </p>
              </div>
            </div>

            <form onSubmit={handleDogSubmit} className="space-y-6">
              {/* Owner Info */}
              <div className="card-dark">
                <h3 className="text-satos-gold font-serif font-bold text-lg mb-4">Owner Information</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Full Name *</label>
                    <input
                      type="text" name="owner_name" value={dogForm.owner_name} onChange={handleDogChange} required
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address *</label>
                    <input
                      type="email" name="email" value={dogForm.email} onChange={handleDogChange} required
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Phone Number *</label>
                    <input
                      type="tel" name="phone" value={dogForm.phone} onChange={handleDogChange} required
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
                      type="text" name="dog_name" value={dogForm.dog_name} onChange={handleDogChange} required
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                      placeholder="Your dog's name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Dog Breed *</label>
                    <input
                      type="text" name="dog_breed" value={dogForm.dog_breed} onChange={handleDogChange} required
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                      placeholder="e.g. Sato Mix, Labrador, Poodle"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Dog Age *</label>
                    <input
                      type="text" name="dog_age" value={dogForm.dog_age} onChange={handleDogChange} required
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                      placeholder="e.g. 2 years, 6 months"
                    />
                  </div>
                </div>
              </div>

              {/* Costume Theme */}
              <div className="card-dark">
                <h3 className="text-satos-gold font-serif font-bold text-lg mb-2">Costume Theme *</h3>
                <p className="text-gray-500 text-xs mb-4">Choose the theme that best describes your dog's outfit</p>
                <select
                  name="costume_theme" value={dogForm.costume_theme} onChange={handleDogChange} required
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                >
                  <option value="">Select a costume theme...</option>
                  {COSTUME_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Special Accommodations */}
              <div className="card-dark">
                <h3 className="text-satos-gold font-serif font-bold text-lg mb-4">Special Accommodations</h3>
                <textarea
                  name="special_accommodations" value={dogForm.special_accommodations} onChange={handleDogChange}
                  rows={3}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors resize-none"
                  placeholder="Any special needs, allergies, mobility requirements, or other accommodations we should know about?"
                />
              </div>

              <button
                type="submit"
                disabled={dogSubmitting}
                className="w-full btn-gold text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dogSubmitting ? 'Registering...' : '🎬 Reserve My Spot — Pay $25 at the Door'}
              </button>
            </form>
          </>
        )}

        {/* ── SPECTATOR REGISTRATION ── */}
        {tab === 'spectator' && (
          <>
            {/* Fee notice */}
            <div className="bg-satos-gold/10 border border-satos-gold rounded-xl p-4 mb-6 flex gap-3 items-start">
              <span className="text-2xl shrink-0">💵</span>
              <div>
                <div className="text-satos-gold font-bold text-sm mb-0.5">Admission: $10 per person — Cash Only</div>
                <p className="text-gray-400 text-xs">
                  Payment is collected at the entrance on event day. Registering online reserves your spot
                  and ensures you receive event updates by email.
                </p>
              </div>
            </div>

            <form onSubmit={handleSpecSubmit} className="space-y-6">
              <div className="card-dark">
                <h3 className="text-satos-gold font-serif font-bold text-lg mb-4">Your Information</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Full Name *</label>
                    <input
                      type="text" name="name" value={specForm.name} onChange={handleSpecChange} required
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address *</label>
                    <input
                      type="email" name="email" value={specForm.email} onChange={handleSpecChange} required
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Phone Number *</label>
                    <input
                      type="tel" name="phone" value={specForm.phone} onChange={handleSpecChange} required
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                      placeholder="(787) 555-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Number of Tickets *</label>
                    <select
                      name="tickets" value={specForm.tickets} onChange={handleSpecChange} required
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none transition-colors"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} ticket{n > 1 ? 's' : ''} — ${n * 10} total</option>
                      ))}
                    </select>
                    <p className="text-gray-600 text-xs mt-1.5">$10 per person, paid in cash at the door</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={specSubmitting}
                className="w-full btn-gold text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {specSubmitting ? 'Registering...' : `🎟️ Reserve ${specForm.tickets} Ticket${specForm.tickets > 1 ? 's' : ''} — Pay $${specForm.tickets * 10} at the Door`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
