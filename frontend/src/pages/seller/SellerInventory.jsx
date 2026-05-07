import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SellerInventory({ user }) {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'in-office',
    itemType: 'top',
    price: '',
    sizes: [],
    colours: [],
    description: ''
  })

  // Placeholder inventory — will be replaced by DynamoDB data
  const [inventory, setInventory] = useState([
    {
      productId: '1',
      name: 'Structured Blazer Top',
      category: 'in-office',
      itemType: 'top',
      price: 120,
      sizes: ['S', 'M', 'L', 'XL'],
      colours: ['Black', 'Nude', 'Navy'],
      stock: 8,
      unitsSold: 18,
      rating: 4.5,
      status: 'active'
    },
    {
      productId: '2',
      name: 'Flowy Wrap Dress',
      category: 'out-of-office',
      itemType: 'dress',
      price: 180,
      sizes: ['XS', 'S', 'M', 'L'],
      colours: ['Rose', 'White'],
      stock: 5,
      unitsSold: 12,
      rating: 4.8,
      status: 'active'
    },
    {
      productId: '3',
      name: 'Linen Co-ord Set',
      category: 'casual',
      itemType: 'coord-set',
      price: 220,
      sizes: ['XS', 'S', 'M'],
      colours: ['White', 'Sage'],
      stock: 0,
      unitsSold: 8,
      rating: 4.9,
      status: 'out-of-stock'
    },
    {
      productId: '4',
      name: 'Cut-Out Bodycon Top',
      category: 'spicy',
      itemType: 'top',
      price: 95,
      sizes: ['S', 'M', 'L'],
      colours: ['Black', 'Red'],
      stock: 2,
      unitsSold: 19,
      rating: 4.6,
      status: 'low-stock'
    },
    {
      productId: '5',
      name: 'High-Waist Tailored Trousers',
      category: 'in-office',
      itemType: 'trouser',
      price: 150,
      sizes: ['S', 'M', 'L', 'XL'],
      colours: ['Black', 'Navy', 'Beige'],
      stock: 11,
      unitsSold: 31,
      rating: 4.7,
      status: 'active'
    }
  ])

  const categoryColors = {
    'in-office': '#2c3e50',
    'out-of-office': '#8e44ad',
    'casual': '#27ae60',
    'spicy': '#e74c3c'
  }

  const statusStyles = {
    active: { bg: '#e8f5e9', text: '#27ae60', label: 'In Stock' },
    'low-stock': { bg: '#fff3e0', text: '#e67e22', label: 'Low Stock' },
    'out-of-stock': { bg: '#fdf0ef', text: '#e74c3c', label: 'Out of Stock' }
  }

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'In Stock' },
    { id: 'low-stock', label: 'Low Stock' },
    { id: 'out-of-stock', label: 'Out of Stock' }
  ]

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const allColours = ['Black', 'White', 'Nude', 'Navy', 'Rose', 'Red',
    'Beige', 'Sage', 'Blush', 'Brown']

  const filteredInventory = inventory.filter(p =>
    activeFilter === 'all' || p.status === activeFilter
  )

  function toggleSize(size) {
    setNewProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  function toggleColour(colour) {
    setNewProduct(prev => ({
      ...prev,
      colours: prev.colours.includes(colour)
        ? prev.colours.filter(c => c !== colour)
        : [...prev.colours, colour]
    }))
  }

  function handleAddProduct() {
    if (!newProduct.name || !newProduct.price) return
    const product = {
      productId: Date.now().toString(),
      ...newProduct,
      price: Number(newProduct.price),
      stock: 10,
      unitsSold: 0,
      rating: 0,
      status: 'active'
    }
    setInventory(prev => [product, ...prev])
    setShowAddForm(false)
    setNewProduct({
      name: '',
      category: 'in-office',
      itemType: 'top',
      price: '',
      sizes: [],
      colours: [],
      description: ''
    })
  }

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.navLogo}>TOPSY</h1>
        <div style={styles.navLinks}>
          <button
            style={styles.navLink}
            onClick={() => navigate('/seller')}
          >
            Dashboard
          </button>
          <button style={styles.navLinkActive}>
            Inventory
          </button>
        </div>
        <button
          style={styles.addButton}
          onClick={() => setShowAddForm(true)}
        >
          + Add Product
        </button>
      </nav>

      <div style={styles.content}>

        {/* Page header */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Inventory</h2>
            <p style={styles.pageSubtitle}>
              {inventory.length} products · {' '}
              {inventory.filter(p => p.status === 'out-of-stock').length} out of stock
            </p>
          </div>
        </div>

        {/* Stock summary cards */}
        <div style={styles.summaryCards}>
          <div style={styles.summaryCard}>
            <p style={styles.summaryNumber}>
              {inventory.filter(p => p.status === 'active').length}
            </p>
            <p style={styles.summaryLabel}>In Stock</p>
          </div>
          <div style={styles.summaryCard}>
            <p style={{ ...styles.summaryNumber, color: '#e67e22' }}>
              {inventory.filter(p => p.status === 'low-stock').length}
            </p>
            <p style={styles.summaryLabel}>Low Stock</p>
          </div>
          <div style={styles.summaryCard}>
            <p style={{ ...styles.summaryNumber, color: '#e74c3c' }}>
              {inventory.filter(p => p.status === 'out-of-stock').length}
            </p>
            <p style={styles.summaryLabel}>Out of Stock</p>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryNumber}>{inventory.length}</p>
            <p style={styles.summaryLabel}>Total Products</p>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filterRow}>
          {filters.map(f => (
            <button
              key={f.id}
              style={{
                ...styles.filterButton,
                backgroundColor: activeFilter === f.id
                  ? '#1a1a1a'
                  : 'transparent',
                color: activeFilter === f.id ? '#ffffff' : '#1a1a1a',
                borderColor: activeFilter === f.id ? '#1a1a1a' : '#e0e0e0'
              }}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Inventory table */}
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span style={styles.headerCell}>Product</span>
            <span style={styles.headerCell}>Category</span>
            <span style={styles.headerCell}>Price</span>
            <span style={styles.headerCell}>Sizes</span>
            <span style={styles.headerCell}>Stock</span>
            <span style={styles.headerCell}>Sold</span>
            <span style={styles.headerCell}>Status</span>
          </div>

          {filteredInventory.map(product => (
            <div key={product.productId} style={styles.tableRow}>
              <div style={styles.productCell}>
                <div style={{
                  ...styles.productThumb,
                  backgroundColor: categoryColors[product.category]
                }}>
                  {product.name.charAt(0)}
                </div>
                <div>
                  <p style={styles.productCellName}>{product.name}</p>
                  <p style={styles.productCellType}>{product.itemType}</p>
                </div>
              </div>
              <span style={{
                ...styles.cell,
                ...styles.categoryTag,
                backgroundColor: categoryColors[product.category] + '22',
                color: categoryColors[product.category]
              }}>
                {product.category}
              </span>
              <span style={styles.cell}>GHC {product.price}</span>
              <span style={styles.cell}>
                <div style={styles.sizeTags}>
                  {product.sizes.map(s => (
                    <span key={s} style={styles.sizeTag}>{s}</span>
                  ))}
                </div>
              </span>
              <span style={styles.cell}>{product.stock} units</span>
              <span style={styles.cell}>{product.unitsSold} sold</span>
              <span style={styles.cell}>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: statusStyles[product.status]?.bg,
                  color: statusStyles[product.status]?.text
                }}>
                  {statusStyles[product.status]?.label}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add product modal */}
      {showAddForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add New Product</h3>
              <button
                style={styles.closeButton}
                onClick={() => setShowAddForm(false)}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Satin Wrap Blouse"
                  value={newProduct.name}
                  onChange={e => setNewProduct(p => ({
                    ...p, name: e.target.value
                  }))}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    style={styles.select}
                    value={newProduct.category}
                    onChange={e => setNewProduct(p => ({
                      ...p, category: e.target.value
                    }))}
                  >
                    <option value="in-office">In-Office</option>
                    <option value="out-of-office">Out-of-Office</option>
                    <option value="casual">Casual</option>
                    <option value="spicy">Spicy</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Item Type</label>
                  <select
                    style={styles.select}
                    value={newProduct.itemType}
                    onChange={e => setNewProduct(p => ({
                      ...p, itemType: e.target.value
                    }))}
                  >
                    <option value="top">Top</option>
                    <option value="dress">Dress</option>
                    <option value="trouser">Trouser</option>
                    <option value="skirt">Skirt</option>
                    <option value="coord-set">Co-ord Set</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Price (GHC)</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="e.g. 120"
                  value={newProduct.price}
                  onChange={e => setNewProduct(p => ({
                    ...p, price: e.target.value
                  }))}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Available Sizes</label>
                <div style={styles.toggleGroup}>
                  {allSizes.map(size => (
                    <button
                      key={size}
                      style={{
                        ...styles.toggleButton,
                        backgroundColor: newProduct.sizes.includes(size)
                          ? '#1a1a1a'
                          : '#ffffff',
                        color: newProduct.sizes.includes(size)
                          ? '#ffffff'
                          : '#1a1a1a'
                      }}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Available Colours</label>
                <div style={styles.toggleGroup}>
                  {allColours.map(colour => (
                    <button
                      key={colour}
                      style={{
                        ...styles.toggleButton,
                        backgroundColor: newProduct.colours.includes(colour)
                          ? '#1a1a1a'
                          : '#ffffff',
                        color: newProduct.colours.includes(colour)
                          ? '#ffffff'
                          : '#1a1a1a'
                      }}
                      onClick={() => toggleColour(colour)}
                    >
                      {colour}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Describe the product — fabric, fit, styling tips..."
                  value={newProduct.description}
                  onChange={e => setNewProduct(p => ({
                    ...p, description: e.target.value
                  }))}
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.submitButton,
                  opacity: (!newProduct.name || !newProduct.price) ? 0.5 : 1
                }}
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.price}
              >
                Add Product
              </button>
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
  addButton: {
    padding: '0.6rem 1.25rem',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  content: {
    padding: '2rem',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  pageHeader: {
    marginBottom: '1.5rem'
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
  summaryCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '1.25rem',
    textAlign: 'center'
  },
  summaryNumber: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '2rem',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  summaryLabel: {
    fontSize: '0.8rem',
    color: '#6b6b6b',
    marginTop: '0.25rem'
  },
  filterRow: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  },
  filterButton: {
    padding: '0.5rem 1.2rem',
    border: '1.5px solid',
    borderRadius: '20px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  },
  table: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.2fr 0.8fr 1.5fr 0.8fr 0.8fr 1fr',
    padding: '1rem 1.5rem',
    backgroundColor: '#f0f0f0',
    gap: '1rem'
  },
  headerCell: {
    fontSize: '0.8rem',
    color: '#6b6b6b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.2fr 0.8fr 1.5fr 0.8fr 0.8fr 1fr',
    padding: '1rem 1.5rem',
    gap: '1rem',
    borderBottom: '1px solid #f0f0f0',
    alignItems: 'center'
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  productThumb: {
    width: '40px',
    height: '48px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '1.1rem',
    fontFamily: 'Playfair Display, serif',
    flexShrink: 0
  },
  productCellName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  productCellType: {
    fontSize: '0.75rem',
    color: '#6b6b6b',
    textTransform: 'capitalize'
  },
  cell: {
    fontSize: '0.85rem',
    color: '#1a1a1a'
  },
  categoryTag: {
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'capitalize',
    width: 'fit-content'
  },
  sizeTags: {
    display: 'flex',
    gap: '0.25rem',
    flexWrap: 'wrap'
  },
  sizeTag: {
    fontSize: '0.7rem',
    backgroundColor: '#f0f0f0',
    padding: '0.15rem 0.4rem',
    borderRadius: '3px',
    color: '#6b6b6b'
  },
  statusBadge: {
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
    width: 'fit-content',
    display: 'block'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '560px',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #f0f0f0'
  },
  modalTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.3rem',
    color: '#1a1a1a'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    color: '#6b6b6b'
  },
  modalBody: {
    padding: '1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  modalFooter: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1.25rem 1.5rem',
    borderTop: '1px solid #f0f0f0'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#1a1a1a'
  },
  input: {
    padding: '0.85rem 1rem',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none'
  },
  select: {
    padding: '0.85rem 1rem',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    backgroundColor: '#ffffff'
  },
  textarea: {
    padding: '0.85rem 1rem',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    minHeight: '100px',
    resize: 'vertical'
  },
  toggleGroup: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  toggleButton: {
    padding: '0.4rem 0.8rem',
    border: '1.5px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  },
  cancelButton: {
    padding: '0.85rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  },
  submitButton: {
    flex: 1,
    padding: '0.85rem',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  }
}

export default SellerInventory
