import mongoose from 'mongoose';
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');
// Get the default connection
const db = mongoose.connection;
// Event listeners for connection status
db.on('error', (error) => {
  console.error(':x: MongoDB connection error:', error);
});
db.once('open', () => {
  console.log(':white_check_mark: Connected to MongoDB!');
});
// Export the connection
export default db;