const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb')
const { randomUUID } = require('crypto')

const client = new DynamoDBClient({ region: process.env.AWS_REGION })
const docClient = DynamoDBDocumentClient.from(client)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Content-Type': 'application/json'
  }

  try {
    const body = JSON.parse(event.body)
    const { name, category, itemType, price, sizes, colours, description, sellerId, sellerName } = body

    if (!name || !category || !itemType || !price || !sellerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields: name, category, itemType, price, sellerId' })
      }
    }

    const product = {
      productId: randomUUID(),
      name,
      category,
      itemType,
      price: Number(price),
      sizes: sizes || [],
      colours: colours || [],
      description: description || '',
      sellerId,
      sellerName: sellerName || '',
      stock: 10,
      unitsSold: 0,
      rating: 0,
      reviewCount: 0,
      inStock: true,
      discount: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    }

    await docClient.send(new PutCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Item: product
    }))

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ message: 'Product created successfully', product })
    }
  } catch (error) {
    console.error('Error creating product:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to create product', error: error.message })
    }
  }
}
