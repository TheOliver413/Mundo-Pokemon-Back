const { Router, response } = require('express');

const PokemonRoute = require('./pokemon')
const TypeRoute = require('./type')

const router = Router();

router.use('/pokemon', PokemonRoute)
router.use('/type', TypeRoute)

module.exports = router;
