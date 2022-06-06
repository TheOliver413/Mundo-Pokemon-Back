
const { Router } = require('express');

const PokemonRoute = require('./pokemon')
const {getTypes} = require('../controllers/typeController')

const router = Router();
router.use('/pokemon', PokemonRoute)
router.get("/type", async function(req,res){
    try{
        const type = await getTypes()
        res.json(type)
        }
    catch(e){
        console.log(e.message)
        res.send(e.message)
    }
})
module.exports = router;