const mongoose = require('mongoose')

const News = mongoose.model('News',{
    title:{
        type : String,
        required : true,
        trim : true
    },
    description:{
        type : String,
        required : true,
        trim : true
    },
    Owner:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Author"
    },
    image: {
        type: Buffer
    }
})
module.exports = News