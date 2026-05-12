const express = require('express');
const router = express.Router();
const newsletterControllers = require('../controllers/newsletterControllers');
const sendEmail = require('../middlewares/sendEmail');

router.post('/add-newsletter', newsletterControllers.post, sendEmail);

module.exports = router;