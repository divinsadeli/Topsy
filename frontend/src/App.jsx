import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'
import Login from './pages/Login'
import BuyerHome from './pages/buyer/BuyerHome'
import BuyerProduct from './pages/buyer/BuyerProduct'
import BuyerCart from './pages/buyer/BuyerCart'
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerInventory from './pages/seller/SellerInventory'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  async function checkAuthStatus() {
    try {
      const currentUser = await getCurrentUser()
      const attributes = await fetchUserAttributes()
      setUser(currentUser)
      setUserRole(attributes['custom:role'] || 'buyer')
    } catch {
      setUser(null)
      setUserRole(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user
              ? userRole === 'seller'
                ? <Navigate to="/seller" />
                : <Navigate to="/home" />
              : <Login onAuthSuccess={checkAuthStatus} />
          }
        />
        <Route
          path="/home"
          element={user && userRole === 'buyer' ? <BuyerHome user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/product/:productId"
          element={user && userRole === 'buyer' ? <BuyerProduct user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/cart"
          element={user && userRole === 'buyer' ? <BuyerCart user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/seller"
          element={user && userRole === 'seller' ? <SellerDashboard user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/seller/inventory"
          element={user && userRole === 'seller' ? <SellerInventory user={user} /> : <Navigate to="/" />}
        />
        <Route path="/callback" element={<Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
