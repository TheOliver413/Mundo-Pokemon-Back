const axios = require('axios')
const { Type } = require('../db')

exports.saveTypes = async (req, res, next) => {
    try {
        const api = await axios.get('https://pokeapi.co/api/v2/type/')
        let respuesta = api.data.results
        for (let i = 0; i < respuesta.length; i++) {
            const apiRes = await axios.get(`${respuesta[i].url}`)
            const typeCreated = Type.findOrCreate({
                where: {
                    name: apiRes.data.name,
                    id: respuesta[i].url.split('/')[6],
                }
            })
        }
    } catch (error) {
        next(error);
    }
}

exports.getAllTypes = async (req, res, next) => {
    Type.findAll()
        .then(categories => {
            res.json(categories);
        })
};


