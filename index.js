/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
// Connect to the db
MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  if (err) {
      return console.log(err);
  }

  // Specify database you want to access
  const db = client.db('local');
  const courses = db.collection('recordedData');
  courses.insertOne({ name: 'Web Security' }, (err, result) => { });
  console.log(`MongoDB Connected: ${url}`);
});
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const fileNameArr = file.originalname.split('.');
    cb(null, `${Date.now()}.${fileNameArr[fileNameArr.length - 1]}`);
  },
});
const upload = multer({ storage });
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public/assets'));
app.use(express.static('uploads'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/record', upload.single('audio'), (req, res) => res.json({ success: true }));

app.get('/recordings', (req, res) => {
  let files = fs.readdirSync(path.join(__dirname, 'uploads'));
  files = files.filter((file) => {
    // check that the files are audio files
    const fileNameArr = file.split('.');
    return fileNameArr[fileNameArr.length - 1] === 'mp3';
  }).map((file) => `/${file}`);
  return res.json({ success: true, files });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
