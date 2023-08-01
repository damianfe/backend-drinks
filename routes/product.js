const router = require('express').Router();
const { getWhisky, getVinos, getLicors } = require('../controllers/productController');

//const { drinks } = require('../controllers/drinkController');



router

.get('/api/whiskys', getWhisky)
.get('/api/vinos', getVinos)
.get('/api/licores', getLicors)




module.exports = router;