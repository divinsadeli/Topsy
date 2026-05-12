import { useState, useEffect } from 'react'
import { signOut } from 'aws-amplify/auth'
import { useNavigate } from 'react-router-dom'

function BuyerHome({ user }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [cartCount, setCartCount] = useState(0)
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

  // Placeholder products — will be replaced by DynamoDB data
  const placeholderProducts = [
    {
      productId: '1',
      name: 'Structured Blazer Top',
      price: 120,
      category: 'in-office',
      itemType: 'top',
      colours: ['Black', 'Nude'],
      sizes: ['S', 'M', 'L', 'XL'],
      rating: 4.5,
      reviewCount: 12,
      inStock: true,
      discount: 0
    },
    {
      productId: '2',
      name: 'Flowy Wrap Dress',
      price: 180,
      category: 'out-of-office',
      itemType: 'dress',
      colours: ['Rose', 'White'],
      sizes: ['XS', 'S', 'M', 'L'],
      rating: 4.8,
      reviewCount: 24,
      inStock: true,
      discount: 10
    },
    {
      productId: '3',
      name: 'Basic Crop Top',
      price: 45,
      category: 'casual',
      itemType: 'top',
      colours: ['White', 'Black', 'Nude'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      rating: 4.2,
      reviewCount: 8,
      inStock: true,
      discount: 0
    },
    {
      productId: '4',
      name: 'Cut-Out Bodycon Top',
      price: 95,
      category: 'spicy',
      itemType: 'top',
      colours: ['Black', 'Red'],
      sizes: ['S', 'M', 'L'],
      rating: 4.6,
      reviewCount: 19,
      inStock: true,
      discount: 15
    },
    {
      productId: '5',
      name: 'High-Waist Tailored Trousers',
      price: 150,
      category: 'in-office',
      itemType: 'trouser',
      colours: ['Black', 'Navy', 'Beige'],
      sizes: ['S', 'M', 'L', 'XL'],
      rating: 3.8,
      reviewCount: 7,
      inStock: true,
      discount: 5
    }
    ]

