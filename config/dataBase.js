require('dotenv').config();
const mongoose = require('mongoose')

const DB = process.env.MONGODB_URI

mongoose.connect(DB)
.then(()=>{
    console.log('connected to the database successfully');
    
})

.catch((error)=>{
    console.log('error connecting to the database: ' + error.message);
    
})