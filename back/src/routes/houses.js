const { Router } = require("express");
const router = Router()
const Houses = require('../controllers/houses.controller')
const auth = require('../middleware/auth')

router.post('/create-house',auth,Houses.createHouse)
router.get('/list',auth,Houses.listHouses)

module.exports = router;