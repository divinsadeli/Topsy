import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts'

const API_URL = 'https://g71wjkt5pd.execute-api.eu-north-1.amazonaws.com/prod'

const COLORS = {
  'in-office': '#2c3e50',
  'out-of-office': '#8e44ad',
  'casual': '#27ae60',
  'spicy': '#e74c3c',
  primary: '#c0395a',
  secondary: '#e8d5c4',
  accent: '#1a1a1a'
}

const PIE_COLORS = ['#c0395a', '#2c3e50', '#27ae60', '#8e44ad', '#e67e22', '#16a085']

function StatCard({ title, value, subtitle, color }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statTitle}>{title}</p>
      <p style={{ ...styles.statValue, color: color || '#1a1a1a' }}>{value}</p>
      {subtitle && <p style={styles.statSubtitle}>{subtitle}</p>}
    </div>
  )
}

function AdminDashboard({ user }) {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/orders`),
        fetch(`${API_URL}/products`)
      ])
      const ordersData = await ordersRes.json()
      const productsData = await productsRes.json()
      setOrders(ordersData.orders || [])
      setProducts(productsData.products || [])
    } catch (err) {
      setError('Failed to load analytics data.')
    } finally {
      setLoading(false)
    }
  }

  // ── Computed Analytics ──────────────────────────────────────────────────────

  const activeOrders = orders.filter(o => o.status !== 'cancelled')

  const totalRevenue = activeOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
  const totalOrders = orders.length
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length

  // Sales by category
  const categoryData = ['in-office', 'out-of-office', 'casual', 'spicy'].map(cat => {
    const catOrders = activeOrders.filter(o => o.category === cat)
    return {
      category: cat.replace('-', ' '),
      orders: catOrders.length,
      revenue: catOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
    }
  })

  // Sales by month
  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  const monthlyData = monthOrder.map(month => {
    const monthOrders = activeOrders.filter(o => o.month === month)
    return {
      month: month.slice(0, 3),
      orders: monthOrders.length,
      revenue: Math.round(monthOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0))
    }
  }).filter(m => m.orders > 0)

  // Payment methods
  const paymentMap = {}
  activeOrders.forEach(o => {
    const method = o.paymentMethod || 'unknown'
    const label = method === 'mtn_momo' ? 'MTN MoMo'
      : method === 'telecel_cash' ? 'Telecel Cash'
      : method === 'airtel_tigo' ? 'AirtelTigo'
      : method === 'card' ? 'Card'
      : method
    paymentMap[label] = (paymentMap[label] || 0) + 1
  })
  const paymentData = Object.entries(paymentMap).map(([name, value]) => ({ name, value }))

  // Order status breakdown
  const statusData = [
    { name: 'Delivered', value: deliveredOrders },
    { name: 'Processing', value: orders.filter(o => o.status === 'processing').length },
    { name: 'Shipped', value: orders.filter(o => o.status === 'shipped').length },
    { name: 'Cancelled', value: cancelledOrders }
  ].filter(s => s.value > 0)

  // Peak hours
  const hourMap = {}
  activeOrders.forEach(o => {
    const hour = Number(o.hour)
    if (!isNaN(hour)) {
      hourMap[hour] = (hourMap[hour] || 0) + 1
    }
  })
  const hourlyData = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}:00`,
    orders: hourMap[h] || 0
  })).filter(h => h.orders > 0)

  // Top products
  const productOrderMap = {}
  activeOrders.forEach(o => {
    if (o.productName) {
      if (!productOrderMap[o.productName]) {
        productOrderMap[o.productName] = { orders: 0, revenue: 0, category: o.category }
      }
      productOrderMap[o.productName].orders += 1
      productOrderMap[o.productName].revenue += Number(o.totalAmount) || 0
    }
  })
  const topProducts = Object.entries(productOrderMap)
    .map(([name, data]) => ({ name: name.length > 20 ? name.slice(0, 20) + '…' : name, ...data }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 6)

  // Seller performance
  const sellerMap = {}
  activeOrders.forEach(o => {
    if (o.sellerName) {
      if (!sellerMap[o.sellerName]) sellerMap[o.sellerName] = { orders: 0, revenue: 0 }
      sellerMap[o.sellerName].orders += 1
      sellerMap[o.sellerName].revenue += Number(o.totalAmount) || 0
    }
  })
  const sellerData = Object.entries(sellerMap).map(([name, data]) => ({ name, ...data }))

  // Day of week
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const dayMap = {}
  activeOrders.forEach(o => { if (o.dayOfWeek) dayMap[o.dayOfWeek] = (dayMap[o.dayOfWeek] || 0) + 1 })
  const dayData = dayOrder.map(day => ({ day: day.slice(0, 3), orders: dayMap[day] || 0 }))

  if (loading) {
    return (
      <div style={styles.centerScreen}>
        <p style={styles.loadingText}>Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.centerScreen}>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.btn} onClick={fetchData}>Retry</button>
      </div>
    )
  }

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.navLogo}>TOPSY</h1>
        <p style={styles.navTitle}>Analytics Dashboard</p>
        <button style={styles.backBtn} onClick={() => navigate('/home')}>← Back to Shop</button>
      </nav>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.pageTitle}>Marketplace Analytics</h2>
          <p style={styles.pageSubtitle}>Simulated data · Jan – Jul 2026 · eu-north-1</p>
        </div>
        <div style={styles.tabs}>
          {['overview', 'sales', 'behaviour', 'sellers'].map(tab => (
            <button
              key={tab}
              style={{
                ...styles.tabBtn,
                backgroundColor: activeTab === tab ? '#1a1a1a' : 'transparent',
                color: activeTab === tab ? '#ffffff' : '#1a1a1a'
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.content}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <>
            {/* Stat cards */}
            <div style={styles.statsGrid}>
              <StatCard title="Total Revenue" value={`GHC ${totalRevenue.toLocaleString()}`} subtitle="Excl. cancelled orders" color="#c0395a" />
              <StatCard title="Total Orders" value={totalOrders.toLocaleString()} subtitle={`${deliveredOrders} delivered`} />
              <StatCard title="Delivery Rate" value={`${Math.round((deliveredOrders / totalOrders) * 100)}%`} subtitle="Orders delivered" color="#27ae60" />
              <StatCard title="Cancellation Rate" value={`${Math.round((cancelledOrders / totalOrders) * 100)}%`} subtitle="Orders cancelled" color="#e74c3c" />
              <StatCard title="Avg Order Value" value={`GHC ${Math.round(totalRevenue / activeOrders.length)}`} subtitle="Per active order" />
              <StatCard title="Total Products" value={products.length} subtitle="Across 4 categories" />
            </div>

            {/* Category revenue + order status */}
            <div style={styles.row}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Revenue by Category</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(val) => [`GHC ${val.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#c0395a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Order Status Breakdown</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ── SALES TAB ── */}
        {activeTab === 'sales' && (
          <>
            {/* Monthly revenue trend */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Monthly Revenue Trend (GHC)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(val) => [`GHC ${val.toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#c0395a" strokeWidth={2.5} dot={{ fill: '#c0395a', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.row}>
              {/* Orders by category */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Orders by Category</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={90} />
                    <Tooltip />
                    <Bar dataKey="orders" radius={[0, 4, 4, 0]}>
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[entry.category.replace(' ', '-')] || '#c0395a'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top products */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Top Products by Orders</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#2c3e50" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment methods */}
            <div style={styles.row}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Payment Methods</h3>
                <p style={styles.cardSubtitle}>Reflecting Ghana's mobile money dominance</p>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={paymentData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {paymentData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Monthly Orders Volume</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#8e44ad" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ── BEHAVIOUR TAB ── */}
        {activeTab === 'behaviour' && (
          <>
            <div style={styles.insightBanner}>
              <h3 style={styles.insightTitle}>📊 Market Research Insight</h3>
              <p style={styles.insightText}>
                Survey of 14 Ghanaian women revealed that <strong>trust and vendor verification</strong> are the #1 barrier to online shopping.
                Over 57% had been scammed or nearly scammed. 92% said they would recommend a trusted marketplace.
                The data below shows simulated behaviour patterns consistent with these findings.
              </p>
            </div>

            {/* Peak hours */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Orders by Hour of Day</h3>
              <p style={styles.cardSubtitle}>Peak shopping times: lunch (12–14h) and evening (19–22h)</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#c0395a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Day of week */}
            <div style={styles.row}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Orders by Day of Week</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={dayData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#27ae60" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Budget distribution */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Customer Budget Distribution</h3>
                <p style={styles.cardSubtitle}>Based on market research: 43% under 50 GHC, 43% 50–150 GHC</p>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Under 50 GHC', value: 43 },
                        { name: '50–150 GHC', value: 43 },
                        { name: '150–300 GHC', value: 14 }
                      ]}
                      cx="50%" cy="50%" outerRadius={100} dataKey="value"
                      label={({ name, value }) => `${name} (${value}%)`}
                    >
                      {[0,1,2].map(i => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trust features insight */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Most Requested Trust Features</h3>
              <p style={styles.cardSubtitle}>From market research survey — features that would make users trust the platform</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { feature: 'Verified Badges', respondents: 12 },
                  { feature: 'Buyer Reviews', respondents: 11 },
                  { feature: 'Secure Payment', respondents: 11 },
                  { feature: 'Delivery Tracking', respondents: 10 },
                  { feature: 'Price Comparison', respondents: 9 },
                  { feature: 'Style Filter', respondents: 8 }
                ]} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" domain={[0, 14]} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="feature" type="category" tick={{ fontSize: 12 }} width={130} />
                  <Tooltip formatter={(val) => [`${val} of 14 respondents`]} />
                  <Bar dataKey="respondents" fill="#c0395a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ── SELLERS TAB ── */}
        {activeTab === 'sellers' && (
          <>
            <div style={styles.statsGrid}>
              {sellerData.map(seller => (
                <div key={seller.name} style={styles.sellerCard}>
                  <div style={styles.sellerAvatar}>{seller.name.charAt(0)}</div>
                  <div>
                    <p style={styles.sellerName}>{seller.name}</p>
                    <span style={styles.verifiedBadge}>✓ Verified Seller</span>
                  </div>
                  <div style={styles.sellerStats}>
                    <div style={styles.sellerStat}>
                      <p style={styles.sellerStatValue}>{seller.orders}</p>
                      <p style={styles.sellerStatLabel}>Orders</p>
                    </div>
                    <div style={styles.sellerStat}>
                      <p style={styles.sellerStatValue}>GHC {Math.round(seller.revenue).toLocaleString()}</p>
                      <p style={styles.sellerStatLabel}>Revenue</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.row}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Orders per Seller</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={sellerData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#c0395a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Revenue per Seller (GHC)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={sellerData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(val) => [`GHC ${val.toLocaleString()}`]} />
                    <Bar dataKey="revenue" fill="#2c3e50" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#faf7f4', fontFamily: 'Inter, sans-serif' },
  centerScreen: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' },
  loadingText: { color: '#6b6b6b', fontSize: '1rem' },
  errorText: { color: '#e74c3c', fontSize: '1rem' },
  btn: { padding: '0.75rem 1.5rem', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', backgroundColor: '#ffffff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 100 },
  navLogo: { fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '0.2em', color: '#1a1a1a' },
  navTitle: { fontSize: '0.9rem', color: '#6b6b6b', fontWeight: '500' },
  backBtn: { background: 'none', border: '1px solid #e0e0e0', borderRadius: '20px', padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer', color: '#6b6b6b' },
  header: { padding: '1.5rem 2rem', backgroundColor: '#ffffff', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#1a1a1a', margin: 0 },
  pageSubtitle: { fontSize: '0.85rem', color: '#6b6b6b', marginTop: '0.25rem' },
  tabs: { display: 'flex', gap: '0.5rem' },
  tabBtn: { padding: '0.5rem 1.2rem', border: '1.5px solid #1a1a1a', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '500' },
  content: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  statTitle: { fontSize: '0.8rem', color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  statValue: { fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: '700', color: '#1a1a1a', margin: 0 },
  statSubtitle: { fontSize: '0.75rem', color: '#6b6b6b', marginTop: '0.25rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem' },
  cardTitle: { fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '0.25rem' },
  cardSubtitle: { fontSize: '0.8rem', color: '#6b6b6b', marginBottom: '1rem' },
  insightBanner: { backgroundColor: '#fff5f7', border: '1.5px solid #f3c4ce', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' },
  insightTitle: { fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#c0395a', marginBottom: '0.5rem' },
  insightText: { fontSize: '0.9rem', color: '#4a4a4a', lineHeight: '1.7' },
  sellerCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' },
  sellerAvatar: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontFamily: 'Playfair Display, serif' },
  sellerName: { fontSize: '1rem', fontWeight: '600', color: '#1a1a1a', margin: 0 },
  verifiedBadge: { backgroundColor: '#e8f5e9', color: '#27ae60', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' },
  sellerStats: { display: 'flex', gap: '1.5rem' },
  sellerStat: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  sellerStatValue: { fontSize: '1.1rem', fontWeight: '700', color: '#1a1a1a', margin: 0 },
  sellerStatLabel: { fontSize: '0.75rem', color: '#6b6b6b' }
}

export default AdminDashboard
