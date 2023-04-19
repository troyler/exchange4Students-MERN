const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User')
const product = require("./models/product")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const imageDownloader = require('image-downloader')

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefrawr4r5r3wqsdfdsfdfsdf'

app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname+'/uploads'));

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",    //what is able to talk to the server
}));


mongoose.connect(process.env.MONGO_URL)



app.get("/test", (req,res) => {
    res.json('test ok');
});

app.post('/register', async (req,res) => {
    const {name, email, password} = req.body;
    try{
    const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({userDoc});
} catch(e) {
    res.status(422).json(e);
}
});


app.post('/listing', async (req,res) => {
    const {title, description, price, condition} = req.body;
    try{
    const userDoc = await product.create({
        title,
        description,
        price,
        condition
    });
    res.json({userDoc});
} catch(e) {
    res.status(422).json(e);
}
});

app.post('/login', async (req,res) => {
    const {email,password} = req.body;
    const userDoc = await User.findOne({email})
    if (userDoc) {
        const passOK = bcrypt.compareSync(password, userDoc.password);
        if (passOK) {
            jwt.sign({
                email: userDoc.email,
                 id: userDoc._id,
                name: userDoc.name
                }, jwtSecret, {}, (err, token) =>{
            if (err) throw err;
            res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json("pass not ok");
        }
    }
    else{
        res.json('not found');
    }
})

app.get("/profile", (req,res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const {name, email, _id} = await User.findById(userData.id)
            res.json(name, email, _id)
        })

    } else {
        res.json(null)
    }
});


app.post("/logout", (req,res) => {
    res.cookie('token','').json(true);
});


app.post("/upload-by-link", async (req,res) => {
    const {link} = req.body
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads',
    });
    res.json(newName)
})


app.listen(4000);