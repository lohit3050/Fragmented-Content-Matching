const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const textSimilarity = require('./models/textsimilarity'); // Import text similarity model

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({ storage });

function findMostSimilarImage(userImage, databaseDirectory) {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, 'models', 'imageSimilarity.py');
    const command = `python "${pythonScriptPath}" "${userImage}" "${databaseDirectory}"`;
    
    console.log(`Executing command: ${command}`); // Log the command
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject({ error: `Error executing Python script: ${error.message}` });
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return reject({ error: `stderr: ${stderr}` });
      }
    
      console.log(`Output: ${stdout}`);
    
      // Filter output to find the JSON line
      const lines = stdout.split('\n');
      const jsonLine = lines.find(line => line.trim().startsWith('{'));
    
      if (jsonLine) {
        try {
          const result = JSON.parse(jsonLine);
          resolve(result);
        } catch (parseError) {
          reject({ error: `Error parsing result: ${parseError.message}` });
        }
      } else {
        reject({ error: 'No valid JSON found in output' });
      }
    });    
  });
}

// POST route for image similarity check
app.post('/checkImage', upload.single('image'), async (req, res) => {
  const userImagePath = req.file.path; // Path of uploaded image
  const databasePath = path.join(__dirname, 'dummy_database');

  try {
    const result = await findMostSimilarImage(userImagePath, databasePath);
    res.json(result);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST route for text similarity check
app.post('/checkText', (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'No text provided.' });
  }

  const result = textSimilarity.checkTextSimilarity(userInput);
  if (result.error) {
    return res.status(500).json(result);
  }

  res.json(result);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
