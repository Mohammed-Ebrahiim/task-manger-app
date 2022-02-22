// connect to db
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

// model --> properties
const Cat = mongoose.model('Cat', { name: String });

// data
const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));