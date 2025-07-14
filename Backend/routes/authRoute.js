const express = require('express');

const router = express.Router();

router.post('/login' , async (req, res) => {
    // Implement login logic here
    res.send('Login route');
});