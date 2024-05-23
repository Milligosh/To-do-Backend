import { configDotenv } from 'dotenv';
configDotenv();

const development = { ...process.env,
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET,
};

export default development;
