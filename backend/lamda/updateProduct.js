const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb')

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
    const body = JSON.parse(event.body)

    // Check product exists
    const existing = await docClient.send(new GetCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Key: { productId }
    }))

    if (!existing.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Product not found' })
      }
    }

    // Build update expression dynamically from provided fields
    const allowedFields = ['name', 'category', 'itemType', 'price', 'sizes',
      'colours', 'description', 'stock', 'discount', 'status', 'inStock']

    let updateExpressions = []
    let expressionAttributeNames = {}
    let expressionAttributeValues = {}

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateExpressions.push(`#${field} = :${field}`)
        expressionAttributeNames[`#${field}`] = field
        expressionAttributeValues[`:${field}`] = body[field]
      }
    })

    updateExpressions.push('#updatedAt = :updatedAt')
    expressionAttributeNames['#updatedAt'] = 'updatedAt'
    expressionAttributeValues[':updatedAt'] = new Date().toISOString()

    await docClient.send(new UpdateCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Key: { productId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Product updated successfully', productId })
    }
  } catch (error) {
    console.error('Error updating product:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to update product', error: error.message })
    }
  }
}
