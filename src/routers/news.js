const express = require('express')
const News = require('../models/news')
const router = new express.Router()
const auth = require('../middelware/auth')

const multer = require('multer')
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            cb(new Error('Please upload image'))
        }
        cb(null, true)
    }
})
// post

router.post('/news', auth, async(req,res)=>{
    try{
        const news = new News({...req.body,owner:req.author._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
router.post('/news/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findById({_id, owner: req.author._id})
        if (!news) {
            return res.status(400).send('Unable to find')
        }
        news.image = req.file.buffer
        await news.save()
        res.send('Uploaded Successfully')
    } 
    catch (e) {
        res.status(500).send(e.message)
    }
})



// get all
router.get('/news',auth,async(req,res)=>{
    try{
        await req.author.populate('news')
        res.send(req.author.news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.get('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findOne({_id,owner:req.author._id})
        if(!news){
            return res.status(404).send('No task is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})



// patch 
router.patch('/news/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const news = await News.findOneAndUpdate({_id,owner:req.author._id},req.body,{
            new:true,
            runValidators:true
        })
        if(!news){
            res.status(404).send('No news is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

// delete

router.delete('/news/:id',auth,async(req,res)=>{
    try{
        const news = await News.findByIdAndDelete(req.params.id)
        if(!news){
            res.status(404).send('No news is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.get('/authorNews/:id',auth,async(req,res)=>{
    try {
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.author._id})
        if(!news){
            return res.status(404).send('NO Task is found')
        }
        await news.populate('owner')
        res.status(200).send(news.owner)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router