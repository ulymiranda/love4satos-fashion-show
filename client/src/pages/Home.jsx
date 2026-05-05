import { Link } from 'react-router-dom'
import CountdownTimer from '../components/CountdownTimer'

const shareText = encodeURIComponent('Join us at the Love 4 Satos Dog Fashion Show! May 9, 2026 at The Baldwin School of Puerto Rico VPAC 🐾 #Love4Satos #DogFashionShow')

export default function Home() {

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-black overflow-hidden">
        {/* Subtle burgundy background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #7B1D32 0, #7B1D32 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}>
        </div>

        {/* Silver top strip */}
        <div className="h-1 bg-gradient-to-r from-satos-gold via-white to-satos-gold"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-block bg-satos-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
                🎬 Starring Your Sato
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-black leading-none mb-3">
                <span className="text-white">LOVE</span>{' '}
                <span className="text-satos-red">4</span>{' '}
                <span className="shimmer-text">SATOS</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-serif text-gray-300 mb-2">Dog Fashion Show</h2>
              <div className="text-satos-gold text-lg font-medium mb-6">
                ✨ A Hollywood Red Carpet Experience ✨
              </div>

              {/* Event details */}
              <div className="bg-gray-900 border border-satos-gold/30 rounded-xl p-5 mb-8 space-y-2">
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-satos-gold text-xl">📅</span>
                  <span><strong className="text-white">Saturday, May 9, 2026</strong></span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-satos-gold text-xl">⏰</span>
                  <span>5:30 PM – 8:00 PM</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-satos-gold text-xl">📍</span>
                  <span>VPAC Auditorium, <strong className="text-white">The Baldwin School of Puerto Rico</strong></span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link to="/register" className="btn-gold text-center text-lg">
                  🐾 Register Your Dog
                </Link>
                <Link to="/event-info" className="btn-primary text-center text-lg">
                  Event Details
                </Link>
              </div>

            </div>

            {/* Right: event poster card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-satos-red via-satos-maroon to-black rounded-2xl p-8 border-2 border-satos-gold aspect-[3/4] flex flex-col items-center justify-center text-center shadow-2xl shadow-satos-red/30">
                <div className="text-8xl mb-4">🎬</div>
                <div className="text-satos-gold font-serif font-black text-3xl mb-2">LOVE 4 SATOS</div>
                <div className="text-white font-bold text-xl mb-1">DOG FASHION SHOW</div>
                <div className="text-gray-300 text-lg mb-4">2026</div>
                <div className="w-16 h-0.5 bg-satos-gold mb-4"></div>
                <div className="text-gray-300 text-sm mb-1">May 9, 2026</div>
                <div className="text-gray-300 text-sm mb-1">5:30 – 8:00 PM</div>
                <div className="text-gray-300 text-sm">Baldwin School VPAC</div>
                <div className="text-gray-400 text-xs mt-4">Puerto Rico</div>
                <div className="absolute top-4 left-4 text-3xl opacity-30">🐾</div>
                <div className="absolute top-4 right-4 text-3xl opacity-30">🐾</div>
                <div className="absolute bottom-4 left-4 text-3xl opacity-30">🐾</div>
                <div className="absolute bottom-4 right-4 text-3xl opacity-30">🐾</div>
              </div>
              <div className="absolute -top-3 -right-3 bg-white text-satos-red font-bold text-xs px-3 py-1 rounded-full transform rotate-12 border border-satos-gold">
                FROM $10!
              </div>
            </div>
          </div>
        </div>

        {/* Silver bottom strip */}
        <div className="h-1 bg-gradient-to-r from-satos-gold via-white to-satos-gold"></div>
      </section>

      {/* Countdown Section */}
      <section className="bg-gray-950 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-gray-400 text-sm uppercase tracking-widest mb-3">The Red Carpet Opens In</div>
          <CountdownTimer />
        </div>
      </section>


      {/* Pricing / Admission */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">Admission</h2>
          <div className="gold-divider"></div>
          <p className="text-center text-gray-400 mb-10">Cash only — paid at the door on event day</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-satos-red to-satos-maroon rounded-2xl p-8 text-center border border-satos-gold/40">
              <div className="text-6xl mb-4">🐾</div>
              <div className="text-satos-gold font-serif font-black text-5xl mb-2">$25</div>
              <div className="text-white font-bold text-xl mb-2">Dog Contestant Entry</div>
              <p className="text-gray-300 text-sm mb-4">Per dog · Cash only · Paid at check-in</p>
              <p className="text-gray-400 text-xs">
                All registered dogs compete in every contest category automatically!
              </p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 text-center border border-satos-gold/40">
              <div className="text-6xl mb-4">🎟️</div>
              <div className="text-satos-gold font-serif font-black text-5xl mb-2">$10</div>
              <div className="text-white font-bold text-xl mb-2">Spectator Admission</div>
              <p className="text-gray-400 text-sm mb-4">Per person · Cash only · Paid at the door</p>
              <p className="text-gray-500 text-xs">
                Come cheer on the contestants and enjoy the show!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Costume Themes */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Costume Themes</h2>
          <div className="gold-divider"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {[
              { icon: '🎬', theme: 'Hollywood Glamour', desc: 'Channel old Hollywood with tuxedos, gowns, and star-studded looks.' },
              { icon: '🏰', theme: 'Fairy Tales', desc: 'Transform your pup into a fairy tale character fit for a royal ball.' },
              { icon: '🎮', theme: 'Pop Culture', desc: 'Dress as iconic characters from movies, TV shows, and memes.' },
              { icon: '🏛️', theme: 'Historical Era', desc: 'Travel through time with period-accurate costumes from history.' },
              { icon: '👯', theme: 'Matching Duo', desc: 'You and your dog match! Coordinated costumes judged together.' },
              { icon: '💼', theme: 'Professional Attire', desc: 'Tiny lawyers, doctors, chefs — your dog is ready for the office.' },
            ].map(t => (
              <div key={t.theme} className="card-dark hover:border-satos-gold transition-colors group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">{t.icon}</div>
                <h3 className="text-satos-gold font-serif font-bold text-lg mb-2">{t.theme}</h3>
                <p className="text-gray-400 text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Share */}
      <section className="py-12 px-4 bg-satos-dark">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-3">Spread the Word! 🌟</h2>
          <p className="text-gray-400 mb-6">Share the event with fellow dog lovers</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition">
              <span>📸</span> Share on Instagram
            </a>
            <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition">
              <span>💬</span> Share on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Photo Gallery Placeholder */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Photo Gallery</h2>
          <div className="gold-divider"></div>
          <p className="text-center text-gray-500 mb-10">Post-event photos will appear here after May 9, 2026</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center">
                <span className="text-4xl opacity-20">🐾</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map / Venue */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">Find Us</h2>
          <div className="gold-divider"></div>
          <p className="text-center text-gray-400 mb-8">The Baldwin School of Puerto Rico — VPAC Auditorium</p>
          <div className="rounded-2xl overflow-hidden border-2 border-satos-gold/30">
            <iframe
              title="Baldwin School VPAC Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.4!2d-66.0615!3d18.4655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c036a8fa2f1a6f5%3A0x1234567890!2sThe+Baldwin+School+of+Puerto+Rico!5e0!3m2!1sen!2sus!4v1"
              width="100%" height="400" style={{ border: 0 }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="mt-4 text-center text-gray-400 text-sm">
            📍 The Baldwin School of Puerto Rico, Guaynabo, PR — VPAC Auditorium
          </div>
        </div>
      </section>
    </div>
  )
}
