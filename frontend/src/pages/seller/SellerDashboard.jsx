import { useState } from 'react'
import { signOut } from 'aws-amplify/auth'
import { useNavigate } from 'react-router-dom'

function SellerDashboard({ user }) {
  const navigate = useNavigate()
  const [activePeriod, setActivePeriod] = useState('month')

  async function handleSignOut() {
    await signOut()
    window.location.href = '/'
  }

  // Placeholder data — will be replaced by RDS analytics queries
  const stats = {
    totalRevenue: 4820,
    totalOrders: 38,
    totalProducts: 12,
    outOfStock: 3
  }

  const revenueByPeriod = {
    week: 1240,
    month: 4820,
    year: 31600
  }

  const bestSellers = [
    {
      productId: '1',
      name: 'Structured Blazer Top',
      category: 'in-office',
      itemType: 'top',
      unitsSold: 18,
      revenue: 2160,
      rating: 4.5,
      inStock: true
    },
    {
      productId: '2',
      name: 'Flowy Wrap Dress',
      category: 'out-of-office',
      itemType: 'dress',
      unitsSold: 12,
      revenue: 2160,
      rating: 4.8,
      inStock: true
    },
    {
      productId: '3',
      name: 'Linen Co-ord Set',
      category: 'casual',
      itemType: 'coord-set',
      unitsSold: 8,
      revenue: 1760,
      rating: 4.9,
      inStock: false
    }
  ]

  const recentOrders = [
    {
      orderId: 'ORD001',
      buyerName: 'Akosua M.',
      product: 'Structured Blazer Top',
      size: 'M',
      colour: 'Black',
      amount: 120,
      status: 'delivered',
      date: 'May 5, 2026'
    },
    {
      orderId: 'ORD002',
      buyerName: 'Efua A.',
      product: 'Flowy Wrap Dress',
      size: 'S',
      colour: 'Rose',
      amount: 162,
      status: 'processing',
      date: 'May 6, 2026'
    },
    {
      orderId: 'ORD003',
      buyerName: 'Adwoa K.',
      product: 'Structured Blazer Top',
      size: 'L',
      colour: 'Nude',
      amount: 120,
      status: 'shipped',
      date: 'May 7, 2026'
    }
  ]

  const categoryColors = {
    'in-office': '#2c3e50',
    'out-of-office': '#8e44ad',
    'casual': '#27ae60',
    'spicy': '#e74c3c'
  }

  const statusColors = {
    processing: { bg: '#fff3e0', text: '#e67e22' },
    shipped: { bg: '#e3f2fd', text: '#1976d2' },
    delivered: { bg: '#e8f5e9', text: '#27ae60' },
    cancelled: { bg: '#fdf0ef', text: '#e74c3c' }
  }

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.navLogo}>TOPSY</h1>
        <div style={styles.navLinks}>
          <button
            style={styles.navLinkActive}
            onClick={() => navigate('/seller')}
          >
            Dashboard
          </button>
          <button
            style={styles.navLink}
            onClick={() => navigate('/seller/inventory')}
          >
            Inventory
          </button>
        </div>
        <button style={styles.signOutButton} onClick={handleSignOut}>
          Sign Out
        </button>
      </nav>

      <div style={styles.content}>

        {/* Page header */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Store Dashboard</h2>
            <p style={styles.pageSubtitle}>
              Welcome back — here's how your store is performing
            </p>
          </div>
          <button
            style={styles.addProductButton}
            onClick={() => navigate('/seller/inventory')}
          >
            + Add Product
          </button>
        </div>

        {/* Stats cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Revenue</p>
            <div style={styles.periodTabs}>
              {['week', 'month', 'year'].map(p => (
                <button
                  key={p}
                  style={{
                    ...styles.periodTab,
                    backgroundColor: activePeriod === p
                      ? '#1a1a1a'
                      : 'transparent',
                    color: activePeriod === p ? '#ffffff' : '#6b6b6b'
                  }}
                  onClick={() => setActivePeriod(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <p style={styles.statValue}>
              GHC {revenueByPeriod[activePeriod].toLocaleString()}
            </p>
            <p style={styles.statChange}>↑ 12% vs last {activePeriod}</p>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Orders</p>
            <p style={styles.statValue}>{stats.totalOrders}</p>
            <p style={styles.statChange}>↑ 8% vs last month</p>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Products Listed</p>
            <p style={styles.statValue}>{stats.totalProducts}</p>
            <p style={{
              ...styles.statChange,
              color: '#e74c3c'
            }}>
              {stats.outOfStock} out of stock
            </p>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Store Rating</p>
            <p style={styles.statValue}>4.8</p>
            <p style={styles.statChange}>★★★★★ Excellent</p>
          </div>
        </div>

        {/* Best sellers */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Best Selling Items</h3>
          <div style={styles.bestSellersGrid}>
            {bestSellers.map((product, index) => (
              <div key={product.productId} style={styles.bestSellerCard}>
                <div style={styles.bestSellerRank}>#{index + 1}</div>
                <div style={{
                  ...styles.bestSellerImage,
                  backgroundColor: categoryColors[product.category]
                }}>
                  <span style={styles.bestSellerImageText}>
                    {product.name.charAt(0)}
                  </span>
                </div>
                <div style={styles.bestSellerInfo}>
                  <p style={styles.bestSellerName}>{product.name}</p>
                  <p style={styles.bestSellerType}>
                    {product.category} · {product.itemType}
                  </p>
                  <div style={styles.bestSellerStats}>
                    <span style={styles.bestSellerStat}>
                      {product.unitsSold} sold
                    </span>
                    <span style={styles.bestSellerStat}>
                      GHC {product.revenue.toLocaleString()}
                    </span>
                    <span style={styles.bestSellerStat}>
                      ★ {product.rating}
                    </span>
                  </div>
                  {!product.inStock && (
                    <span style={styles.outOfStockTag}>Out of Stock</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recent Orders</h3>
          <div style={styles.ordersTable}>
            <div style={styles.tableHeader}>
              <span style={styles.tableHeaderCell}>Order</span>
              <span style={styles.tableHeaderCell}>Customer</span>
              <span style={styles.tableHeaderCell}>Product</span>
              <span style={styles.tableHeaderCell}>Amount</span>
              <span style={styles.tableHeaderCell}>Status</span>
              <span style={styles.tableHeaderCell}>Date</span>
            </div>
            {recentOrders.map(order => (
              <div key={order.orderId} style={styles.tableRow}>
                <span style={styles.tableCell}>
                  #{order.orderId}
                </span>
                <span style={styles.tableCell}>{order.buyerName}</span>
                <span style={styles.tableCell}>
                  {order.product}
                  <span style={styles.orderVariant}>
                    {order.size} · {order.colour}
                  </span>
                </span>
                <span style={styles.tableCell}>
                  GHC {order.amount}
                </span>
                <span style={styles.tableCell}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColors[order.status]?.bg,
                    color: statusColors[order.status]?.text
                  }}>
                    {order.status}
                  </span>
                </span>
                <span style={styles.tableCell}>{order.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Sales by Category</h3>
          <div style={styles.categoryBreakdown}>
            {[
              { category: 'in-office', percentage: 52, revenue: 2506 },
              { category: 'out-of-office', percentage: 28, revenue: 1350 },
              { category: 'casual', percentage: 14, revenue: 675 },
              { category: 'spicy', percentage: 6, revenue: 289 }
            ].map(item => (
              <div key={item.category} style={styles.categoryRow}>
                <span style={styles.categoryName}>{item.category}</span>
                <div style={styles.progressBarContainer}>
                  <div style={{
                    ...styles.progressBar,
                    width: `${item.percentage}%`,
                    backgroundColor: categoryColors[item.category]
                  }} />
                </div>
                <span style={styles.categoryPercentage}>
                  {item.percentage}%
                </span>
                <span style={styles.categoryRevenue}>
                  GHC {item.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
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
    gap: '0.5rem'
  },
  navLink: {
    padding: '0.5rem 1rem',
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    color: '#6b6b6b',
    cursor: 'pointer',
    borderRadius: '6px'
  },
  navLinkActive: {
    padding: '0.5rem 1rem',
    background: '#f0f0f0',
    border: 'none',
    fontSize: '0.9rem',
    color: '#1a1a1a',
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: '600'
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
  content: {
    padding: '2rem',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem'
  },
  pageTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '2rem',
    color: '#1a1a1a'
  },
  pageSubtitle: {
    color: '#6b6b6b',
    fontSize: '0.9rem',
    marginTop: '0.25rem'
  },
  addProductButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#6b6b6b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statValue: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.8rem',
    color: '#1a1a1a',
    fontWeight: '600'
  },
  statChange: {
    fontSize: '0.8rem',
    color: '#27ae60'
  },
  periodTabs: {
    display: 'flex',
    gap: '0.25rem',
    backgroundColor: '#f0f0f0',
    borderRadius: '6px',
    padding: '0.2rem',
    width: 'fit-content'
  },
  periodTab: {
    padding: '0.25rem 0.6rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.3rem',
    color: '#1a1a1a',
    marginBottom: '1rem'
  },
  bestSellersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem'
  },
  bestSellerCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    position: 'relative'
  },
  bestSellerRank: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    fontSize: '0.8rem',
    color: '#6b6b6b',
    fontWeight: '600'
  },
  bestSellerImage: {
    width: '56px',
    height: '68px',
    borderRadius: '8px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bestSellerImageText: {
    fontSize: '1.5rem',
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Playfair Display, serif'
  },
  bestSellerInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  bestSellerName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  bestSellerType: {
    fontSize: '0.75rem',
    color: '#6b6b6b',
    textTransform: 'capitalize'
  },
  bestSellerStats: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  bestSellerStat: {
    fontSize: '0.8rem',
    color: '#1a1a1a',
    fontWeight: '500'
  },
  outOfStockTag: {
    fontSize: '0.75rem',
    backgroundColor: '#fdf0ef',
    color: '#e74c3c',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    width: 'fit-content'
  },
  ordersTable: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr 1fr',
    padding: '1rem 1.5rem',
    backgroundColor: '#f0f0f0',
    gap: '1rem'
  },
  tableHeaderCell: {
    fontSize: '0.8rem',
    color: '#6b6b6b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr 1fr',
    padding: '1rem 1.5rem',
    gap: '1rem',
    borderBottom: '1px solid #f0f0f0',
    alignItems: 'center'
  },
  tableCell: {
    fontSize: '0.85rem',
    color: '#1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  orderVariant: {
    fontSize: '0.75rem',
    color: '#6b6b6b'
  },
  statusBadge: {
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'capitalize',
    width: 'fit-content'
  },
  categoryBreakdown: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  categoryRow: {
    display: 'grid',
    gridTemplateColumns: '140px 1fr 50px 100px',
    alignItems: 'center',
    gap: '1rem'
  },
  categoryName: {
    fontSize: '0.85rem',
    color: '#1a1a1a',
    textTransform: 'capitalize',
    fontWeight: '500'
  },
  progressBarContainer: {
    height: '8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  categoryPercentage: {
    fontSize: '0.85rem',
    color: '#6b6b6b',
    textAlign: 'right'
  },
  categoryRevenue: {
    fontSize: '0.85rem',
    color: '#1a1a1a',
    fontWeight: '500',
    textAlign: 'right'
  }
}

export default SellerDashboard
