const express = require('express');
const Image = require('../models/Image.js');

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (image) {
            res.set('Content-Type', image.contentType);
            res.send(image.data);
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
