# Topsy — Cloud-Native Fashion Marketplace

A full-stack fashion marketplace built to demonstrate cloud architecture and data analytics skills using AWS and React.

## Tech Stack
- **Frontend:** React (Vite)
- **Authentication:** AWS Cognito
- **Database:** Amazon DynamoDB + Amazon RDS (PostgreSQL)
- **Recommendations:** AWS Personalize
- **Storage:** Amazon S3 + CloudFront
- **API:** AWS Lambda + API Gateway
- **Events:** Amazon EventBridge + SNS
- **CI/CD:** AWS CodePipeline + CodeBuild
- **Infrastructure as Code:** AWS CloudFormation

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

## Architecture
See `/docs/architecture.md` for full system design.

## Build Phases
- [ ] Phase 1 — Project setup, GitHub structure and documentation plan
- [ ] Phase 2 — Infrastructure as Code (CloudFormation templates)
- [ ] Phase 3 — AWS CodePipeline CI/CD setup
- [ ] Phase 4 — AWS Cognito authentication
- [ ] Phase 5 — Frontend (React) scaffold
- [ ] Phase 6 — DynamoDB schema and REST API (Lambda + API Gateway)
- [ ] Phase 7 — Buyer dashboard + AWS Personalize
- [ ] Phase 8 — Seller dashboard + analytics (RDS PostgreSQL)
- [ ] Phase 9 — S3 image uploads + CloudFront CDN
- [ ] Phase 10 — End to end testing and final deployment
