import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import config from './configuration.js'
import apiRoutes from "./src/routes/api.routes.js";
import webhookRoutes from "./src/routes/webhook.routes.js";


dotenv.config();
const app = express();

// Middleware
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({limit: '30mb',extended: true}));

app.use('/sitedata', express.static(path.join('public')));

// Routes
app.use("/", (req, res)=>{
  res.status(200).json({
    message:"This is an appointment booking system",
  })
});
app.use("/api/v1", apiRoutes);
app.use("/webhook", webhookRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception');
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);

  process.exit(1);
});

// Start Server
const PORT = config.API_PORT || 3001;
const startServer = async () => {
  try {
    
    await mongoose.connect(config.MONGO_URL);    

    const server = app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });

  } catch (error) {
      console.error('Error starting the server');
      console.error(error.stack);
  }
};
startServer();