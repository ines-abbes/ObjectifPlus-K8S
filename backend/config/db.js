const mongoose = require('mongoose');


const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_DB   = process.env.MONGO_DB;

//const JWT_SECRET = super_secret_key
const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:27017/${MONGO_DB}?authSource=admin`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur MongoDB', error.message);
    process.exit(1);
  }
};

//export default connectDB;
module.exports = connectDB;
