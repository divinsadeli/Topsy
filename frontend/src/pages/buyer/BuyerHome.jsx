import { useState, useEffect } from 'react'
import { signOut } from 'aws-amplify/auth'
import { useNavigate } from 'react-router-dom'

const API_URL = 'https://g71wjkt5pd.execute-api.eu-north-1.amazonaws.com/prod'

function BuyerHome({ user }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [cartCount, setCartCount] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'in-office', label: 'In-Office' },
    { id: 'out-of-office', label: 'Out-of-Office' },
    { id: 'casual', label: 'Casual' },
    { id: 'spicy', label: 'Spicy' }
  ]

  const itemTypes = [
    { id: 'all', label: 'All Items' },
    { id: 'top', label: 'Tops' },
    { id: 'trouser', label: 'Trousers' },
    { id: 'dress', label: 'Dresses' },
    { id: 'skirt', label: 'Skirts' },
    { id: 'coord-set', label: 'Co-ord Sets' }
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/products`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => {
    const categoryMatch = activeCategory === 'all' || p.category === activeCategory
    const typeMatch = activeType === 'all' || p.itemType === activeType
    return categoryMatch && typeMatch
  })

  const categoryColors = {
    'in-office': '#2c3e50',
    'out-of-office': '#8e44ad',
    'casual': '#27ae60',
    'spicy': '#e74c3c'
  }

  async function handleSignOut() {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.navLogo}>TOPSY</h1>
        <div style={styles.navLinks}>
          <button style={styles.navLink}>New In</button>
          <button style={styles.navLink}>Trending</button>
          <button style={styles.navLink}>Sales</button>
        </div>
        <div style={styles.navActions}>
          <button style={styles.cartButton} onClick={() => navigate('/cart')}>
            Cart {cartCount > 0 && (
              <span style={styles.cartBadge}>{cartCount}</span>
            )}
          </button>
          <button style={styles.signOutButton} onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>

      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroLabel}>New Collection</p>
          <h2 style={styles.heroTitle}>Style That Speaks For Itself</h2>
          <p style={styles.heroSubtitle}>
            Tops, dresses, trousers and sets curated for every version of you
          </p>
          <button style={styles.heroButton}>Shop Now</button>
        </div>
      </div>

      <div style={styles.filtersSection}>
        <div style={styles.categoryFilters}>
          {categories.map(cat => (
            <button
              key={cat.id}
              style={{
                ...styles.categoryButton,
                backgroundColor: activeCategory === cat.id ? '#1a1a1a' : 'transparent',
                color: activeCategory === cat.id ? '#ffffff' : '#1a1a1a',
                borderColor: activeCategory === cat.id ? '#1a1a1a' : '#e0e0e0'
              }}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div style={styles.typeFilters}>
          {itemTypes.map(type => (
            <button
              key={type.id}
              style={{
                ...styles.typeButton,
                backgroundColor: activeType === type.id ? '#e8d5c4' : 'transparent',
                fontWeight: activeType === type.id ? '600' : '400'
              }}
              onClick={() => setActiveType(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.productsSection}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>
            {activeCategory === 'all' ? 'All Items' : categories.find(c => c.id === activeCategory)?.label}
          </h3>
          <p style={styles.productCount}>{filteredProducts.length} items</p>
        </div>

        {loading && (
          <div style={styles.loadingState}>
            <p style={styles.loadingText}>Loading products...</p>
          </div>
        )}

        {error && (
          <div style={styles.errorState}>
            <p style={styles.errorText}>{error}</p>
            <button style={styles.retryButton} onClick={fetchProducts}>Try Again</button>
          </div>
        )}

        {!loading && !error && (
          <div style={styles.productsGrid}>
            {filteredProducts.map(product => (
              <div
                key={product.productId}
                style={styles.productCard}
                onClick={() => navigate('/product/' + product.productId)}
              >
                <div style={styles.productImageContainer}>
                  <div style={{
                    ...styles.productImage,
                    backgroundColor: categoryColors[product.category] || '#e8d5c4'
                  }}>
                    <span style={styles.productImageText}>
                      {product.name.charAt(0)}
                    </span>
                  </div>
                  {product.discount > 0 && (
                    <span style={styles.discountBadge}>-{product.discount}%</span>
                  )}
                  {!product.inStock && (
                    <div style={styles.outOfStockOverlay}>
                      <span>Out of Stock</span>
                    </div>
                  )}
                  <span style={{
                    ...styles.categoryBadge,
                    backgroundColor: categoryColors[product.category] || '#1a1a1a'
                  }}>
                    {product.category}
                  </span>
                </div>

                <div style={styles.productDetails}>
                  <p style={styles.productName}>{product.name}</p>
                  <div style={styles.productPriceRow}>
                    <span style={styles.productPrice}>
                      GHC {product.discount > 0
                        ? Math.round(product.price * (1 - product.discount / 100))
                        : product.price}
                    </span>
                    {product.discount > 0 && (
                      <span style={styles.originalPrice}>GHC {product.price}</span>
                    )}
                  </div>
                  <div style={styles.productMeta}>
                    <span style={styles.rating}>★ {product.rating}</span>
                    <span style={styles.reviewCount}>({product.reviewCount})</span>
                  </div>
                  <div style={styles.colourDots}>
                    {(product.colours || []).slice(0, 4).map(colour => (
                      <span key={colour} style={styles.colourDot} title={colour} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
  navLogo: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.5rem',
    fontWeight: '700',
    letterSpacing: '0.2em',
    color: '#1a1a1a'
  },
  navLinks: {
    display: 'flex',
    gap: '2rem'
  },
  navLink: {
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    color: '#1a1a1a',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  },
  navActions: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  cartButton: {
    padding: '0.5rem 1.2rem',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    position: 'relative'
  },
  cartBadge: {
    backgroundColor: '#c9647a',
    color: '#ffffff',
    borderRadius: '50%',
    padding: '0 5px',
    fontSize: '0.7rem',
    marginLeft: '4px'
  },
  signOutButton: {
    background: 'none',
    border: '1px solid #e0e0e0',
    borderRadius: '20px',
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    cursor: 'pointer',
    color: '#6b6b6b'
  },
  hero: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #3d1f2a 100%)',
    padding: '4rem 2rem',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  heroLabel: {
    color: '#e8d5c4',
    fontSize: '0.85rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    marginBottom: '1rem'
  },
  heroTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '3rem',
    color: '#ffffff',
    lineHeight: '1.2',
    marginBottom: '1rem'
  },
  heroSubtitle: {
    color: '#e8d5c4',
    fontSize: '1rem',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  heroButton: {
    padding: '0.9rem 2.5rem',
    backgroundColor: '#c9647a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  filtersSection: {
    padding: '1.5rem 2rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f0f0f0'
  },
  categoryFilters: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1rem',
    flexWrap: 'wrap'
  },
  categoryButton: {
    padding: '0.5rem 1.2rem',
    border: '1.5px solid',
    borderRadius: '20px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  },
  typeFilters: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  typeButton: {
    padding: '0.4rem 1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    color: '#1a1a1a'
  },
  productsSection: {
    padding: '2rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.5rem',
    color: '#1a1a1a'
  },
  productCount: {
    color: '#6b6b6b',
    fontSize: '0.9rem'
  },
  loadingState: {
    textAlign: 'center',
    padding: '4rem'
  },
  loadingText: {
    color: '#6b6b6b',
    fontSize: '1rem'
  },
  errorState: {
    textAlign: 'center',
    padding: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '1rem'
  },
  retryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.5rem'
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  productImageContainer: {
    position: 'relative',
    paddingTop: '120%'
  },
  productImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImageText: {
    fontSize: '3rem',
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Playfair Display, serif'
  },
  discountBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#c9647a',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  categoryBadge: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    color: '#ffffff',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    textTransform: 'capitalize'
  },
  productDetails: {
    padding: '1rem'
  },
  productName: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '0.5rem'
  },
  productPriceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.4rem'
  },
  productPrice: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  originalPrice: {
    fontSize: '0.85rem',
    color: '#6b6b6b',
    textDecoration: 'line-through'
  },
  productMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginBottom: '0.5rem'
  },
  rating: {
    fontSize: '0.85rem',
    color: '#c9647a'
  },
  reviewCount: {
    fontSize: '0.8rem',
    color: '#6b6b6b'
  },
  colourDots: {
    display: 'flex',
    gap: '0.3rem'
  },
  colourDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#e8d5c4',
    border: '1px solid #e0e0e0',
    display: 'inline-block'
  }
}

export default BuyerHome
