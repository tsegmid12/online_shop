# MongoDB Integration Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas account)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This installs:
- `express`: Backend server framework
- `mongoose`: MongoDB object modeling
- `cors`: Cross-Origin Resource Sharing
- `dotenv`: Environment variable management
- `nodemon`: Auto-reload for development

### 2. Setup MongoDB

#### Option A: Local MongoDB
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create a database user
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/online_shop`)

### 3. Configure Environment Variables
1. Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
2. Update `.env` with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/online_shop
   # OR for MongoDB Atlas:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/online_shop?retryWrites=true&w=majority
   ```

### 4. Run the Server

**Development mode** (with auto-reload):
```bash
npm run server-dev
```

**Production mode**:
```bash
npm run server
```

Server will run on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/search/:query` - Search products by name
- `GET /api/health` - Health check

## Database Schema

### Product Collection
```javascript
{
  name: String (required),
  price: Number (required),
  description: String,
  imageUrl: String,
  category: String,
  stock: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps

### Update Frontend to Use API
Modify your React components to use the backend API instead of IndexedDB:

```javascript
// Example: Get all products
const response = await fetch('http://localhost:5000/api/products');
const products = await response.json();

// Example: Create product
await fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Product', price: 100 })
});
```

### Migrate Data from IndexedDB to MongoDB
Create a migration script to transfer existing IndexedDB data to MongoDB.

## Troubleshooting

**Connection Refused Error**
- Ensure MongoDB service is running
- Check MongoDB connection string in `.env`
- For Atlas, verify IP whitelist includes your computer

**Port Already in Use**
- Change PORT in `.env`
- Or kill process: `lsof -i :5000` then `kill -9 <PID>`

**CORS Errors**
- Ensure server is running before frontend
- Check that frontend is making requests to `http://localhost:5000`

## Production Deployment

For production deployment to services like Heroku, AWS, or Docker:
1. Set environment variables on the hosting platform
2. Ensure MongoDB Atlas (or production database) is accessible
3. Update frontend API URL to point to production server
4. Build frontend: `npm run build`
