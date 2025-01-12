const express = require('express');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('public'));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/about.html', (req, res) => {
    res.sendFile(__dirname + '/public/about.html');
});

app.get('/services.html', (req, res) => {
    res.sendFile(__dirname + '/public/services.html');
});

app.get('/contact.html', (req, res) => {
    res.sendFile(__dirname + '/public/contact.html');
});

// Error Handling for 404
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});