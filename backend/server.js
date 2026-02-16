const express = require('express')
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { connectDatabase } = require('./config/config');
const cloudinary = require('cloudinary').v2
const cors = require('cors')
const { errorMiddleware } = require('./middleware/errors');

// Handle Uncaught exceptions
process.on('uncaughtException', err => {
  console.log(`ERROR: ${err.stack}`);
  console.log('Shutting down server due to Uncaught Exception');
  process.exit(1)
})

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

// Middleware to handle errors
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})

// Handle Unhandled Promise rejections
process.on('unhandledRejection', err => {
  console.log(`ERROR: ${err.message}`);
  console.log('Shutting down the server due to Unhandled Promise rejection');
  server.close(() => {
    process.exit(1)
  })
})
