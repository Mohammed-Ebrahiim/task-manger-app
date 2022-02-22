const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const News = require('./news')

const authorScehma = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true 
    },
    email:{
        type:String,
        unique:true, 
        required:true,
        trim:true,
        lowercase:true, 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value<0){
                throw new Error('Age must be postive number')
                
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true, 
        minLength:6,
        validate(value){
            let reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!reg.test(value)){
                throw new Error('Password must include uppercase, lowercase,special characer & number')
            }
        }
    },
    mobile:{
        type:Number,
        required:true,
        validate(value){
            let phoneRegex = new RegExp("^01[0-2,5]{1}[0-9]{8}$")
            if (!phoneRegex.test(value)) {
                throw new Error('Invalid Number, plz input Egyption Number')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ]
})


///////////////////////////////////////////////////////////////////////

// middelware
authorScehma.pre('save',async function(){
    const author = this
    if(author.isModified('password'))
{    author.password = await bcrypt.hash(author.password,8)}
})

///////////////////////////////////////////////////////////////////////////////
// login

authorScehma.statics.findByCredentials = async (email,password) =>{
    const author = await Author.findOne({email})
    // console.log(user)
    if(!author){
        throw new Error('Unable to login..check email or password')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    
    if(!isMatch){
        throw new Error('Unable to login..check email or password')
    }
    return author

}

///////////////////////////////////////////////////////////////////////////
authorScehma.methods.generateToken = async function() {
    const author = this
    const token = jwt.sign({_id:author._id.toString()},'node-course')

    author.tokens = author.tokens.concat(token)
    await author.save()
    
    return token
}

//Virtual relation 
authorScehma.virtual("news",{
    ref:'News',
    localField:'_id',
    foreignField: 'Owner'
})

const Author = mongoose.model('Author',authorScehma)
module.exports = Author

