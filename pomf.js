const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');

const app = express();

app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
});

async function uploadFile(buffer, filename) {
  try {
    const form = new FormData();
    form.append('files[]', buffer, {
      filename: filename,
      contentType: 'application/octet-stream',
    });

    const { data } = await axios.post('https://pomf2.lain.la/upload.php', form, {
      headers: form.getHeaders(),
    });

    return data;
  } catch (err) {
    console.error(err);
    return String(err);
  }
}

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const result = await uploadFile(req.file.buffer, `${Date.now()}-${req.file.originalname}`);

    if (result && result.success) {
      const { name, url, size } = result.files[0];

      return res.status(200).json({
        message: 'File uploaded successfully',
        name: name,
        url: url,
        size: size,
      });
    } else {
      return res.status(500).json({
        message: 'File upload failed',
        error: result,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'An error occurred',
      error: err.message,
    });
  }
});

const port = 25714;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
