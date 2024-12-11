const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const validateJWT = require('./auth'); // Import the JWT validation middleware

const app = express();
const port = 5000;

// Enable CORS for your frontend
app.use(cors({
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header for the token
}));

app.use(express.json({ limit: '50mb' })); // To handle large base64 strings

// Protected route to serve uploads securely
app.get('/uploads/:filename', validateJWT, (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Create the uploads folder if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Public route (no authentication required)
app.get('/healthz', (req, res) => {
    res.status(200);
});
// Public route (no authentication required)
app.get('/private', validateJWT, (req, res) => {
    res.send('This is a private route, login required.');
});

// Protected route - Requires authentication via JWT token
app.post('/upload', validateJWT, (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'No image data received' });
    }

    // Process the image as usual
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const fileName = Date.now() + '.png'; // Generate filename
    const filePath = path.join('uploads', fileName);

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error saving the image' });
        }
        res.json({ fileName });
    });
});

app.listen(port, () => {
    console.log(`Server is running on kthcloud:${port}`);
});
