const awsConfig = {
  Auth: {
    Cognito: {
      // eu-north-1_UO9s5J6pa
      // Looks like: us-east-1_xxxxxxxxx
      userPoolId: 'eu-north-1_UO9s5J6pa',

      // Replace with your actual Client ID
      // Found in Cognito > App clients
      userPoolClientId: '32u9hmdl8v5ke0aci4s8cq5nkm',

      // The hosted login domain we created
      loginWith: {
        oauth: {
          domain: 'topsy-auth.auth.us-east-1.amazoncognito.com',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: ['http://localhost:3000/callback'],
          redirectSignOut: ['http://localhost:3000'],
          responseType: 'code'
        }
      }
    }
  }
}

export default awsConfig
