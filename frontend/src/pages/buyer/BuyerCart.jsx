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
              {['cart', 'payment', 'confirm'].map((step, i) => (
                <div key={step} style={styles.stepRow}>
                  <div style={{
                    ...styles.stepDot,
                    backgroundColor: paymentStep === step
                      ? '#1a1a1a'
                      : ['cart', 'payment', 'confirm'].indexOf(paymentStep) > i
                        ? '#27ae60'
                        : '#e0e0e0'
                  }}>
                    {['cart', 'payment', 'confirm'].indexOf(paymentStep) > i
                      ? '✓'
                      : i + 1}
                  </div>
                  <span style={styles.stepLabel}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                  {i < 2 && <div style={styles.stepLine} />}
                </div>
              ))}
            </div>

            {/* Cart step */}
            {paymentStep === 'cart' && (
              <>
                {cartItems.map(item => (
                  <div key={item.cartItemId} style={styles.cartItem}>
                    <div style={{
                      ...styles.itemImage,
                      backgroundColor: categoryColors[item.category] || '#e8d5c4'
                    }}>
                      <span style={styles.itemImageText}>
                        {item.name.charAt(0)}
                      </span>
                    </div>
                    <div style={styles.itemDetails}>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemSeller}>{item.sellerName}</p>
                      <div style={styles.itemVariants}>
                        <span style={styles.variantTag}>
                          Size: {item.selectedSize}
                        </span>
                        <span style={styles.variantTag}>
                          Colour: {item.selectedColour}
                        </span>
                      </div>
                      <div style={styles.itemBottom}>
                        <div style={styles.quantityControl}>
                          <button
                            style={styles.qtyButton}
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                          >
                            −
                          </button>
                          <span style={styles.qtyValue}>{item.quantity}</span>
                          <button
                            style={styles.qtyButton}
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                          >
                            +
                          </button>
                        </div>
                        <span style={styles.itemPrice}>
                          GHC {item.price * item.quantity}
                        </span>
                        <button
                          style={styles.removeButton}
                          onClick={() => removeItem(item.cartItemId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  style={styles.primaryButton}
                  onClick={() => setPaymentStep('payment')}
                >
                  Proceed to Payment
                </button>
              </>
            )}

            {/* Payment step */}
            {paymentStep === 'payment' && (
              <div style={styles.paymentSection}>
                <h3 style={styles.sectionTitle}>Choose Payment Method</h3>
                <p style={styles.paymentSubtitle}>
                  Powered by Paystack — secure payments for Ghana
                </p>

                <div style={styles.paymentOptions}>
                  <button
                    style={{
                      ...styles.paymentOption,
                      borderColor: paymentMethod === 'momo'
                        ? '#1a1a1a'
                        : '#e0e0e0',
                      backgroundColor: paymentMethod === 'momo'
                        ? '#f0f0f0'
                        : '#ffffff'
                    }}
                    onClick={() => setPaymentMethod('momo')}
                  >
                    <span style={styles.paymentIcon}>📱</span>
                    <div style={styles.paymentInfo}>
                      <p style={styles.paymentName}>Mobile Money</p>
                      <p style={styles.paymentDesc}>
                        MTN MoMo · Telecel Cash · AirtelTigo
                      </p>
                    </div>
                  </button>

                  <button
                    style={{
                      ...styles.paymentOption,
                      borderColor: paymentMethod === 'card'
                        ? '#1a1a1a'
                        : '#e0e0e0',
                      backgroundColor: paymentMethod === 'card'
                        ? '#f0f0f0'
                        : '#ffffff'
                    }}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <span style={styles.paymentIcon}>💳</span>
                    <div style={styles.paymentInfo}>
                      <p style={styles.paymentName}>Card Payment</p>
                      <p style={styles.paymentDesc}>
                        Visa · Mastercard · Verve
                      </p>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'momo' && (
                  <div style={styles.momoInput}>
                    <label style={styles.inputLabel}>
                      Mobile Money Number
                    </label>
                    <input
                      style={styles.input}
                      type="tel"
                      placeholder="e.g. 0244123456"
                      value={momoNumber}
                      onChange={e => setMomoNumber(e.target.value)}
                    />
                    <p style={styles.inputHint}>
                      You will receive a prompt on this number to confirm payment
                    </p>
                  </div>
                )}

                <div style={styles.buttonRow}>
                  <button
                    style={styles.secondaryButton}
                    onClick={() => setPaymentStep('cart')}
                  >
                    Back
                  </button>
                  <button
                    style={{
                      ...styles.primaryButton,
                      flex: 1,
                      opacity: !paymentMethod ? 0.5 : 1
                    }}
                    onClick={() => paymentMethod && setPaymentStep('confirm')}
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Confirm step */}
            {paymentStep === 'confirm' && (
              <div style={styles.confirmSection}>
                <h3 style={styles.sectionTitle}>Review Your Order</h3>
                {cartItems.map(item => (
                  <div key={item.cartItemId} style={styles.confirmItem}>
                    <span style={styles.confirmItemName}>
                      {item.name} × {item.quantity}
                    </span>
                    <span style={styles.confirmItemPrice}>
                      GHC {item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div style={styles.confirmDivider} />
                <div style={styles.confirmItem}>
                  <span style={styles.confirmItemName}>Delivery</span>
                  <span style={styles.confirmItemPrice}>GHC {deliveryFee}</span>
                </div>
                <div style={styles.confirmItem}>
                  <span style={{ ...styles.confirmItemName, fontWeight: '700' }}>
                    Total
                  </span>
                  <span style={{ ...styles.confirmItemPrice, fontWeight: '700' }}>
                    GHC {total}
                  </span>
                </div>
                <p style={styles.paymentMethodConfirm}>
                  Paying with: {paymentMethod === 'momo'
                    ? `Mobile Money (${momoNumber})`
                    : 'Card'}
                </p>
                <div style={styles.buttonRow}>
                  <button
                    style={styles.secondaryButton}
                    onClick={() => setPaymentStep('payment')}
                  >
                    Back
                  </button>
                  <button
                    style={{ ...styles.primaryButton, flex: 1 }}
                    onClick={handlePayment}
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : `Pay GHC ${total}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — order summary */}
          <div style={styles.orderSummary}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>
                Subtotal ({cartItems.length} items)
              </span>
              <span style={styles.summaryValue}>GHC {subtotal}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Delivery</span>
              <span style={styles.summaryValue}>GHC {deliveryFee}</span>
            </div>
            <div style={styles.summaryDivider} />
            <div style={styles.summaryRow}>
              <span style={styles.summaryTotal}>Total</span>
              <span style={styles.summaryTotal}>GHC {total}</span>
            </div>
            <div style={styles.secureNote}>
              <span>🔒</span>
              <p style={styles.secureText}>
                Secure checkout powered by Paystack.
                Your payment details are encrypted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#faf7f4',
    fontFamily: 'Inter, sans-serif'
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f0f0f0',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
    color: '#6b6b6b'
  },
  navLogo: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.5rem',
    fontWeight: '700',
    letterSpacing: '0.2em',
    color: '#1a1a1a'
  },
  pageTitle: {
    padding: '2rem 2rem 0',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%'
  },
  title: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '2rem',
    color: '#1a1a1a'
  },
  subtitle: {
    color: '#6b6b6b',
    fontSize: '0.9rem',
    marginTop: '0.25rem'
  },
  cartLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '2rem',
    padding: '2rem',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '1.25rem',
    borderRadius: '10px',
    marginBottom: '0.5rem'
  },
  stepRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  stepDot: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepLabel: {
    fontSize: '0.85rem',
    color: '#1a1a1a'
  },
  stepLine: {
    width: '40px',
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '0 0.5rem'
  },
  cartItem: {
    display: 'flex',
    gap: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '1.25rem'
  },
  itemImage: {
    width: '90px',
    height: '110px',
    borderRadius: '8px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemImageText: {
    fontSize: '2rem',
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Playfair Display, serif'
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  itemName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  itemSeller: {
    fontSize: '0.8rem',
    color: '#6b6b6b'
  },
  itemVariants: {
    display: 'flex',
    gap: '0.5rem'
  },
  variantTag: {
    fontSize: '0.8rem',
    backgroundColor: '#f0f0f0',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    color: '#6b6b6b'
  },
  itemBottom: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: 'auto'
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '0.2rem'
  },
  qtyButton: {
    width: '28px',
    height: '28px',
    border: 'none',
    background: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyValue: {
    fontSize: '0.9rem',
    fontWeight: '600',
    minWidth: '20px',
    textAlign: 'center'
  },
  itemPrice: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1a1a1a'
  },
  removeButton: {
    background: 'none',
    border: 'none',
    color: '#c9647a',
    fontSize: '0.85rem',
    cursor: 'pointer',
    marginLeft: 'auto'
  },
  paymentSection: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  sectionTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.3rem',
    color: '#1a1a1a'
  },
  paymentSubtitle: {
    fontSize: '0.85rem',
    color: '#6b6b6b'
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    border: '1.5px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'Inter, sans-serif'
  },
  paymentIcon: {
    fontSize: '1.5rem'
  },
  paymentInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  paymentName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  paymentDesc: {
    fontSize: '0.8rem',
    color: '#6b6b6b'
  },
  momoInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  inputLabel: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#1a1a1a'
  },
  input: {
    padding: '0.85rem 1rem',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none'
  },
  inputHint: {
    fontSize: '0.8rem',
    color: '#6b6b6b'
  },
  buttonRow: {
    display: 'flex',
    gap: '0.75rem'
  },
  primaryButton: {
    padding: '0.9rem 1.5rem',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  },
  secondaryButton: {
    padding: '0.9rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  },
  confirmSection: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  confirmItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  confirmItemName: {
    fontSize: '0.9rem',
    color: '#1a1a1a'
  },
  confirmItemPrice: {
    fontSize: '0.9rem',
    color: '#1a1a1a'
  },
  confirmDivider: {
    height: '1px',
    backgroundColor: '#f0f0f0'
  },
  paymentMethodConfirm: {
    fontSize: '0.85rem',
    color: '#6b6b6b',
    backgroundColor: '#f0f0f0',
    padding: '0.75rem',
    borderRadius: '6px'
  },
  orderSummary: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '1.5rem',
    height: 'fit-content',
    position: 'sticky',
    top: '80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  summaryTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.2rem',
    color: '#1a1a1a'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: '0.9rem',
    color: '#6b6b6b'
  },
  summaryValue: {
    fontSize: '0.9rem',
    color: '#1a1a1a'
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#f0f0f0'
  },
  summaryTotal: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a1a1a'
  },
  secureNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    backgroundColor: '#f0f0f0',
    padding: '0.75rem',
    borderRadius: '6px'
  },
  secureText: {
    fontSize: '0.8rem',
    color: '#6b6b6b',
    lineHeight: '1.5'
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    padding: '4rem',
    textAlign: 'center'
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#6b6b6b'
  },
  successContainer: {
    minHeight: '100vh',
    backgroundColor: '#faf7f4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif'
  },
  successCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '3rem',
    textAlign: 'center',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem'
  },
  successIcon: {
    width: '64px',
    height: '64px',
    backgroundColor: '#27ae60',
    color: '#ffffff',
    borderRadius: '50%',
    fontSize: '1.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.8rem',
    color: '#1a1a1a'
  },
  successText: {
    fontSize: '0.9rem',
    color: '#6b6b6b',
    lineHeight: '1.6'
  }
}

export default BuyerCart
