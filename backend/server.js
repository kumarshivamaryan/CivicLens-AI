require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const analyzeImage = require('./utils/aiHandler');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Image ko RAM mein rakhne ke liye
const cors = require('cors');
const Report = require('./models/Report.js');
const { cloudinary } = require('./utils/cloudinaryConfig');
const route = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
 
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/auth', route);
app.use('/api/reports', reportRoutes);

app.post('/api/test-ai', upload.single('image'), async (req, res) => {
  try{
    if (!req.file) return res.status(400).send("Photo is not Detected!");

    const result = await analyzeImage(req.file.buffer);
    // 2. Cloudinary par upload (Buffer se seedha upload)
        const uploadResult = await new Promise((resolve, reject) => {
           const cld_stream = cloudinary.uploader.upload_stream({ folder: "civic_report" }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
            cld_stream.end(req.file.buffer);
        });

        // 3. Database mein Save (Aapke Schema ke hisaab se)
        const newReport = new Report({
            imageUrl: uploadResult.secure_url, // Cloudinary link
            category: result.category,       // AI se aaya
            priority: result.priority, 
            description: result.description, 
            location: {
                type: "Point",
                coordinates: [
                parseFloat(req.body.lng), // Pehle Longitude
                parseFloat(req.body.lat)  // Phir Latitude
              ]
            },
            userName: req.body.userName,
            phone: req.body.phone,

            status: 'Pending',
            createdAt: new Date(),
            user: req.body.userId,
            address: req.body.address
           
        });

        await newReport.save();
         
        res.json({
            message: "Report Filed Successfully!",
            data: newReport
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
       
})
// Saari reports fetch karne ke liye (Admin/User Dashboard ke liye)
app.get('/api/reports', async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 }); // Latest pehle aayega
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Test Route
app.get('/', (req, res) => {
  res.send("CIVIC AI Server is Running!");
});

app.use(cors({
  origin: 'https://civic-lens-ai-murex.vercel.app',
  credentials: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  
});

