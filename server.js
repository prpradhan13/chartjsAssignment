import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// config env
dotenv.config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Define a schema
const DataSchema = new mongoose.Schema({
    end_year: String,
    intensity: Number,
    sector: String,
    topic: String,
    insight: String,
    url: String,
    region: String,
    start_year: String,
    impact: String,
    added: String,
    published: String,
    country: String,
    relevance: Number,
    pestle: String,
    source: String,
    title: String,
    likelihood: Number,
}, { collection: 'graph' });
  
// Define a model
const Data = mongoose.model('Data', DataSchema);

// ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './frontend/dist')));

app.use('*', function(req, res){
  res.sendFile(path.join(__dirname, './frontend/dist/index.html'))
});

app.get('/api/data', async (req, res) => {
    try {
      const data = await Data.find();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 8080;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

