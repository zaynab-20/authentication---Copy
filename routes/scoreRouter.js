const express = require('express');
const {  authenticationAdmin, authenticate } = require('../middleWare/authentication');
const { createScores, getAllScoresByStudent, getAllScores } = require('../controllers/storeController');

const router = express.Router();

router.post('/assess/student/:userId', authenticationAdmin, createScores)
router.get('/scores/student/', authenticate, getAllScoresByStudent)
router.get('/all-scores', authenticationAdmin, getAllScores)

module.exports = router;