export default function EventInfo() {
  return (
    <div className="bg-black min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="section-title">Event Information</h1>
          <div className="gold-divider"></div>
          <p className="text-gray-400">Everything you need to know for the big show</p>
        </div>

        {/* Admission Pricing */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-satos-red to-red-900 rounded-2xl p-6 text-center border border-satos-gold/40">
              <div className="text-5xl mb-3">🐾</div>
              <div className="text-satos-gold font-serif font-black text-4xl mb-1">$25</div>
              <div className="text-white font-bold text-lg mb-2">Dog Contestant Entry</div>
              <div className="text-red-200 text-sm">Per dog · Cash only · Paid at check-in</div>
              <div className="mt-3 text-red-100 text-xs">
                Includes participation in all contest categories
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-center border border-satos-gold/40">
              <div className="text-5xl mb-3">🎟️</div>
              <div className="text-satos-gold font-serif font-black text-4xl mb-1">$10</div>
              <div className="text-white font-bold text-lg mb-2">Spectator Admission</div>
              <div className="text-gray-400 text-sm">Per person · Cash only · Paid at the door</div>
              <div className="mt-3 text-gray-500 text-xs">
                Come cheer on the contestants!
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600 text-xs mt-3">
            💵 Cash payments only — no card readers on site
          </p>
        </section>

        {/* Schedule */}
        <section className="card-dark mb-8">
          <h2 className="text-satos-gold font-serif font-bold text-2xl mb-6">🎬 Run of Show</h2>
          <div className="space-y-1">
            {[
              ['5:00 PM', 'Doors Open — Check-In & Payment Desk'],
              ['5:00 – 5:30 PM', 'Red Carpet Arrival & Pre-Show Photo Ops'],
              ['5:30 PM', 'Welcome Remarks & Introduction'],
              ['5:45 PM', 'Contestant Parade — All Dogs Walk the Runway'],
              ['6:00 PM', 'Judging Begins — All Dogs Compete in All Categories'],
              ['6:00 – 6:20 PM', 'Best in Show / Most Fashionable / Most Glamorous'],
              ['6:20 – 6:40 PM', 'Funniest / Best Trick / Best Story'],
              ['6:40 – 7:00 PM', 'Best Duo / Best Handmade / Most Charming'],
              ['7:00 – 7:15 PM', 'Cutest Puppy / Senior Dog Star'],
              ['7:15 – 7:30 PM', 'Intermission — Refreshments & Networking'],
              ['7:30 PM', 'Award Ceremony Begins'],
              ['7:30 – 8:00 PM', 'Winners Announced & Trophies Presented'],
              ['8:00 PM', 'Closing Remarks & Group Photo'],
            ].map(([time, event]) => (
              <div key={time} className="flex gap-4 py-3 border-b border-gray-800 last:border-0">
                <div className="text-satos-gold font-mono text-sm w-36 shrink-0 pt-0.5">{time}</div>
                <div className="text-gray-300 text-sm">{event}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Rules */}
        <section className="card-dark mb-8">
          <h2 className="text-satos-gold font-serif font-bold text-2xl mb-6">📜 Rules & Guidelines</h2>
          <ul className="space-y-3">
            {[
              'Entry fee is $25 per dog, paid in cash at the check-in desk on the day of the event.',
              'Spectator admission is $10 per person, paid in cash at the entrance. No card payments accepted.',
              'All registered dogs automatically compete in every contest category — no selection needed.',
              'All dogs must be current on vaccinations. Please bring proof of rabies vaccine.',
              'Dogs must be on a leash at all times inside the venue.',
              'Dogs must be friendly with other dogs and people. Aggressive dogs may be asked to leave without refund.',
              'All costumes must be safe and comfortable for your dog — no costume should restrict breathing, vision, or movement.',
              'Owners are responsible for cleaning up after their dogs.',
              'Contestants must arrive at check-in by 5:15 PM. Late arrivals may not be able to participate in judging.',
              'Judges\' decisions are final.',
              'Each dog can only win one award, even if they score highly in multiple categories.',
              'Dogs must be pre-registered online to participate as contestants.',
              'Well-behaved dogs of all breeds, ages, and sizes are welcome!',
            ].map((rule, i) => (
              <li key={i} className="flex gap-3 text-gray-300 text-sm">
                <span className="text-satos-gold mt-0.5 shrink-0">✦</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What to Bring */}
        <section className="card-dark mb-8">
          <h2 className="text-satos-gold font-serif font-bold text-2xl mb-6">🎒 What to Bring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '✅ $25 cash for your dog\'s entry fee',
              '✅ Your registration confirmation email',
              '✅ Proof of rabies vaccination',
              '✅ Leash and collar (with ID tag)',
              '✅ Dog\'s costume (keep it a surprise!)',
              '✅ Poop bags',
              '✅ Your dog\'s favorite treats',
              '✅ Water bowl (water available on site)',
              '✅ A camera — you\'ll want photos!',
              '❗ No choke chains or prong collars',
              '❗ No retractable leashes during judging',
              '❗ No card payments — cash only',
            ].map((item, i) => (
              <div key={i} className="text-gray-300 text-sm bg-gray-950 rounded-lg px-4 py-2.5">
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="card-dark mb-8">
          <h2 className="text-satos-gold font-serif font-bold text-2xl mb-6">❓ FAQ</h2>
          <div className="space-y-5">
            {[
              {
                q: 'How much does it cost?',
                a: 'Dog contestant entry is $25 per dog. Spectator admission is $10 per person. All payments are cash only and collected on the day of the event — dogs at the check-in desk, spectators at the entrance.'
              },
              {
                q: 'Why cash only?',
                a: 'To keep things simple and avoid transaction fees, we are accepting cash payments only. Please plan accordingly and bring the exact amount if possible!'
              },
              {
                q: 'Which contest categories does my dog compete in?',
                a: 'All registered dogs automatically compete in every contest category. There\'s no need to select categories — just show up, pay your entry fee, and let the judges do the rest!'
              },
              {
                q: 'Does my dog need to be a Sato to participate?',
                a: 'Not at all! Dogs of all breeds are welcome. We love all dogs, but we have a special place in our hearts for Satos (Puerto Rican street dogs).'
              },
              {
                q: 'Can puppies participate?',
                a: 'Yes! Puppies are welcome. They must be at least 8 weeks old and have had their first round of vaccinations.'
              },
              {
                q: 'What if my dog gets nervous around crowds?',
                a: 'Please let us know in the special accommodations section when registering. We can arrange for you to be near an exit or in a quieter area.'
              },
              {
                q: 'Can more than one dog from the same family register?',
                a: 'Absolutely! Each dog needs their own registration and entry fee ($25 each). Siblings can also be judged together in the Best Duo category.'
              },
              {
                q: 'Where can I park?',
                a: 'Parking is available at The Baldwin School campus. Please follow signs to the VPAC auditorium entrance.'
              },
              {
                q: 'Will there be food and drinks?',
                a: 'Light refreshments will be available for human attendees. Please do not feed other people\'s dogs.'
              },
              {
                q: 'Who are the judges?',
                a: 'Judges will be announced closer to the event date. They will be respected members of the local dog lover community, veterinarians, and fashion experts.'
              },
            ].map(({ q, a }, i) => (
              <div key={i} className="border-b border-gray-800 pb-5 last:border-0 last:pb-0">
                <div className="text-white font-semibold text-sm mb-1.5">{q}</div>
                <div className="text-gray-400 text-sm leading-relaxed">{a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Venue */}
        <section className="card-dark mb-8">
          <h2 className="text-satos-gold font-serif font-bold text-2xl mb-4">📍 Venue</h2>
          <div className="bg-gray-950 rounded-xl p-5 mb-4">
            <div className="text-white font-bold text-lg">The Baldwin School of Puerto Rico</div>
            <div className="text-gray-400">VPAC Auditorium (Visual &amp; Performing Arts Center)</div>
            <div className="text-gray-400 mt-2">Guaynabo, Puerto Rico</div>
            <a
              href="https://www.google.com/maps/search/The+Baldwin+School+of+Puerto+Rico"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-satos-gold text-sm hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>
          <div className="rounded-xl overflow-hidden">
            <iframe
              title="Baldwin School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.4!2d-66.0615!3d18.4655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI3JzU1LjgiTiA2NsKwMDMnNDEuNCJX!5e0!3m2!1sen!2sus!4v1"
              width="100%" height="300"
              style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  )
}
