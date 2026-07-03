const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb')
const { randomUUID } = require('crypto')

const client = new DynamoDBClient({ region: process.env.AWS_REGION })
const docClient = DynamoDBDocumentClient.from(client)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Content-Type': 'application/json'
  }

  const method = event.httpMethod
  const pathParams = event.pathParameters || {}

  try {
    // POST /cart — add item to cart
    if (method === 'POST') {
      const body = JSON.parse(event.body)
      const { userId, productId, selectedSize, selectedColour, quantity } = body

      if (!userId || !productId || !selectedSize || !selectedColour) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Missing required fields: userId, productId, selectedSize, selectedColour' })
        }
      }

      // Get product details to store with cart item
      const productResult = await docClient.send(new GetCommand({
        TableName: process.env.PRODUCTS_TABLE,
        Key: { productId }
      }))

      const product = productResult.Item
      if (!product) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Product not found' })
        }
      }

      const cartItem = {
        userId,
        productId,
        cartItemId: randomUUID(),
        selectedSize,
        selectedColour,
        quantity: quantity || 1,
        name: product.name,
        price: product.discount > 0
          ? Math.round(product.price * (1 - product.discount / 100))
          : product.price,
        originalPrice: product.price,
        discount: product.discount || 0,
        category: product.category,
        sellerName: product.sellerName || '',
        inStock: product.inStock !== false,
        addedAt: new Date().toISOString()
      }

      await docClient.send(new PutCommand({
        TableName: process.env.CART_TABLE,
        Item: cartItem
      }))

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: 'Item added to cart', cartItem })
      }
    }

    // PUT /cart/{cartItemId} — update quantity
    if (method === 'PUT') {
      const { cartItemId } = pathParams
      const { userId, quantity } = JSON.parse(event.body)

      if (!cartItemId || !userId || quantity === undefined) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Missing required fields: cartItemId, userId, quantity' })
        }
      }

      await docClient.send(new UpdateCommand({
        TableName: process.env.CART_TABLE,
        Key: { userId, productId: cartItemId },
        UpdateExpression: 'SET quantity = :quantity, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':quantity': Math.max(1, quantity),
          ':updatedAt': new Date().toISOString()
        }
      }))

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Cart item updated', cartItemId })
      }
    }

    // DELETE /cart/{cartItemId} — remove item
    if (method === 'DELETE') {
      const { cartItemId } = pathParams
      const { userId } = event.queryStringParameters || {}

      if (!cartItemId || !userId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Missing required fields: cartItemId, userId' })
        }
      }

      await docClient.send(new DeleteCommand({
        TableName: process.env.CART_TABLE,
        Key: { userId, productId: cartItemId }
      }))

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Item removed from cart', cartItemId })
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Error managing cart:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Cart operation failed', error: error.message })
    }
  }
}
