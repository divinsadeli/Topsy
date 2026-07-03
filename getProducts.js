const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({ region: process.env.AWS_REGION })
const docClient = DynamoDBDocumentClient.from(client)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Content-Type': 'application/json'
  }

  try {
    const { category, itemType } = event.queryStringParameters || {}

    // Build filter expression if filters provided
    let filterExpressions = []
    let expressionAttributeNames = {}
    let expressionAttributeValues = {}

    if (category && category !== 'all') {
      filterExpressions.push('#cat = :category')
      expressionAttributeNames['#cat'] = 'category'
      expressionAttributeValues[':category'] = category
    }

    if (itemType && itemType !== 'all') {
      filterExpressions.push('itemType = :itemType')
      expressionAttributeValues[':itemType'] = itemType
    }

    const params = {
      TableName: process.env.PRODUCTS_TABLE
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ')
      if (Object.keys(expressionAttributeNames).length > 0) {
        params.ExpressionAttributeNames = expressionAttributeNames
      }
      params.ExpressionAttributeValues = expressionAttributeValues
    }

    const result = await docClient.send(new ScanCommand(params))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        products: result.Items || [],
        count: result.Count || 0
      })
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to fetch products', error: error.message })
    }
  }
}
