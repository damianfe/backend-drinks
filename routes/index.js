const router = require('express').Router();
const { register, login, forgotPassword,updatePassword } = require('../controllers/authController');
const { profile, toggleFavorite } = require('../controllers/userController');
const checkToken = require('../middlewares/checkToken');

/* GET home page. */
router
  .get('/', function (req, res, next) {
    res.status(200).json({
      ok: true,
      message: "done!"
    });
  })
  .post('/api/register', register)
  .post('/api/login', login)
  .post('/api/forgot-password',forgotPassword)
  .post('/api/update-password', updatePassword)
  .get('/api/profile', checkToken, profile)
  .get('/api/favorite', checkToken, toggleFavorite)
module.exports = router;
