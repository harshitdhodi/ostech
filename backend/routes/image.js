const express = require('express');
const router = express.Router();
const path = require('path')
const { requireAuth } = require('../middleware/authmiddleware');


router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../images', filename);

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'File download failed' });
        }
    });
});


router.get('/view/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../images', filename);

    // Check if file exists before sending
    if (!filename) {
        return res.status(400).json({ message: 'Filename is required' });
    }

    // Set appropriate content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.pdf' ? 'application/pdf' : 'image/*';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline');

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'File display failed' });
        }
    });
});

router.get('/catalogue/view/:filename', (req, res) => {
    const { filename } = req.params;

    if (!filename) {
        return res.status(400).json({ message: 'Filename is required' });
    }

    const filePath = path.join(__dirname, '../catalogues', filename);

    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.pdf' ? 'application/pdf' : 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).json({ message: 'File not found' });
        }
    });
});

module.exports = router;