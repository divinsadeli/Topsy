const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, GetCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({ region: process.env.AWS_REGION })
const docClient = DynamoDBDocumentClient.from(client)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Content-Type': 'application/json'
  }

  try {
    const { productId } = event.pathParameters

    // Get product
    const productResult = await docClient.send(new GetCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Key: { productId }
    }))

    if (!productResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Product not found' })
      }
    }

    // Get reviews for this product
    const reviewsResult = await docClient.send(new QueryCommand({
      TableName: process.env.REVIEWS_TABLE,
      IndexName: 'vendorId-index',
      KeyConditionExpression: 'vendorId = :vendorId',
      ExpressionAttributeValues: {
        ':vendorId': productResult.Item.sellerId
      },
      Limit: 10
    }))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        product: productResult.Item,
        reviews: reviewsResult.Items || []
      })
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to fetch product', error: error.message })
    }
  }
}
