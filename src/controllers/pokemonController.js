const { Pokemon, Type, PokemonType } = require('../db')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid');


exports.addNewPokemon = async (req, res, next) => {
    const id = uuidv4();
    const { name, healthpoints, attack, defense, speed, height, weight, img, type } = req.body
    const newPokemon = await Pokemon.findOrCreate({
        where: { id, name, healthpoints, attack, defense, speed, height, weight, img }
    })

    let typePokemon = await Type.findAll({
        where: { name: type },
        default: { name: type }
    })
    await newPokemon[0].addTypes(typePokemon)
    res.send('pokemon created')
}



exports.getAllPokemons = async (req, res, next) => {
    try {
        const api = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=30')

        //DATABASE
        const elem = await Pokemon.findAll()
        const arg = await PokemonType.findAll()
        for (let i = 0; i < elem.length; i++) {
            elem[i] = { ...elem[i].dataValues, type: [] }
        }
        for (let i = 0; i < arg.length; i++) {
            const pokeId = arg[i].dataValues.pokemonId;
            const tipoId = arg[i].dataValues.typeId;

            const typeName = await Type.findAll({
                where: {
                    id: tipoId
                }
            })
            for (let j = 0; j < elem.length; j++) {
                if (pokeId.toString() === elem[j].id) {
                    elem[j].type.push(typeName[0].dataValues.name)
                }
            }
        }
        //FIN DATABASE
        let respuesta = api.data.results
        let info = [];
        for (let i = 0; i < respuesta.length; i++) {
            const apiRes = await axios.get(`${respuesta[i].url}`)
            let object = {
                id: respuesta[i].url.split('/')[6],
                img: apiRes.data.sprites.other.dream_world.front_default,
                name: apiRes.data.name,
                type: apiRes.data.types.map(e => e.type.name)
            }
            info.push(object)
        }
        let resultado = [...info, ...elem]
        res.send(resultado)
    } catch (error) {
        next(error);
    }
};



exports.getPokemonById = async (req, res, next) => {
    try {
        let info = []
        const hola = req.params
        if (req.params.id.length < 6 && typeof req.params.id === 'string') {

            const elem = await Pokemon.findAll()
            const arg = await PokemonType.findAll()
            for (let i = 0; i < elem.length; i++) {
                elem[i] = { ...elem[i].dataValues, type: [] }
            }
            for (let i = 0; i < arg.length; i++) {
                const pokeId = arg[i].dataValues.pokemonId;
                const tipoId = arg[i].dataValues.typeId;

                const typeName = await Type.findAll({
                    where: {
                        id: tipoId
                    }
                })
                for (let j = 0; j < elem.length; j++) {
                    if (pokeId.toString() === elem[j].id) {
                        elem[j].type.push(typeName[0].dataValues.name)
                    }
                }
            }
            for (let i = 0; i < elem.length; i++) {
                if (elem[i].name === hola.id) {
                    let obj = {
                        id: elem[i].id,
                        name: elem[i].name,
                        type: elem[i].type.toString(),
                        HP: elem[i].healthpoints,
                        attack: elem[i].attack,
                        defense: elem[i].defense,
                        speed: elem[i].speed,
                        height: elem[i].height,
                        weight: elem[i].weight,
                        img: elem[i].img
                    }
                    info.push(obj)
                }
            }
            if (info.length !== 0) {
                res.send(info[0])
            } else {
                const api = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`)
                let apiRes = api.data

                let object = {
                    id: apiRes.id,
                    img: apiRes.sprites.other.dream_world.front_default,
                    name: apiRes.name,
                    type: apiRes.types.map(x => x.type.name).toString(),
                    HP: apiRes.stats[0].base_stat,
                    attack: apiRes.stats[1].base_stat,
                    defense: apiRes.stats[2].base_stat,
                    speed: apiRes.stats[5].base_stat,
                    height: apiRes.height,
                    weight: apiRes.weight
                }
                res.send(object)
            }
        } else if (req.params.id.includes('-')) {
            const hola = req.params
            const elem = await Pokemon.findAll()
            const arg = await PokemonType.findAll()
            for (let i = 0; i < elem.length; i++) {
                elem[i] = { ...elem[i].dataValues, type: [] }
            }
            for (let i = 0; i < arg.length; i++) {
                const pokeId = arg[i].dataValues.pokemonId;
                const tipoId = arg[i].dataValues.typeId;

                const typeName = await Type.findAll({
                    where: {
                        id: tipoId
                    }
                })
                for (let j = 0; j < elem.length; j++) {
                    if (pokeId.toString() === elem[j].id) {
                        elem[j].type.push(typeName[0].dataValues.name)
                    }
                }
            }
            for (let i = 0; i < elem.length; i++) {
                if (elem[i].id === hola.id) {
                    let obj = {
                        id: elem[i].id,
                        name: elem[i].name,
                        type: elem[i].type.toString(),
                        HP: elem[i].healthpoints,
                        attack: elem[i].attack,
                        defense: elem[i].defense,
                        speed: elem[i].speed,
                        height: elem[i].height,
                        weight: elem[i].weight,
                        img: elem[i].img
                    }
                    res.send(obj)
                }
            }
        } else {
            const api = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`)
            let apiRes = api.data

            let object = {
                id: apiRes.id,
                img: apiRes.sprites.other.dream_world.front_default,
                name: apiRes.name,
                type: apiRes.types.map(x => x.type.name).toString(),
                HP: apiRes.stats[0].base_stat,
                attack: apiRes.stats[1].base_stat,
                defense: apiRes.stats[2].base_stat,
                speed: apiRes.stats[5].base_stat,
                height: apiRes.height,
                weight: apiRes.weight
            }
            res.send(object)
        }
    } catch (error) {
        res.status(500).json({ error: 'There was a mistake...' })

    };
}







exports.OrderAscAttack = async (req, res, next) => {
    try {
        const api = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=30')
          //DATABASE
          const elem = await Pokemon.findAll()
          const arg = await PokemonType.findAll()
          for (let i = 0; i < elem.length; i++) {
              elem[i] = { ...elem[i].dataValues, type: [] }
          }
          for (let i = 0; i < arg.length; i++) {
              const pokeId = arg[i].dataValues.pokemonId;
              const tipoId = arg[i].dataValues.typeId;
  
              const typeName = await Type.findAll({
                  where: {
                      id: tipoId
                  }
              })
              for (let j = 0; j < elem.length; j++) {
                  if (pokeId.toString() === elem[j].id) {
                      elem[j].type.push(typeName[0].dataValues.name)
                  }
              }
          }
        let respuesta = api.data.results
        let info = [];
        for (let i = 0; i < respuesta.length; i++) {
            const apiRes = await axios.get(`${respuesta[i].url}`)
            let object = {
                id: respuesta[i].url.split('/')[6],
                img: apiRes.data.sprites.other.dream_world.front_default,
                name: apiRes.data.name,
                type: apiRes.data.types.map(x => x.type.name),
                attack: apiRes.data.stats[1].base_stat,
            }
            info.push(object)
        }
        let resultado = [...info, ...elem]
       resultado.sort((a, b) => (a.attack > b.attack) ? 1 : ((b.attack > a.attack) ? -1 : 0))
        res.send(resultado)
    } catch (error) {
        res.status(500).json({ error: 'There was a mistake...' })
    }
};

exports.OrderDescAttack = async (req, res, next) => {
    try {
        const api = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=30')
               //DATABASE
               const elem = await Pokemon.findAll()
               const arg = await PokemonType.findAll()
               for (let i = 0; i < elem.length; i++) {
                   elem[i] = { ...elem[i].dataValues, type: [] }
               }
               for (let i = 0; i < arg.length; i++) {
                   const pokeId = arg[i].dataValues.pokemonId;
                   const tipoId = arg[i].dataValues.typeId;
       
                   const typeName = await Type.findAll({
                       where: {
                           id: tipoId
                       }
                   })
                   for (let j = 0; j < elem.length; j++) {
                       if (pokeId.toString() === elem[j].id) {
                           elem[j].type.push(typeName[0].dataValues.name)
                       }
                   }
               }
               //FIN DATABASE
        let respuesta = api.data.results
        let info = [];
        for (let i = 0; i < respuesta.length; i++) {
            const apiRes = await axios.get(`${respuesta[i].url}`)
            let object = {
                id: respuesta[i].url.split('/')[6],
                img: apiRes.data.sprites.other.dream_world.front_default,
                name: apiRes.data.name,
                type: apiRes.data.types.map(x => x.type.name),
                attack: apiRes.data.stats[1].base_stat,
            }
            info.push(object)
        }
        let resultado = [...info, ...elem]
        resultado.sort((a, b) => (a.attack < b.attack) ? 1 : ((b.attack < a.attack) ? -1 : 0))

        res.send(resultado)

    } catch (error) {
        res.status(500).json({ error: 'There was a mistake...' })
    }
};


exports.filtAPIPokemons = async (req, res, next) => {
    try {
        const api = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=30')
        let respuesta = api.data.results
        let info = [];
        for (let i = 0; i < respuesta.length; i++) {
            const apiRes = await axios.get(`${respuesta[i].url}`)
            let object = {
                id: respuesta[i].url.split('/')[6],
                img: apiRes.data.sprites.other.dream_world.front_default,
                name: apiRes.data.name,
                type: apiRes.data.types.map(e => e.type.name)
            }
            info.push(object)
        }
        res.send(info)
    } catch (error) {
        res.status(500).json({ error: 'There was a mistake...' })
    }
};

exports.filtOwnPokemons = async (req, res, next) => {
    try {
        const elem = await Pokemon.findAll()
        const arg = await PokemonType.findAll()
        for (let i = 0; i < elem.length; i++) {
            elem[i] = { ...elem[i].dataValues, type: [] }
        }
        for (let i = 0; i < arg.length; i++) {
            const pokeId = arg[i].dataValues.pokemonId;
            const tipoId = arg[i].dataValues.typeId;

            const typeName = await Type.findAll({
                where: {
                    id: tipoId
                }
            })
            for (let j = 0; j < elem.length; j++) {
                if (pokeId.toString() === elem[j].id) {
                    elem[j].type.push(typeName[0].dataValues.name)
                }
            }
        }
        res.send(elem)
    } catch (error) {
        res.status(500).json({ error: 'There was a mistake...' })
    }
};

