const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, QueryCommand, GetCommand } = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({ region: process.env.AWS_REGION })
const docClient = DynamoDBDocumentClient.from(client)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Content-Type': 'application/json'
  }

  try {
    const { userId } = event.pathParameters

    // Get all cart items for this user
    const cartResult = await docClient.send(new QueryCommand({
      TableName: process.env.CART_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }))

    const cartItems = cartResult.Items || []

    // Enrich each cart item with latest product data
    const enrichedItems = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const productResult = await docClient.send(new GetCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId: item.productId }
          }))
          const product = productResult.Item || {}
          return {
            ...item,
            name: product.name || item.name,
            price: product.discount > 0
              ? Math.round(product.price * (1 - product.discount / 100))
              : product.price || item.price,
            originalPrice: product.price || item.price,
            discount: product.discount || 0,
            category: product.category || item.category,
            sellerName: product.sellerName || item.sellerName,
            inStock: product.inStock !== false
          }
        } catch {
          return item
        }
      })
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        cartItems: enrichedItems,
        count: enrichedItems.length
      })
    }
  } catch (error) {
    console.error('Error fetching cart:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to fetch cart', error: error.message })
    }
  }
}
