// mission.routes.js
const express = require('express');
const router = express.Router();
const missionController = require('../controller/mission');
const {uploadPhoto} = require('../middleware/fileUpload')
const { requireAuth } = require('../middleware/authmiddleware');

router.get('/getMission',requireAuth, missionController.getAllMissions);
router.put('/updateMission', uploadPhoto,missionController.updateMission);
router.delete('/image/:imageFilename/:index',requireAuth,missionController.deletePhotoAndAltText )
router.get('/getAllMission', missionController.getAllMissions);

module.exports = router;
   