import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'

// Pages
import Login from './pages/Login'
import BuyerHome from './pages/buyer/BuyerHome'
import BuyerProduct from './pages/buyer/BuyerProduct'
import BuyerCart from './pages/buyer/BuyerCart'
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerInventory from './pages/seller/SellerInventory'

// Components
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
        {/* Public route — login page */}
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

        {/* Buyer routes */}
        <Route
          path="/home"
          element={user && userRole === 'buyer'
            ? <BuyerHome user={user} />
            : <Navigate to="/" />}
        />
        <Route
          path="/product/:productId"
          element={user && userRole === 'buyer'
            ? <BuyerProduct user={user} />
            : <Navigate to="/" />}
        />
        <Route
          path="/cart"
          element={user && userRole === 'buyer'
            ? <BuyerCart user={user} />
            : <Navigate to="/" />}
        />

        {/* Seller routes */}
        <Route
          path="/seller"
          element={user && userRole === 'seller'
            ? <SellerDashboard user={user} />
            : <Navigate to="/" />}
        />
        <Route
          path="/seller/inventory"
          element={user && userRole === 'seller'
            ? <SellerInventory user={user} />
            : <Navigate to="/" />}
        />

        {/* Callback route after Cognito login */}
        <Route path="/callback" element={<Navigate to="/" />} />

        {/* Catch all — redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
