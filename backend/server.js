const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan'); 
const connectDB = require('./config/connectDB');
const userRoute = require('./routes/userRoutes');
const adminRoute = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; 

connectDB()

morgan.format('custom', ':method  :url  :status  :response-time ms  :date[iso] '); 

// Middleware
app.use(morgan('custom'));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
