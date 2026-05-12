const express = require('express');
const router = express.Router();
const newsletterControllers = require('../controllers/newsletterControllers');

router.post('/add-newsletter', newsletterControllers.post);

module.exports = router;