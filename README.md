Topsy — Cloud-Native Fashion Marketplace
> A serverless fashion marketplace for Ghanaian women, built on AWS to demonstrate cloud architecture, infrastructure as code, and data analytics skills.
Live app: https://demnkngw3rsfk.cloudfront.net  
Admin dashboard: https://demnkngw3rsfk.cloudfront.net/admin  
Region: eu-north-1 (Stockholm)
---
Overview
Topsy is a fashion e-commerce platform targeting Ghanaian women, built from scratch on AWS. The project was informed by primary market research — a survey of 14 Ghanaian women — which revealed that trust and vendor verification are the primary barriers to online fashion shopping in Ghana, with over 57% of respondents having been scammed or nearly scammed on informal channels (Instagram, WhatsApp, TikTok).
The platform was built to demonstrate:
Cloud-native architecture using AWS managed services
Infrastructure as Code with CloudFormation
CI/CD automation with CodePipeline and CodeBuild
Serverless backend with Lambda and API Gateway
Data simulation and analytics
---
Architecture
```
┌─────────────────────────────────────────────────────┐
│                   CI/CD Pipeline                    │
│  GitHub → CodePipeline → CodeBuild → S3 (frontend)  │
└─────────────────────────────────────────────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
        CloudFront     Cognito    API Gateway
        (HTTPS CDN)   (Auth)     (REST API)
                                     │
              ┌──────────────────────┤
              ▼                      ▼
         Lambda (7 functions)   Lambda (getOrders)
              │
              ▼
        DynamoDB Tables
        (products · orders · users · cart · reviews)
              │
              ▼
     Analytics Layer
     Export Lambda → S3 (topsy-analytics) → Admin Dashboard
```
---
AWS Services Used
Service	Purpose
CloudFront	CDN: HTTPS termination, cache invalidation on deploy
S3	Frontend static hosting, analytics data (CSV export)
Cognito	User authentication, buyer/seller role management
API Gateway	REST API with 9 endpoints
Lambda	Serverless business logic (Node.js 24.x)
DynamoDB	NoSQL database for products, orders, users, cart, reviews
CodePipeline	CI/CD orchestration triggered by GitHub push
CodeBuild	React build + S3 deploy + CloudFront invalidation
CloudFormation	Infrastructure as Code for all AWS resources
IAM	Least-privilege roles for Lambda and CodePipeline
---
CloudFormation Stacks
The infrastructure is modular — each stack is independently deployable:
Stack	Template	Resources
`topsy-storage`	`storage.yaml`	S3 buckets, DynamoDB tables (8 tables)
`topsy-auth`	`auth.yaml`	Cognito User Pool, buyer/seller groups
`topsy-cdn`	`cdn.yaml`	CloudFront distribution, OAC, S3 bucket policy
`topsy-api`	`api.yaml`	API Gateway, 7 Lambda functions, IAM role
---
API Endpoints
Method	Endpoint	Function
GET	`/products`	Fetch all products (with filters)
GET	`/products/{productId}`	Fetch single product + reviews
GET	`/products/seller/{sellerId}`	Fetch seller's products
POST	`/products`	Create new product
PUT	`/products/{productId}`	Update product
GET	`/cart/{userId}`	Fetch user's cart
POST	`/cart/{userId}`	Add item to cart
PUT	`/cart/{userId}/{cartItemId}`	Update cart item quantity
DELETE	`/cart/{userId}/{cartItemId}`	Remove cart item
GET	`/orders`	Fetch all orders (analytics)
---
Frontend
Built with React + Vite, deployed automatically via CI/CD:
`BuyerHome` — product browsing with category and item type filters
`BuyerProduct` — product detail page with size/colour selection, reviews, seller info
`BuyerCart` — cart management with Paystack payment flow (MoMo + card)
`SellerDashboard` — seller overview
`SellerInventory` — product management with add/edit forms
`AdminDashboard` — analytics dashboard with 4 tabs (Overview, Sales, Behaviour, Sellers)
---
Data & Analytics
The app includes a simulated dataset modelled on the market research findings:
100 users — budget tiers matching survey data (43% under 50 GHC, 43% 50–150 GHC, 14% 150–300 GHC)
383 orders — Jan–Jul 2026, weighted by product popularity and peak hours
217 reviews — from 65% of delivered orders
Peak shopping hours — 12–14h (lunch) and 19–22h (evening), reflecting Ghanaian browsing patterns
Payment methods — MTN MoMo dominant, reflecting Ghana's mobile money ecosystem
Analytics data is exported from DynamoDB to S3 as CSV via a Lambda function, and visualised in the React admin dashboard using Recharts.
Key analytics insights:
GHC 39,973 total simulated revenue
76% delivery rate, 4% cancellation rate
Casual and in-office categories drive the most orders
MTN MoMo accounts for ~50% of payments
---
Market Research
The product was informed by a survey of 14 Ghanaian women on their online fashion shopping habits.
Top pain points:
Difficulty verifying vendor trustworthiness (57% scam experience)
Platform fragmentation (shopping across Instagram, TikTok, WhatsApp, Facebook)
Time spent searching (30 mins to 1+ hour per session)
Most requested features:
Verified seller badges
Buyer reviews
Secure payment
Delivery tracking
These findings directly shaped Topsy's core features: verified seller badges, integrated reviews, Paystack payments (with MoMo support), and a single curated marketplace.
---
CI/CD Pipeline
Every push to `main` automatically:
Triggers CodePipeline via GitHub webhook
CodeBuild installs dependencies (`npm install`)
Builds the React app (`npm run build`)
Syncs the `dist/` folder to S3 (`aws s3 sync`)
Invalidates the CloudFront cache (`aws cloudfront create-invalidation`)
Average deploy time: ~3 minutes from push to live.
---
Repository Structure
```
Topsy/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── buyer/        # BuyerHome, BuyerProduct, BuyerCart
│   │   │   ├── seller/       # SellerDashboard, SellerInventory
│   │   │   └── admin/        # AdminDashboard (analytics)
│   │   ├── components/       # LoadingScreen
│   │   └── App.jsx
│   └── package.json
├── backend/
│   └── lambda/               # Lambda function code
│       ├── getProducts.js
│       ├── getProduct.js
│       ├── getSellerProducts.js
│       ├── createProduct.js
│       ├── updateProduct.js
│       ├── getCart.js
│       ├── manageCart.js
│       ├── getOrders.mjs
│       ├── seedData.mjs
│       └── simulateData.mjs
└── infrastructure/
    ├── storage.yaml           # S3 + DynamoDB
    ├── auth.yaml              # Cognito
    ├── cdn.yaml               # CloudFront
    ├── api.yaml               # API Gateway + Lambda
    └── pipeline               # CodePipeline (deployed separately)
```
---
Key Learnings
CloudFormation sibling path variables in API Gateway require careful route structuring
Lambda handler naming must match the deployed filename exactly (case-sensitive on Linux build servers)
CI/CD pipeline requires explicit S3 and CloudFront IAM permissions on the CodeBuild role
CloudFront caching requires explicit invalidation after each deploy
DynamoDB `Scan` operations paginate — always handle `LastEvaluatedKey` for complete results
---
Built With
Frontend: React 18, Vite, React Router, Recharts, AWS Amplify
Backend: AWS Lambda (Node.js 24.x), API Gateway, DynamoDB
Auth: AWS Cognito
Infrastructure: CloudFormation, CodePipeline, CodeBuild, CloudFront, S3
Payments: Paystack (Ghana — MTN MoMo, Telecel Cash, AirtelTigo, card)
Region: eu-north-1
---
Built as a portfolio project to demonstrate AWS Cloud Practitioner skills in a real-world application context.



## Features
### Buyer Side
- Personalised home feed based on browsing history
- Product search with size and colour filters
- Cart and saved items
- Vendor reviews
- Discounts and trending items

### Seller Side
- Inventory management (in stock / out of stock)
- Store performance dashboard
- Best selling items analytics
- Order management

## Project Documentation
Each phase of this build is documented on Medium. Links added as published.



