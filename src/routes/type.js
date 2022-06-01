const { Router} = require('express');
const {getAllTypes, saveTypes} = require('../controllers/typeController');
const router = Router();

router.get('/',
getAllTypes
);




module.exports = router;

