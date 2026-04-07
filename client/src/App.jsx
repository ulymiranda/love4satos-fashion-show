import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Registration from './pages/Registration'
import EventInfo from './pages/EventInfo'
import Sponsors from './pages/Sponsors'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1a0000', color: '#FFD700', border: '1px solid #C0392B' }
      }} />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/event-info" element={<EventInfo />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
