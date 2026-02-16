const express = require('express')
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { connectDatabase } = require('./config/config');
const cloudinary = require('cloudinary').v2
const cors = require('cors')

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const couponRoutes = require('./routes/coupons');
const orderRoutes = require('./routes/orders');
const storeRoutes = require('./routes/stores');
const ingredientRoutes = require('./routes/ingredients');
const roleRoutes = require('./routes/role');
const statsRoutes = require('./routes/stats');

connectDatabase();
app.use(cors())
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Register routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', couponRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', storeRoutes);
app.use('/api/v1', ingredientRoutes);
app.use('/api/v1', roleRoutes);
app.use('/api/v1', statsRoutes);
// app.use('/api/v1', configRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use((err, req, res, next) => {
  let error = { ...err }

  error.message = err.message;

  // Wrong Mongoose Object ID Error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`
    error = new Error(message)
  }

  // Handling Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(value => value.message);
    error = new Error(message)
  }

  // Handling Mongoose duplicate key errors
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`
    error = new Error(message)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
