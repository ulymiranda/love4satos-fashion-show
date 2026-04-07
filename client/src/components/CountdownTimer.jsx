import { useState, useEffect } from 'react'

const EVENT_DATE = new Date('2026-05-09T17:30:00-04:00')

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const diff = EVENT_DATE - new Date()
    if (diff <= 0) return null
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) {
    return (
      <div className="text-center py-8">
        <div className="text-satos-gold font-serif text-3xl font-bold">The Show Has Begun! 🎉</div>
      </div>
    )
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="flex justify-center gap-3 md:gap-5">
      {units.map(({ label, value }) => (
        <div key={label} className="countdown-box">
          <span className="text-3xl md:text-5xl font-serif font-black text-satos-gold tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-gray-400 text-xs mt-1 uppercase tracking-widest">{label}</span>
        </div>
      ))}
    </div>
  )
}
