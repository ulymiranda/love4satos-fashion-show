import { useState, useEffect } from 'react'
import axios from '../api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dogs') // 'dogs' | 'spectators'

  const [registrations, setRegistrations] = useState([])
  const [spectators, setSpectators] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  const [dogSearch, setDogSearch] = useState('')
  const [dogFilter, setDogFilter] = useState('all')
  const [specSearch, setSpecSearch] = useState('')
  const [specFilter, setSpecFilter] = useState('all')

  useEffect(() => {
    axios.get('/api/admin/session', { withCredentials: true })
      .then(r => { if (r.data.isAdmin) { setIsAdmin(true); loadData() } })
      .catch(() => {})
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    try {
      await axios.post('/api/admin/login', { password }, { withCredentials: true })
      setIsAdmin(true)
      loadData()
      toast.success('Welcome back, admin!')
    } catch {
      toast.error('Incorrect password')
    }
  }

  async function handleLogout() {
    await axios.post('/api/admin/logout', {}, { withCredentials: true })
    setIsAdmin(false)
    setRegistrations([])
    setSpectators([])
    setStats(null)
  }

  async function loadData() {
    setLoading(true)
    try {
      const [regRes, specRes, statsRes] = await Promise.all([
        axios.get('/api/admin/registrations', { withCredentials: true }),
        axios.get('/api/admin/spectators', { withCredentials: true }),
        axios.get('/api/admin/stats', { withCredentials: true }),
      ])
      setRegistrations(regRes.data)
      setSpectators(specRes.data)
      setStats(statsRes.data)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function toggleDogCheckIn(reg) {
    try {
      await axios.patch(`/api/admin/registrations/${reg.id}/checkin`, { checked_in: !reg.checked_in }, { withCredentials: true })
      setRegistrations(regs => regs.map(r => r.id === reg.id ? { ...r, checked_in: reg.checked_in ? 0 : 1 } : r))
      setStats(s => s ? { ...s, checkedInDogs: s.checkedInDogs + (reg.checked_in ? -1 : 1) } : s)
    } catch { toast.error('Failed to update') }
  }

  async function toggleSpecCheckIn(spec) {
    try {
      await axios.patch(`/api/admin/spectators/${spec.id}/checkin`, { checked_in: !spec.checked_in }, { withCredentials: true })
      setSpectators(specs => specs.map(s => s.id === spec.id ? { ...s, checked_in: spec.checked_in ? 0 : 1 } : s))
      setStats(s => s ? { ...s, checkedInSpectators: s.checkedInSpectators + (spec.checked_in ? -1 : 1) } : s)
    } catch { toast.error('Failed to update') }
  }

  async function deleteDog(id) {
    if (!window.confirm('Delete this dog registration?')) return
    try {
      await axios.delete(`/api/admin/registrations/${id}`, { withCredentials: true })
      setRegistrations(regs => regs.filter(r => r.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed to delete') }
  }

  async function deleteSpectator(id) {
    if (!window.confirm('Delete this spectator registration?')) return
    try {
      await axios.delete(`/api/admin/spectators/${id}`, { withCredentials: true })
      setSpectators(specs => specs.filter(s => s.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed to delete') }
  }

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <div className="card-dark text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h1 className="text-white font-serif font-bold text-2xl mb-2">Admin Access</h1>
            <p className="text-gray-500 text-sm mb-6">Enter your admin password to continue</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Admin password" required
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-satos-gold focus:outline-none"
              />
              <button type="submit" className="w-full btn-gold">Login</button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const filteredDogs = registrations.filter(r => {
    const s = dogSearch.toLowerCase()
    const matchSearch = !s || r.dog_name.toLowerCase().includes(s) || r.owner_name.toLowerCase().includes(s) ||
      r.email.toLowerCase().includes(s) || String(r.dog_number).includes(s)
    const matchFilter = dogFilter === 'all' || (dogFilter === 'checked' && r.checked_in) || (dogFilter === 'unchecked' && !r.checked_in)
    return matchSearch && matchFilter
  })

  const filteredSpecs = spectators.filter(s => {
    const q = specSearch.toLowerCase()
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    const matchFilter = specFilter === 'all' || (specFilter === 'checked' && s.checked_in) || (specFilter === 'unchecked' && !s.checked_in)
    return matchSearch && matchFilter
  })

  return (
    <div className="bg-black min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-white font-serif font-black text-3xl">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Love 4 Satos Dog Fashion Show 2026</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={loadData} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              ↻ Refresh
            </button>
            <button onClick={handleLogout} className="bg-satos-red hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-dark text-center">
              <div className="text-satos-gold font-serif font-black text-4xl">{stats.totalDogs}</div>
              <div className="text-gray-400 text-sm mt-1">Dogs Registered</div>
              <div className="text-gray-600 text-xs">{stats.checkedInDogs} checked in</div>
            </div>
            <div className="card-dark text-center">
              <div className="text-blue-400 font-serif font-black text-4xl">{stats.totalTickets}</div>
              <div className="text-gray-400 text-sm mt-1">Spectator Tickets</div>
              <div className="text-gray-600 text-xs">{stats.totalSpectators} registrations</div>
            </div>
            <div className="card-dark text-center">
              <div className="text-green-400 font-serif font-black text-4xl">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm mt-1">Expected Cash</div>
              <div className="text-gray-600 text-xs">${stats.dogRevenue} dogs + ${stats.spectatorRevenue} tickets</div>
            </div>
            <div className="card-dark text-center">
              <div className="text-white font-serif font-black text-4xl">
                {stats.totalDogs + stats.totalTickets}
              </div>
              <div className="text-gray-400 text-sm mt-1">Total Attendees</div>
              <div className="text-gray-600 text-xs">Dogs + spectators</div>
            </div>
          </div>
        )}

        {/* Theme distribution */}
        {stats && stats.themeDistribution.length > 0 && (
          <div className="card-dark mb-8">
            <h2 className="text-satos-gold font-serif font-bold text-xl mb-4">Costume Themes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stats.themeDistribution.map(t => (
                <div key={t.costume_theme} className="bg-gray-950 rounded-lg px-4 py-3 flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{t.costume_theme}</span>
                  <span className="text-satos-gold font-bold ml-2">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex rounded-xl overflow-hidden border border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('dogs')}
            className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === 'dogs' ? 'bg-satos-red text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
          >
            🐾 Dog Registrations ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('spectators')}
            className={`flex-1 py-3 text-sm font-bold border-l border-gray-700 transition-all ${activeTab === 'spectators' ? 'bg-satos-red text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
          >
            🎟️ Spectators ({spectators.length})
          </button>
        </div>

        {/* ── DOGS TAB ── */}
        {activeTab === 'dogs' && (
          <div className="card-dark overflow-hidden">
            <div className="flex flex-wrap gap-3 mb-4 items-center justify-between">
              <h2 className="text-satos-gold font-serif font-bold text-xl">Dogs ({filteredDogs.length})</h2>
              <div className="flex gap-2 flex-wrap">
                <a href="/api/admin/registrations/export" target="_blank" rel="noopener noreferrer"
                  className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs transition-colors">
                  ↓ Export CSV
                </a>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <input type="text" value={dogSearch} onChange={e => setDogSearch(e.target.value)}
                placeholder="Search by name, email, dog #..."
                className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-satos-gold focus:outline-none flex-1 min-w-[200px]"
              />
              <select value={dogFilter} onChange={e => setDogFilter(e.target.value)}
                className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-satos-gold focus:outline-none">
                <option value="all">All</option>
                <option value="checked">Checked In</option>
                <option value="unchecked">Not Checked In</option>
              </select>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      {['#', 'Dog', 'Owner', 'Contact', 'Theme', 'Check-In', 'Actions'].map(h => (
                        <th key={h} className="text-left text-gray-400 font-medium pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDogs.map(reg => (
                      <tr key={reg.id} className={`border-b border-gray-800 hover:bg-gray-800/30 transition-colors ${reg.checked_in ? 'bg-green-900/10' : ''}`}>
                        <td className="py-3 pr-4">
                          <span className="text-satos-gold font-bold font-mono">#{String(reg.dog_number).padStart(3, '0')}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="text-white font-medium">{reg.dog_name}</div>
                          <div className="text-gray-500 text-xs">{reg.dog_breed} · {reg.dog_age}</div>
                        </td>
                        <td className="py-3 pr-4 text-gray-300">{reg.owner_name}</td>
                        <td className="py-3 pr-4 hidden md:table-cell">
                          <div className="text-gray-400 text-xs">{reg.email}</div>
                          <div className="text-gray-500 text-xs">{reg.phone}</div>
                        </td>
                        <td className="py-3 pr-4 hidden lg:table-cell">
                          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">{reg.costume_theme}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <button onClick={() => toggleDogCheckIn(reg)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${reg.checked_in ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                            {reg.checked_in ? '✓ Paid & In' : 'Check In'}
                          </button>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <a href={`/api/registrations/${reg.dog_number}/badge`} target="_blank" rel="noopener noreferrer"
                              className="text-satos-gold hover:underline text-xs">Badge</a>
                            <button onClick={() => deleteDog(reg.id)} className="text-red-500 hover:text-red-400 text-xs">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredDogs.length === 0 && (
                      <tr><td colSpan={7} className="text-center text-gray-600 py-8">
                        {registrations.length === 0 ? 'No dog registrations yet.' : 'No results.'}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── SPECTATORS TAB ── */}
        {activeTab === 'spectators' && (
          <div className="card-dark overflow-hidden">
            <div className="flex flex-wrap gap-3 mb-4 items-center justify-between">
              <h2 className="text-satos-gold font-serif font-bold text-xl">Spectators ({filteredSpecs.length})</h2>
              <a href="/api/admin/spectators/export" target="_blank" rel="noopener noreferrer"
                className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs transition-colors">
                ↓ Export CSV
              </a>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <input type="text" value={specSearch} onChange={e => setSpecSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-satos-gold focus:outline-none flex-1 min-w-[200px]"
              />
              <select value={specFilter} onChange={e => setSpecFilter(e.target.value)}
                className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-satos-gold focus:outline-none">
                <option value="all">All</option>
                <option value="checked">Checked In</option>
                <option value="unchecked">Not Checked In</option>
              </select>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      {['Name', 'Contact', 'Tickets', 'Cash Due', 'Check-In', 'Actions'].map(h => (
                        <th key={h} className="text-left text-gray-400 font-medium pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSpecs.map(spec => (
                      <tr key={spec.id} className={`border-b border-gray-800 hover:bg-gray-800/30 transition-colors ${spec.checked_in ? 'bg-green-900/10' : ''}`}>
                        <td className="py-3 pr-4 text-white font-medium">{spec.name}</td>
                        <td className="py-3 pr-4 hidden md:table-cell">
                          <div className="text-gray-400 text-xs">{spec.email}</div>
                          <div className="text-gray-500 text-xs">{spec.phone}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-satos-gold font-bold">{spec.tickets}</span>
                          <span className="text-gray-500 text-xs ml-1">ticket{spec.tickets > 1 ? 's' : ''}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-green-400 font-bold">${spec.tickets * 10}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <button onClick={() => toggleSpecCheckIn(spec)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${spec.checked_in ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                            {spec.checked_in ? '✓ Paid & In' : 'Check In'}
                          </button>
                        </td>
                        <td className="py-3">
                          <button onClick={() => deleteSpectator(spec.id)} className="text-red-500 hover:text-red-400 text-xs">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {filteredSpecs.length === 0 && (
                      <tr><td colSpan={6} className="text-center text-gray-600 py-8">
                        {spectators.length === 0 ? 'No spectator registrations yet.' : 'No results.'}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
