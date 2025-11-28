const express = require('express');
const path = require('path');

const app = express();
// The port Render provides us in an environment variable
const PORT = process.env.PORT || 8080;

// Define the directory where your built Angular app will be
// Make sure this matches the outputPath in your angular.json file (e.g., 'dist/your-project-name')
const DIST_FOLDER = path.join(__dirname, '/dist/aparmtment_1/browser');

// Serve static files from the Angular dist directory
app.use(express.static(DIST_FOLDER));

// Redirect all other requests to the index.html file
console.log(path.join(DIST_FOLDER, 'index.html'));
app.get('/reports', async (req, res) => {
  res.sendFile(path.join(DIST_FOLDER, 'index.html'));
})
app.get('/transaction', async (req, res) => {
  res.sendFile(path.join(DIST_FOLDER, 'index.html'));
})


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
