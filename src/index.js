const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/route')


const app  = express();
app.use(express.json())

const url="mongodb+srv://jai84322:Bing%401234%23@demo.3li78.mongodb.net/group49Database?retryWrites=true&w=majority";
mongoose.connect(url,{useNewUrlParser: true})
.then(()=>console.log("MongoDb is Connected"))
.catch(err=>console.log(err))

app.use('/',router);

app.listen(process.env.PORT || 3000, function (){
    console.log('Server Started: '+3000)
})