const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests only from the React frontend
    methods: ['GET', 'POST'], // Allow GET and POST requests
    allowedHeaders: ['Content-Type'], // Allow Content-Type header
}));
// Create the uploads folder if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

app.use(express.json({ limit: '50mb' })); // To handle large base64 strings

// Endpoint to receive the modified image
app.post('/upload-modified', (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'No image data received' });
    }

    // Remove the "data:image/png;base64," part of the string
    const base64Data = image.replace(/^data:image\/png;base64,/, '');

    // Write the image to a file (you can change the file path and name as needed)
    const filePath = path.join(__dirname, 'uploads', Date.now() + '.png');

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error saving the image' });
        }
        res.json({ message: 'Image uploaded successfully', filePath });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
