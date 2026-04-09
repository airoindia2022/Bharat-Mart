import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/stats', statsRoutes);

app.use((err, req, res, next) => {
    console.error('SERVER ERROR LOG:', err);
    res.status(err.status || 500).json({ 
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
