import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function BuyerCart({ user }) {
  const navigate = useNavigate()
  const [paymentStep, setPaymentStep] = useState('cart')
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [momoNumber, setMomoNumber] = useState('')
  const [processing, setProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  // Placeholder cart items — will be replaced by DynamoDB data
  const [cartItems, setCartItems] = useState([
    {
      cartItemId: 'c1',
      productId: '1',
      name: 'Structured Blazer Top',
      price: 120,
      category: 'in-office',
      selectedSize: 'M',
      selectedColour: 'Black',
      quantity: 1,
      sellerName: 'Abena Collections',
      inStock: true
    },
    {
      cartItemId: 'c2',
      productId: '2',
      name: 'Flowy Wrap Dress',
      price: 162,
      originalPrice: 180,
      discount: 10,
      category: 'out-of-office',
      selectedSize: 'S',
      selectedColour: 'Rose',
      quantity: 1,
      sellerName: 'Style by Ama',
      inStock: true
    }
  ])

  const categoryColors = {
    'in-office': '#2c3e50',
    'out-of-office': '#8e44ad',
    'casual': '#27ae60',
    'spicy': '#e74c3c'
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 15
  const total = subtotal + deliveryFee

  function removeItem(cartItemId) {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId))
  }

  function updateQuantity(cartItemId, delta) {
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  async function handlePayment() {
    if (!paymentMethod) return
    setProcessing(true)
    // Paystack integration will go here
    setTimeout(() => {
      setProcessing(false)
      setOrderComplete(true)
    }, 2000)
  }

  // Order complete screen
  if (orderComplete) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Order Placed!</h2>
          <p style={styles.successText}>
            Your order has been confirmed. You will receive a confirmation
            email shortly with your delivery details.
          </p>
          <button
            style={styles.primaryButton}
            onClick={() => navigate('/home')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <button style={styles.backButton} onClick={() => navigate('/home')}>
          ← Continue Shopping
        </button>
        <h1 style={styles.navLogo}>TOPSY</h1>
        <div style={{ width: '120px' }} />
      </nav>

      <div style={styles.pageTitle}>
        <h2 style={styles.title}>Your Cart</h2>
        <p style={styles.subtitle}>{cartItems.length} items</p>
      </div>

      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <p style={styles.emptyText}>Your cart is empty</p>
          <button
            style={styles.primaryButton}
            onClick={() => navigate('/home')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={styles.cartLayout}>

          {/* Left — cart items */}
          <div style={styles.cartItems}>

            {/* Step indicator */}
            <div style={styles.steps}>
              {[
