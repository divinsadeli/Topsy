import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function BuyerProduct({ user }) {
  const navigate = useNavigate()
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColour, setSelectedColour] = useState(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  const product = {
    productId: '1',
    name: 'Structured Blazer Top',
    price: 120,
    category: 'in-office',
    itemType: 'top',
    description: 'A polished structured blazer top perfect for the office. Features clean lines, a fitted silhouette and premium fabric that holds its shape all day. Pairs beautifully with high-waist trousers or a midi skirt.',
    colours: ['Black', 'Nude', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviewCount: 12,
    inStock: true,
    discount: 0,
    sellerId: 'seller1',
    sellerName: 'Abena Collections',
    sellerRating: 4.8,
    sellerVerified: true
  }

  const reviews = [
    {
      reviewId: 'r1',
      buyerName: 'Akosua M.',
      rating: 5,
      comment: 'Absolutely love this top! The quality is amazing and it fits perfectly. I wore it to a board meeting and got so many compliments.',
      date: 'April 2026'
    },
    {
      reviewId: 'r2',
      buyerName: 'Efua A.',
      rating: 4,
      comment: 'Really nice top, great quality fabric. Runs slightly small so I suggest sizing up. Delivery was fast too.',
      date: 'March 2026'
    },
    {
      reviewId: 'r3',
      buyerName: 'Adwoa K.',
      rating: 5,
      comment: 'This is my third purchase from Abena Collections and they never disappoint. The blazer top is amazing.',
      date: 'March 2026'
    }
  ]

  const categoryColors = {
    'in-office': '#2c3e50',
    'out-of-office': '#8e44ad',
    'casual': '#27ae60',
    'spicy': '#e74c3c'
  }

  function handleAddToCart() {
    if (!selectedSize || !selectedColour) return
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <button style={styles.backButton} onClick={() => navigate('/home')}>
          Back
        </button>
        <h1 style={styles.navLogo}>TOPSY</h1>
        <button style={styles.cartButton} onClick={() => navigate('/cart')}>
          Cart
        </button>
      </nav>

      <div style={styles.productLayout}>
        <div style={styles.imageSection}>
          <div style={{
            ...styles.mainImage,
            backgroundColor: categoryColors[product.category] || '#e8d5c4'
          }}>
            <span style={styles.imageText}>{product.name.charAt(0)}</span>
          </div>
          <span style={{
            ...styles.categoryBadge,
            backgroundColor: categoryColors[product.category]
          }}>
            {product.category}
          </span>
        </div>

        <div style={styles.infoSection}>
          <div style={styles.sellerRow}>
            <span style={styles.sellerName}>{product.sellerName}</span>
            {product.sellerVerified && (
              <span style={styles.verifiedBadge}>Verified Seller</span>
            )}
            <span style={styles.sellerRating}>★ {product.sellerRating}</span>
          </div>

          <h2 style={styles.productName}>{product.name}</h2>

          <div style={styles.priceRow}>
            <span style={styles.price}>
              GHC {product.discount > 0
                ? Math.round(product.price * (1 - product.discount / 100))
                : product.price}
            </span>
            {product.discount > 0 && (
              <span style={styles.originalPrice}>GHC {product.price}</span>
            )}
          </div>

          <div style={styles.ratingRow}>
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                style={{
                  color: star <= Math.round(product.rating) ? '#c9647a' : '#e0e0e0',
                  fontSize: '1.1rem'
                }}
              >★</span>
            ))}
            <span style={styles.ratingText}>
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div style={styles.selectionSection}>
            <p style={styles.selectionLabel}>
              Colour: <span style={styles.selectionValue}>
                {selectedColour || 'Select a colour'}
              </span>
            </p>
            <div style={styles.colourOptions}>
              {product.colours.map(colour => (
                <button
                  key={colour}
                  style={{
                    ...styles.colourButton,
                    borderColor: selectedColour === colour ? '#1a1a1a' : '#e0e0e0',
                    backgroundColor: selectedColour === colour ? '#f0f0f0' : '#ffffff'
                  }}
                  onClick={() => setSelectedColour(colour)}
                >
                  {colour}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.selectionSection}>
            <p style={styles.selectionLabel}>
              Size: <span style={styles.selectionValue}>
                {selectedSize || 'Select a size'}
              </span>
            </p>
            <div style={styles.sizeOptions}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  style={{
                    ...styles.sizeButton,
                    backgroundColor: selectedSize === size ? '#1a1a1a' : '#ffffff',
                    color: selectedSize === size ? '#ffffff' : '#1a1a1a',
                    borderColor: selectedSize === size ? '#1a1a1a' : '#e0e0e0'
                  }}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            style={{
              ...styles.addToCartButton,
              backgroundColor: addedToCart
                ? '#27ae60'
                : (!selectedSize || !selectedColour)
                  ? '#cccccc'
                  : '#1a1a1a',
              cursor: (!selectedSize || !selectedColour) ? 'not-allowed' : 'pointer'
            }}
            onClick={handleAddToCart}
            disabled={!selectedSize || !selectedColour}
          >
            {addedToCart
              ? 'Added to Cart'
              : (!selectedSize || !selectedColour)
                ? 'Select Size and Colour'
                : 'Add to Cart'}
          </button>

          {(!selectedSize || !selectedColour) && (
            <p style={styles.selectionHint}>
              Please select a size and colour to continue
            </p>
          )}
        </div>
      </div>

      <div style={styles.tabsSection}>
        <div style={styles.tabHeaders}>
          {['details', 'reviews', 'seller'].map(tab => (
            <button
              key={tab}
              style={{
                ...styles.tabButton,
                borderBottom: activeTab === tab ? '2px solid #1a1a1a' : '2px solid transparent',
                fontWeight: activeTab === tab ? '600' : '400'
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'details' ? 'Product Details' : tab === 'reviews' ? 'Reviews (' + product.reviewCount + ')' : 'About the Seller'}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div style={styles.tabContent}>
            <p style={styles.description}>{product.description}</p>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Category</span>
                <span style={styles.detailValue}>{product.category}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Item Type</span>
                <span style={styles.detailValue}>{product.itemType}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Available Sizes</span>
                <span style={styles.detailValue}>{product.sizes.join(', ')}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Available Colours</span>
                <span style={styles.detailValue}>{product.colours.join(', ')}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={styles.tabContent}>
            <div style={styles.reviewsSummary}>
              <span style={styles.bigRating}>{product.rating}</span>
              <div>
                <div style={styles.starsRow}>
                  {[1,2,3,4,5].map(star => (
                    <span key={star} style={{
                      color: star <= Math.round(product.rating) ? '#c9647a' : '#e0e0e0',
                      fontSize: '1.3rem'
                    }}>★</span>
                  ))}
                </div>
                <p style={styles.totalReviews}>Based on {product.reviewCount} reviews</p>
              </div>
            </div>
            <div style={styles.reviewsList}>
              {reviews.map(review => (
                <div key={review.reviewId} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <span style={styles.reviewerName}>{review.buyerName}</span>
                    <span style={styles.reviewDate}>{review.date}</span>
                  </div>
                  <div style={styles.reviewStars}>
                    {[1,2,3,4,5].map(star => (
                      <span key={star} style={{
                        color: star <= review.rating ? '#c9647a' : '#e0e0e0',
                        fontSize: '0.9rem'
                      }}>★</span>
                    ))}
                  </div>
                  <p style={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seller' && (
          <div style={styles.tabContent}>
            <div style={styles.sellerCard}>
              <div style={styles.sellerCardHeader}>
                <div style={styles.sellerAvatar}>
                  {product.sellerName.charAt(0)}
                </div>
                <div>
                  <h3 style={styles.sellerCardName}>{product.sellerName}</h3>
                  <div style={styles.sellerCardMeta}>
                    {product.sellerVerified && (
                      <span style={styles.verifiedBadge}>Verified Seller</span>
                    )}
                    <span style={styles.sellerRating}>★ {product.sellerRating}</span>
                  </div>
                </div>
              </div>
              <p style={styles.sellerDescription}>
                Trusted seller on Topsy. All items are quality-checked before listing.
                Fast delivery across Ghana.
              </p>
            </div>
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
  cartButton: {
    padding: '0.5rem 1.2rem',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  productLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    padding: '2rem',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  imageSection: {
    position: 'relative'
  },
  mainImage: {
    width: '100%',
    paddingTop: '120%',
    borderRadius: '12px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '5rem',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Playfair Display, serif'
  },
  categoryBadge: {
    position: 'absolute',
    bottom: '15px',
    left: '15px',
    color: '#ffffff',
    padding: '0.3rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    textTransform: 'capitalize'
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  sellerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  sellerName: {
    fontSize: '0.9rem',
    color: '#6b6b6b'
  },
  verifiedBadge: {
    backgroundColor: '#e8f5e9',
    color: '#27ae60',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  sellerRating: {
    fontSize: '0.85rem',
    color: '#c9647a'
  },
  productName: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '2rem',
    color: '#1a1a1a',
    lineHeight: '1.2'
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  price: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#1a1a1a'
  },
  originalPrice: {
    fontSize: '1.1rem',
    color: '#6b6b6b',
    textDecoration: 'line-through'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  ratingText: {
    fontSize: '0.85rem',
    color: '#6b6b6b',
    marginLeft: '0.5rem'
  },
  selectionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  selectionLabel: {
    fontSize: '0.9rem',
    color: '#6b6b6b',
    fontWeight: '500'
  },
  selectionValue: {
    color: '#1a1a1a',
    fontWeight: '600'
  },
  colourOptions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  colourButton: {
    padding: '0.5rem 1rem',
    border: '1.5px solid',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  },
  sizeOptions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  sizeButton: {
    width: '48px',
    height: '48px',
    border: '1.5px solid',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '500'
  },
  addToCartButton: {
    padding: '1rem',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    width: '100%',
    marginTop: '0.5rem',
    transition: 'background-color 0.3s'
  },
  selectionHint: {
    fontSize: '0.8rem',
    color: '#6b6b6b',
    textAlign: 'center'
  },
  tabsSection: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 2rem 3rem'
  },
  tabHeaders: {
    display: 'flex',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '2rem'
  },
  tabButton: {
    padding: '1rem 1.5rem',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    color: '#1a1a1a'
  },
  tabContent: {
    padding: '0.5rem 0'
  },
  description: {
    fontSize: '0.95rem',
    color: '#6b6b6b',
    lineHeight: '1.8',
    marginBottom: '1.5rem'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '8px'
  },
  detailLabel: {
    fontSize: '0.8rem',
    color: '#6b6b6b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  detailValue: {
    fontSize: '0.95rem',
    color: '#1a1a1a',
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  reviewsSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px'
  },
  bigRating: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'Playfair Display, serif'
  },
  starsRow: {
    display: 'flex',
    gap: '0.1rem',
    marginBottom: '0.25rem'
  },
  totalReviews: {
    fontSize: '0.85rem',
    color: '#6b6b6b'
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reviewerName: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#1a1a1a'
  },
  reviewDate: {
    fontSize: '0.8rem',
    color: '#6b6b6b'
  },
  reviewStars: {
    display: 'flex',
    gap: '0.1rem'
  },
  reviewComment: {
    fontSize: '0.9rem',
    color: '#6b6b6b',
    lineHeight: '1.6'
  },
  sellerCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  sellerCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  sellerAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
    fontFamily: 'Playfair Display, serif'
  },
  sellerCardName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '0.25rem'
  },
  sellerCardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  sellerDescription: {
    fontSize: '0.9rem',
    color: '#6b6b6b',
    lineHeight: '1.6'
  }
}

export default BuyerProduct
