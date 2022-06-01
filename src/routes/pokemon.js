const { Router } = require('express');
const pokemon = require('../controllers/pokemonController');


const router = Router();

router.get('/',
   pokemon.getAllPokemons
);

router.get('/orderAsc',
    pokemon.OrderAscAttack
);
router.get('/orderDesc',
    pokemon.OrderDescAttack
);

router.get('/filtAPI',
    pokemon.filtAPIPokemons
);

router.get('/filtOwn',
    pokemon.filtOwnPokemons
);


router.post('/',
    pokemon.addNewPokemon
)

router.get('/:id',
    pokemon.getPokemonById
)

module.exports = router;
