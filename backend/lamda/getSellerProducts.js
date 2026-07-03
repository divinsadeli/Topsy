const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({ region: process.env.AWS_REGION })
const docClient = DynamoDBDocumentClient.from(client)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Content-Type': 'application/json'
  }

  try {
    const { sellerId } = event.pathParameters

    const result = await docClient.send(new QueryCommand({
      TableName: process.env.PRODUCTS_TABLE,
      IndexName: 'sellerId-index',
      KeyConditionExpression: 'sellerId = :sellerId',
      ExpressionAttributeValues: {
        ':sellerId': sellerId
      }
    }))

    // Enrich with inventory data (stock levels)
    const products = result.Items || []

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        products,
        count: products.length
      })
    }
  } catch (error) {
    console.error('Error fetching seller products:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to fetch seller products', error: error.message })
    }
  }
}
