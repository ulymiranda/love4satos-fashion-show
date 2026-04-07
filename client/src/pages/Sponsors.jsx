import { useState, useEffect } from 'react'

const TIER_CONFIG = {
  platinum: { label: 'Platinum Sponsors', color: 'from-gray-300 to-gray-100', textColor: 'text-gray-200', borderColor: 'border-gray-400', size: 'text-2xl' },
  gold: { label: 'Gold Sponsors', color: 'from-yellow-500 to-yellow-300', textColor: 'text-satos-gold', borderColor: 'border-satos-gold', size: 'text-xl' },
  silver: { label: 'Silver Sponsors', color: 'from-gray-500 to-gray-300', textColor: 'text-gray-300', borderColor: 'border-gray-500', size: 'text-lg' },
  bronze: { label: 'Bronze Sponsors', color: 'from-orange-700 to-orange-500', textColor: 'text-orange-400', borderColor: 'border-orange-700', size: 'text-base' },
}

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([])

  useEffect(() => {
    // Use static data since we seeded the DB
    setSponsors([
      { id: 1, name: 'The Baldwin School of Puerto Rico', tier: 'platinum', website_url: 'https://www.baldwin.edu.pr' },
      { id: 2, name: 'Love 4 Satos', tier: 'platinum', website_url: 'https://love4satos.org' },
      { id: 3, name: 'PetSmart Puerto Rico', tier: 'gold', website_url: null },
      { id: 4, name: 'Banco Popular de Puerto Rico', tier: 'gold', website_url: null },
      { id: 5, name: 'Caribbean Veterinary Group', tier: 'silver', website_url: null },
      { id: 6, name: 'Isla Pet Foods', tier: 'silver', website_url: null },
      { id: 7, name: 'San Juan Star', tier: 'bronze', website_url: null },
      { id: 8, name: 'El Nuevo Día', tier: 'bronze', website_url: null },
    ])
  }, [])

  const groupedSponsors = Object.keys(TIER_CONFIG).reduce((acc, tier) => {
    acc[tier] = sponsors.filter(s => s.tier === tier)
    return acc
  }, {})

  return (
    <div className="bg-black min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="section-title">Our Sponsors</h1>
          <div className="gold-divider"></div>
          <p className="text-gray-400">Thank you to the incredible sponsors who make this event possible</p>
        </div>

        {Object.entries(TIER_CONFIG).map(([tier, config]) => {
          const tierSponsors = groupedSponsors[tier] || []
          if (tierSponsors.length === 0) return null
          return (
            <div key={tier} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className={`h-px flex-1 bg-gradient-to-r ${config.color} opacity-40`}></div>
                <h2 className={`${config.textColor} font-serif font-bold ${config.size} whitespace-nowrap`}>
                  {config.label}
                </h2>
                <div className={`h-px flex-1 bg-gradient-to-l ${config.color} opacity-40`}></div>
              </div>
              <div className={`grid gap-4 ${tier === 'platinum' ? 'grid-cols-1 md:grid-cols-2' : tier === 'gold' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
                {tierSponsors.map(sponsor => (
                  <div key={sponsor.id}
                    className={`bg-gray-900 border ${config.borderColor} rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-800 transition-colors ${tier === 'platinum' ? 'py-8' : ''}`}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-3xl mb-3`}>
                      🐾
                    </div>
                    <div className={`font-bold ${config.textColor} ${tier === 'platinum' ? 'text-lg' : 'text-sm'}`}>
                      {sponsor.name}
                    </div>
                    {sponsor.website_url && (
                      <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer"
                        className="text-gray-500 text-xs mt-1 hover:text-satos-gold transition-colors">
                        Visit Website →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Become a Sponsor */}
        <section className="mt-16 bg-gradient-to-br from-satos-red to-red-900 rounded-2xl p-8 md:p-12 text-center">
          <div className="text-4xl mb-4">🌟</div>
          <h2 className="text-white font-serif font-black text-3xl md:text-4xl mb-3">Become a Sponsor</h2>
          <p className="text-red-200 mb-6 max-w-xl mx-auto">
            Partner with Love 4 Satos and The Baldwin School to support animal welfare in Puerto Rico while getting your brand in front of hundreds of passionate dog owners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { tier: '🥇 Platinum', price: 'Contact for pricing', perks: 'Logo on all materials, premier placement, VIP table' },
              { tier: '🥈 Gold', price: 'Contact for pricing', perks: 'Logo on event signage, social media recognition' },
              { tier: '🥉 Silver', price: 'Contact for pricing', perks: 'Name on printed program, website listing' },
              { tier: '🏅 Bronze', price: 'Contact for pricing', perks: 'Name on website sponsor page' },
            ].map(s => (
              <div key={s.tier} className="bg-black/30 rounded-xl p-4 text-left">
                <div className="text-white font-bold text-sm mb-1">{s.tier}</div>
                <div className="text-red-200 text-xs">{s.perks}</div>
              </div>
            ))}
          </div>
          <div className="bg-black/30 rounded-xl p-6 max-w-md mx-auto">
            <div className="text-white font-semibold mb-3">Contact Us to Sponsor</div>
            <div className="text-red-200 text-sm space-y-1">
              <div>📧 events@love4satos.org</div>
              <div>📧 development@baldwin.edu.pr</div>
              <div>📞 (787) 720-2172</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
