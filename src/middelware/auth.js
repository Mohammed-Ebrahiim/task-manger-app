const jwt = require('jsonwebtoken')
const Author = require('../models/authors')


const auth = async (req,res,next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,'node-course')
        const author = await Author.findOne({_id:decode._id,tokens:token})
    // console.log(user)
    if(!author){
        throw new Error()
    }
    req.author = author
    // logout
    req.token = token

        next()
    }
    catch(e){
        res.status(401).send({error:'Please Authenticate'})
    }
}

module.exports = auth