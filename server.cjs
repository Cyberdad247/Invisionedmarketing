const express = require('express');
const path = require('path');
const fs = require('fs'); // Add fs module
const app = express();
const PORT = 3000;

app.use(express.json()); // Add middleware for parsing JSON

// Serve static files
app.use(express.static('public'));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes for other pages
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Endpoint to update hero section
app.post('/api/update-hero', (req, res) => {
    const { title, subtitle } = req.body;
    const filePath = path.join(__dirname, 'public', 'index.html');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading index.html');
        }

        // Basic string replacement - might need more robust parsing for complex HTML
        let updatedData = data.replace(
            /<h1[^>]*>.*?<\/h1>/s,
            `<h1>${title}</h1>`
        ).replace(
            /<p class="subtitle">.*?<\/p>/s,
            `<p class="subtitle">${subtitle}</p>`
        );

        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing to index.html');
            }
            res.send('Hero section updated successfully');
        });
    });
});

// Error Handling for 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
