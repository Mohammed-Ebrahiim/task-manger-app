const express = require('express')
const Author = require('../models/authors')
const router = new express.Router()
const auth = require('../middelware/auth')

const multer = require('multer')
const upload = multer({
    limits:1000000,
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)){
            cb(new Error("Please Upload img"))
        }
        cb(null,true)
    }
})
// POST
router.post('/profile/avatar', auth, upload.single('avatar'),async(req,res)=>{
    try {
        req.author.avatar = req.file.buffer
        await req.author.save()
        res.send('Uploaded Successfully')
    } catch (error) {
        res.send(error.message)
    }
})

/////////////////////////////////////////////////////////////////// 
// SignUp & Login 
router.post('/signUp',async (req,res)=>{
    try{
       const author = new Author(req.body) 
       await author.save()
        const token = await author.generateToken()
        res.status(200).send({author,token})
    }
   catch(e){
       res.status(400).send(e.message)
   }
})

router.post('/login',async(req,res)=>{
try{
    const author = await Author.findByCredentials(req.body.email,req.body.password)
    const token = await author.generateToken()
    res.status(200).send({author,token})
}
catch(e){
    res.status(400).send(e.message)
}
})

////////////////////////////////////////////////////////////////////////////

// profile

router.get('/profile',auth,async(req,res)=>{
    res.status(200).send(req.author)
})

//////////////////////////////////////////////////////////////////////////////

// get all users

router.get('/authors',auth,(req,res)=>{
    Author.find({}).then((authors)=>{
        res.status(200).send(authors)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
//////////////////////////////////////////////////////////////////////////////

router.get('/authors/:id',auth,(req,res)=>{
    // console.log(req.params)
    // console.log(req.params.id)
    const _id = req.params.id

    Author.findById(_id).then((author)=>{
        console.log(author)
        if(!author){
        return res.status(404).send('Unable to find author')
        }
        res.status(200).send(author)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
/////////////////////////////////////////////////////////////////////////////

router.patch('/profile',auth,async(req,res)=>{
    try{
        const updates = Object.keys(req.body)    
        const author = await Author.findById(req.params.id)

       if(!req.author){
        return res.status(404).send('No user is found')
        }
       updates.forEach((el)=>(author[el]=req.body[el]))
       await author.save()
        res.status(200).send(author)
    }
    catch(e){
        res.status(400).send(e)
    }
})
// 

router.delete('/authors/:id',auth,async(req,res)=>{
    try{
        const author = await Author.findByIdAndDelete(req.params.id)
        if(!author){
            return res.status(404).send('No user is found')
        }
        res.status(200).send(author)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
//////////////////////////////////////////////////////////////////////////////

// logout 
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.author.tokens = req.author.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.author.save()
        res.send('Logout Successfully')
    }
    catch(e){
        res.status(500).send(e)
    }
})

// logoutall 
router.delete('/logoutall',auth,async(req,res)=>{
    try{
        req.author.tokens = []
        await req.author.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }

})

module.exports = router