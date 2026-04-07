import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/register', label: 'Register' },
  { to: '/event-info', label: 'Event Info' },
  { to: '/sponsors', label: 'Sponsors' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="bg-black border-b-2 border-satos-gold sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logos */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-satos-red border-2 border-satos-gold flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
            <div>
              <div className="text-satos-gold font-serif font-black text-lg leading-none">LOVE 4 SATOS</div>
              <div className="text-gray-400 text-xs leading-none">Dog Fashion Show</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 border-l border-gray-700 pl-3">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-xs font-bold text-black leading-tight text-center px-1">
              <span>TBS</span>
            </div>
            <div className="text-gray-300 text-xs leading-tight">
              <div>The Baldwin School</div>
              <div className="text-gray-500">of Puerto Rico</div>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? 'bg-satos-red text-white'
                  : 'text-gray-300 hover:text-satos-gold hover:bg-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/register" className="ml-3 btn-gold text-sm py-2 px-5">
            Register Now ✨
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950 border-t border-gray-800 px-4 py-4 flex flex-col gap-2">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                location.pathname === link.to ? 'bg-satos-red text-white' : 'text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-gold text-sm text-center mt-2">
            Register Now ✨
          </Link>
        </div>
      )}
    </header>
  )
}
