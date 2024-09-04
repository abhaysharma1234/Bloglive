const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/data');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = 'asdsds43rgrdg3e43fsf455df3';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect("mongodb+srv://abhaysharma:abhay@cluster0.bfxaa.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0" ).then(()=>{
    console.log("yes connected");
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try{
        const userDoc = await User.create({username, password:bcrypt.hashSync(password,salt),});
        res.json(userDoc);
    }catch(e){
       res.status(400).json(e); 
    } 
});

app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if (err) throw err;
        res.json(info);
    });
    
    res.json(req.cookies);
});


app.post('/logout',(req,res)=>{
    res.cookie('token', '').json('ok');
});


app.post('/login', async (req,res) =>{
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        //logged in
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) =>{
            if(err) throw err;
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            });
        });

    }else{
        res.status(400).json('wrong credentials');
    }
})


app.get('/check',(req,res)=>{
    res.send("hello");
})

app.listen(4000);