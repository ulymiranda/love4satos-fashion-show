export default function Sponsors() {
  const sponsorTiers = [
    {
      tier: '🥇 Platinum Sponsor',
      price: 'Contact for pricing',
      color: 'from-gray-300 to-gray-100',
      border: 'border-gray-400',
      textColor: 'text-gray-200',
      perks: [
        'Logo prominently displayed on all event materials & signage',
        'Premier placement on the event website',
        'Reserved VIP table at the show',
        'Shout-out during opening & closing remarks',
        'Social media feature post before and after the event',
        'Full-page ad in the printed program',
        'Branded banner placement at the venue entrance',
      ],
    },
    {
      tier: '🥈 Gold Sponsor',
      price: 'Contact for pricing',
      color: 'from-gray-400 to-gray-200',
      border: 'border-satos-gold',
      textColor: 'text-satos-gold',
      perks: [
        'Logo on event signage and printed program',
        'Website listing with link',
        'Social media recognition post',
        'Verbal acknowledgment during the show',
        'Half-page ad in the printed program',
      ],
    },
    {
      tier: '🥉 Silver Sponsor',
      price: 'Contact for pricing',
      color: 'from-gray-500 to-gray-300',
      border: 'border-gray-500',
      textColor: 'text-gray-300',
      perks: [
        'Name and logo on printed program',
        'Listing on the event website',
        'Social media mention',
        'Quarter-page ad in the printed program',
      ],
    },
    {
      tier: '🏅 Bronze Sponsor',
      price: 'Contact for pricing',
      color: 'from-gray-600 to-gray-500',
      border: 'border-gray-600',
      textColor: 'text-gray-400',
      perks: [
        'Name listed in the printed program',
        'Name listed on the event website',
        'Thank-you mention on social media',
      ],
    },
  ]

  return (
    <div className="bg-black min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block bg-satos-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Partnership Opportunities
          </div>
          <h1 className="section-title">Become a Sponsor</h1>
          <div className="gold-divider"></div>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4">
            Partner with Love 4 Satos and The Baldwin School of Puerto Rico to support animal welfare
            while putting your brand in front of a passionate community of dog lovers.
          </p>
        </div>

        {/* Why Sponsor */}
        <section className="card-dark mb-10">
          <h2 className="text-satos-gold font-serif font-bold text-2xl mb-6">Why Sponsor the Love 4 Satos Dog Fashion Show?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: '🐾',
                title: 'Support a Great Cause',
                desc: 'Your sponsorship directly supports Love 4 Satos, a nonprofit dedicated to rescuing and rehoming Puerto Rican street dogs (Satos).',
              },
              {
                icon: '👥',
                title: 'Reach Your Community',
                desc: 'Connect with hundreds of engaged dog owners, families, and animal lovers at one of Puerto Rico\'s most unique and heartwarming events.',
              },
              {
                icon: '📣',
                title: 'Amplify Your Brand',
                desc: 'Get visibility across event signage, printed programs, social media, and our website — before, during, and after the show.',
              },
            ].map(item => (
              <div key={item.title} className="bg-gray-950 rounded-xl p-5">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-white font-bold mb-2">{item.title}</div>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sponsor Tiers */}
        <section className="mb-10">
          <h2 className="text-white font-serif font-bold text-2xl mb-6 text-center">Sponsorship Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sponsorTiers.map(s => (
              <div key={s.tier} className={`bg-gray-900 border ${s.border} rounded-2xl p-6 flex flex-col`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shrink-0`}>
                    {s.tier.split(' ')[0]}
                  </div>
                  <div>
                    <div className={`font-serif font-bold text-lg ${s.textColor}`}>{s.tier.slice(3)}</div>
                    <div className="text-gray-500 text-xs">{s.price}</div>
                  </div>
                </div>
                <ul className="space-y-2 flex-1">
                  {s.perks.map((perk, i) => (
                    <li key={i} className="flex gap-2 text-gray-300 text-sm">
                      <span className={`${s.textColor} shrink-0 mt-0.5`}>✦</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* In-Kind & Custom */}
        <section className="card-dark mb-10">
          <h2 className="text-satos-gold font-serif font-bold text-xl mb-3">In-Kind & Custom Sponsorships</h2>
          <p className="text-gray-400 text-sm mb-4">
            We also welcome in-kind contributions such as prizes, gift baskets, dog treats, grooming products,
            photography services, or venue support. Custom partnership packages are available — reach out and
            we'll create something that works for your business!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['🎁 Prize Donations', '📸 Photography', '🐶 Dog Treats & Products', '🎀 Gift Baskets'].map(item => (
              <div key={item} className="bg-gray-950 rounded-lg px-3 py-2.5 text-gray-300 text-sm text-center">
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-br from-satos-red to-satos-maroon rounded-2xl p-8 md:p-12 text-center border border-satos-gold/20">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-white font-serif font-black text-3xl md:text-4xl mb-3">Ready to Partner With Us?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Reach out today to reserve your sponsorship tier before the event. Spots are limited and
            we'd love to feature your brand at this one-of-a-kind evening.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-black/40 rounded-2xl p-6 text-left">
              <div className="text-satos-gold font-bold mb-3 text-lg">Love 4 Satos</div>
              <div className="space-y-2 text-gray-300 text-sm">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <a href="mailto:events@love4satos.org" className="hover:text-white transition-colors">
                    events@love4satos.org
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌐</span>
                  <a href="https://love4satos.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    love4satos.org
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-black/40 rounded-2xl p-6 text-left">
              <div className="text-satos-gold font-bold mb-3 text-lg">The Baldwin School</div>
              <div className="space-y-2 text-gray-300 text-sm">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <a href="mailto:development@baldwin.edu.pr" className="hover:text-white transition-colors">
                    development@baldwin.edu.pr
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <a href="tel:+17877202172" className="hover:text-white transition-colors">
                    (787) 720-2172
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-5 max-w-lg mx-auto">
            <div className="text-satos-gold font-bold mb-2">📅 Sponsorship Deadline</div>
            <p className="text-gray-300 text-sm">
              To ensure your logo and name appear on all printed materials, please contact us
              by <strong className="text-white">April 25, 2026</strong>. Digital placements can be arranged closer to the event date.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
