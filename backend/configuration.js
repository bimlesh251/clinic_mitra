import dotenv from 'dotenv';
dotenv.config();

const config = {
    API_PORT:process.env.API_PORT || 3001,
    MONGO_URL:process.env.MONGO_URL,
    JWT_SECRET:process.env.JWT_SECRET,
    VERIFY_TOKEN: process.env.VERIFY_TOKEN,
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID:process.env.WHATSAPP_PHONE_NUMBER_ID,
};

export default config;
