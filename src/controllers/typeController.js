const axios = require('axios')
const { Type } = require('../db')

const getTypes = async function(){
    var types=[];
    let urls=[] 
    try{
    const apiInfo = await axios.get (`https://pokeapi.co/api/v2/type`)
    apiInfo.data.results.forEach(c=>{
        urls.push(c.url)
    })
    for(let i=0; i<urls.length; i++){
        let typ = await axios.get (urls[i])
        let ty={
            name:typ.data.name,
            id:typ.data.id
        }
        types.push(ty)
    }
    types.forEach(d=>{
        Type.findOrCreate({
            where:{
                name: d.name,
                id: d.id
            }
        })
    })
    const allTypes = await Type.findAll();
    return allTypes}
    catch(e){
        res.json(e)
    }
}

module.exports = {getTypes}
