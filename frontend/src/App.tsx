import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import RoutesPage from './pages/RoutesPage'
import ComparePage from './pages/ComparePage'
import BankingPage from './pages/BankingPage'
import PoolingPage from './pages/PoolingPage'
import AdminPage from './pages/AdminPage' // ✅ import the Admin page

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <Routes>
          <Route path="/" element={<RoutesPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/banking" element={<BankingPage />} />
          <Route path="/pooling" element={<PoolingPage />} />
          <Route path="/admin" element={<AdminPage />} /> {/* ✅ new route */}
        </Routes>
      </main>
    </div>
  )
}

export default App
