import { Link } from 'react-router-dom'

export default function Footer() {
  const shareText = encodeURIComponent('Join us at the Love 4 Satos Dog Fashion Show! May 9, 2026 at The Baldwin School of Puerto Rico VPAC 🐾✨')
  const shareUrl = encodeURIComponent(window.location.origin)

  return (
    <footer className="bg-gray-950 border-t-2 border-satos-gold mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <div className="text-satos-gold font-serif font-black text-2xl mb-2">LOVE 4 SATOS</div>
            <div className="text-gray-400 text-sm mb-4">Dog Fashion Show 2026</div>
            <p className="text-gray-500 text-sm">A glamorous celebration of rescued dogs at The Baldwin School of Puerto Rico.</p>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-white font-semibold mb-3">Quick Links</div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-satos-gold transition-colors">Home</Link></li>
              <li><Link to="/register" className="hover:text-satos-gold transition-colors">Register Your Dog</Link></li>
              <li><Link to="/event-info" className="hover:text-satos-gold transition-colors">Event Info &amp; FAQ</Link></li>
              <li><Link to="/sponsors" className="hover:text-satos-gold transition-colors">Sponsors</Link></li>
              <li><Link to="/admin" className="hover:text-satos-gold transition-colors text-gray-600">Admin</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <div className="text-white font-semibold mb-3">Share the Love 🐾</div>
            <div className="flex gap-3">
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Instagram
              </a>
              <a
                href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-500 transition-colors"
              >
                WhatsApp
              </a>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <div>📅 May 9, 2026 • 5:30–8:00 PM</div>
              <div>📍 The Baldwin School VPAC, PR</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-600 text-xs">
          © 2026 Love 4 Satos. All rights reserved. Made with 🐾 in Puerto Rico.
        </div>
      </div>
    </footer>
  )
}
