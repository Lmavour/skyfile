const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

const filescrDir = path.join(__dirname, 'filescr');


const upload = multer({ dest: filescrDir });


app.use(express.static(path.join(__dirname, 'public')));

app.get('/file/:nama_file', (req, res) => {
    const { nama_file } = req.params;
    const filePath = path.join(filescrDir, nama_file);

    fs.stat(filePath, (err, stats) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        if (stats.isFile()) {
            const fileExt = path.extname(filePath).toLowerCase();

            if (fileExt === '.jpg' || fileExt === '.png' || fileExt === '.jpeg' || fileExt === '.gif') {
                res.setHeader('Content-Type', 'image/*');
            } else if (fileExt === '.mp4' || fileExt === '.webm' || fileExt === '.ogg') {
                res.setHeader('Content-Type', 'video/*');
            } else if (fileExt === '.mp3' || fileExt === '.wav' || fileExt === '.ogg') {
                res.setHeader('Content-Type', 'audio/*');
            } else {
                res.setHeader('Content-Disposition', `attachment; filename="${nama_file}"`);
            }

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            res.status(404).send('File not found');
        }
    });
});


app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
