import { useState, useEffect } from 'react'
import axios from '../api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState('')
  const [registrations, setRegistrations] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCheckedIn, setFilterCheckedIn] = useState('all')

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
    setStats(null)
  }

  async function loadData() {
    setLoading(true)
    try {
      const [regRes, statsRes] = await Promise.all([
        axios.get('/api/admin/registrations', { withCredentials: true }),
        axios.get('/api/admin/stats', { withCredentials: true }),
      ])
      setRegistrations(regRes.data)
      setStats(statsRes.data)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function toggleCheckIn(reg) {
    try {
      await axios.patch(`/api/admin/registrations/${reg.id}/checkin`, { checked_in: !reg.checked_in }, { withCredentials: true })
      setRegistrations(regs => regs.map(r => r.id === reg.id ? { ...r, checked_in: reg.checked_in ? 0 : 1 } : r))
      if (stats) setStats(s => ({ ...s, checkedIn: s.checkedIn + (reg.checked_in ? -1 : 1) }))
    } catch {
      toast.error('Failed to update check-in status')
    }
  }

  async function deleteRegistration(id) {
    if (!window.confirm('Delete this registration?')) return
    try {
      await axios.delete(`/api/admin/registrations/${id}`, { withCredentials: true })
      setRegistrations(regs => regs.filter(r => r.id !== id))
      toast.success('Registration deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

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
              <button type="submit" className="w-full btn-gold">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const filtered = registrations.filter(r => {
    const matchSearch = !searchTerm ||
      r.dog_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.dog_number).includes(searchTerm)
    const matchFilter = filterCheckedIn === 'all' ||
      (filterCheckedIn === 'checked' && r.checked_in) ||
      (filterCheckedIn === 'unchecked' && !r.checked_in)
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
            <a
              href="/api/admin/registrations/export"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              ↓ Export CSV
            </a>
            <button onClick={handleLogout} className="bg-satos-red hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-dark text-center">
              <div className="text-satos-gold font-serif font-black text-4xl">{stats.total}</div>
              <div className="text-gray-400 text-sm mt-1">Total Dogs</div>
            </div>
            <div className="card-dark text-center">
              <div className="text-green-400 font-serif font-black text-4xl">{stats.checkedIn}</div>
              <div className="text-gray-400 text-sm mt-1">Checked In</div>
            </div>
            <div className="card-dark text-center">
              <div className="text-satos-red font-serif font-black text-4xl">{stats.total - stats.checkedIn}</div>
              <div className="text-gray-400 text-sm mt-1">Not Yet Arrived</div>
            </div>
            <div className="card-dark text-center">
              <div className="text-white font-serif font-black text-4xl">
                {stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%
              </div>
              <div className="text-gray-400 text-sm mt-1">Check-In Rate</div>
            </div>
          </div>
        )}

        {/* Category Stats */}
        {stats && Object.keys(stats.categoryCounts).length > 0 && (
          <div className="card-dark mb-8">
            <h2 className="text-satos-gold font-serif font-bold text-xl mb-4">Dogs Per Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(stats.categoryCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                <div key={cat} className="bg-gray-950 rounded-lg px-4 py-3 flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{cat}</span>
                  <span className="text-satos-gold font-bold ml-2">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or dog #..."
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-satos-gold focus:outline-none flex-1 min-w-[200px]"
          />
          <select
            value={filterCheckedIn} onChange={e => setFilterCheckedIn(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-satos-gold focus:outline-none"
          >
            <option value="all">All Dogs</option>
            <option value="checked">Checked In</option>
            <option value="unchecked">Not Checked In</option>
          </select>
        </div>

        {/* Registrations Table */}
        <div className="card-dark overflow-hidden">
          <h2 className="text-satos-gold font-serif font-bold text-xl mb-4">
            Registrations ({filtered.length})
          </h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 font-medium pb-3 pr-4">#</th>
                    <th className="text-left text-gray-400 font-medium pb-3 pr-4">Dog</th>
                    <th className="text-left text-gray-400 font-medium pb-3 pr-4">Owner</th>
                    <th className="text-left text-gray-400 font-medium pb-3 pr-4 hidden md:table-cell">Contact</th>
                    <th className="text-left text-gray-400 font-medium pb-3 pr-4 hidden lg:table-cell">Theme</th>
                    <th className="text-left text-gray-400 font-medium pb-3 pr-4 hidden xl:table-cell">Categories</th>
                    <th className="text-left text-gray-400 font-medium pb-3 pr-4">Check-In</th>
                    <th className="text-left text-gray-400 font-medium pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(reg => (
                    <tr key={reg.id} className={`border-b border-gray-800 hover:bg-gray-800/30 transition-colors ${reg.checked_in ? 'bg-green-900/10' : ''}`}>
                      <td className="py-3 pr-4">
                        <span className="text-satos-gold font-bold font-mono">#{String(reg.dog_number).padStart(3, '0')}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-white font-medium">{reg.dog_name}</div>
                        <div className="text-gray-500 text-xs">{reg.dog_breed} · {reg.dog_age}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-gray-300">{reg.owner_name}</div>
                      </td>
                      <td className="py-3 pr-4 hidden md:table-cell">
                        <div className="text-gray-400 text-xs">{reg.email}</div>
                        <div className="text-gray-500 text-xs">{reg.phone}</div>
                      </td>
                      <td className="py-3 pr-4 hidden lg:table-cell">
                        <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">{reg.costume_theme}</span>
                      </td>
                      <td className="py-3 pr-4 hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {reg.categories.split(',').map(c => (
                            <span key={c} className="bg-satos-red/20 text-red-300 text-xs px-1.5 py-0.5 rounded">{c.trim()}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <button
                          onClick={() => toggleCheckIn(reg)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            reg.checked_in
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {reg.checked_in ? '✓ In' : 'Check In'}
                        </button>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <a
                            href={`/api/registrations/${reg.dog_number}/badge`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-satos-gold hover:underline text-xs"
                            title="Download Badge"
                          >
                            Badge
                          </a>
                          <button
                            onClick={() => deleteRegistration(reg.id)}
                            className="text-red-500 hover:text-red-400 text-xs"
                            title="Delete Registration"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center text-gray-600 py-8">
                        {registrations.length === 0 ? 'No registrations yet.' : 'No results match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
