const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require("./models/Product");
const Purchase = require("./models/PurchaseOrder");
const Cart = require("./models/Cart");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');

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


app.post('/purchases', async (req,res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: 'exchange4students.auto@gmail.com', 
          pass: 'yaczjcbyjnesahdu', 
        },
      });
    const {data, totalPrice, firstName, lastName} = req.body;
    const itemList = [];
        for (let j = 0; j < data.length; j++) {
            userDoc = await User.findById(data[j].owner);
            itemList.push({
                product: data[j]._id,
                quantity: 1,
                sellerEmail: userDoc.email})
        }
    const{token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        try{
            const purchaseDoc = await Purchase.create({
                owner : userData.id,
                items: itemList,
                totalPrice: totalPrice,
                firstName: firstName,
                lastName: lastName,
                buyerEmail: userData.email,

                
            });
            
            await transporter.sendMail({
                from: '"Exchange 4 Students" <exchange4students.auto@gmail.com>', 
                to: userData.email,
                subject: "Order Confirmation", 
                html: "<b>Your order has been successfully placed!</b>", 
            });

            res.json(purchaseDoc);

        } catch(e) {
            res.status(422).json(e);
        }
    })

    for (let j = 0; j < itemList.length; j++) {    
            await transporter.sendMail({
            from: '"Exchange 4 Students" <exchange4students.auto@gmail.com>', 
            to: itemList[j].sellerEmail, 
            subject: "Order Confirmation", 
            html: "<b>Your item has sold!</b>", 
          });
    }

});

app.post('/carts', async (req,res) => {
    const {quantity} = 1;
    const {data} = req.body;
    const{token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        try{
            const cartDoc = await Cart.create({
                owner : userData.id,
                items: [{product: data, quantity: 1}],
                totalPrice: 1,
            });
            res.json(cartDoc);
        } catch(e) {
            res.status(422).json(e);
        }
    })
});

app.get('/carts', (req,res) => {
    const {token} = req.cookies;
    const cartItems = [];
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {id} = userData;
        const userCart = await Cart.find({owner:id})
        if (!userCart || userCart[0]=== undefined) {
            return res.status(404).json({ msg: 'Cart not found' });
        }
        else {
        const products = userCart[0].items;
        let i = 0;
        while (i < products.length) {
            const product = await Product.findById(products[i].product);
            cartItems.push(product)
            i++;
        }
        res.json(cartItems);
        }
        
    })
})

app.put('/carts', async (req,res) => {
    const {token} = req.cookies;
    const {data} = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const userCart = await Cart.find({owner: userData.id});
        const currentListing = await Product.findById(data)

        if (userData.id === currentListing.owner.toString()){
            res.json("Cannot add own item");
            return;
        }

        const products = userCart[0].items;
        let i = 0;
        while (i < products.length) {
            const product = await Product.findById(products[i].product);
            if (data === product._id.toString()){
                res.json("item already in cart");
                return;
            }
            i++;
        }
    
        const cartDoc = await Cart.findOneAndUpdate({owner: userData.id}, {
            "$push": { "items": {product: data, quantity:1}} 
        });
        if (userData.id === cartDoc.owner.toString()) {
            cartDoc.update();
            res.json('Added to Cart')
        }
    });
});

app.patch('/carts', async (req,res) => {
    const {token} = req.cookies;
    const {data} = req.body
    cartItems = [];
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        Cart.update( 
            {owner: userData.id}, 
            { $pull: {"items":  {product: data, quantity: 1}}} 
            ).then(async () => {
               const userCart = await Cart.find({owner: userData.id});
               const products = userCart[0].items;
                let i = 0;
                while (i < products.length) {
                    const product = await Product.findById(products[i].product);
                    cartItems.push(product)
                    i++;
                }
                res.json(cartItems);
            })
       
        })
});

app.delete('/carts', async (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const cartDoc = await Cart.find({owner: userData.id});
        const removal = await Cart.findByIdAndDelete(cartDoc[0]._id);
        res.json(removal);
    });
});

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


app.post('/listings', async (req,res) => {
    const {title, description, price, condition, category, addedPhotos} = req.body;

    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        try{
            const productDoc = await Product.create({
                owner : userData.id,
                title,
                description,
                price,
                condition,
                category,
                sold: false,
                addedPhotos,
            });
            res.json(productDoc);
        } catch(e) {
            res.status(422).json(e);
        }
    })
});

app.get('/user-listings', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData;
        res.json(await Product.find({owner:id}))
    })
})

app.delete('/user-listings', async (req,res) => {
    const {token} = req.cookies;
    const {listing} = req.body;
    await Product.findByIdAndDelete(listing._id);
    const userCarts = await Cart.find();
    
    let i = 0;
    while (i < userCarts.length) {
        currentCart = userCarts[i];
        cartItemList = userCarts[i].items;
        for (let j = 0; j < cartItemList.length; j++) {
            if (cartItemList[j].product.toString() === listing._id){
                const cartDoc = await Cart.findOneAndUpdate({owner: currentCart.owner}, {
                    "$pull": { "items": {product: listing._id, quantity:1}} 
                });
            }
        }
    i++;
    }
});



app.get('/listings', async (req,res) => {
    res.json(await Product.find({sold:false}));
});

app.get('/listings/:id', async (req,res) => {
    const {id} = req.params;
    res.json(await Product.findById(id));
});

app.patch("/listings", async (req,res) => {
    const {data} = req.body;
    const itemList = [];
    for (let j = 0; j < data.length; j++) {
        const productDoc = await Product.findByIdAndUpdate(data[j]._id, {
            "$set": { sold : true} 
        });
        console.log(productDoc);
    }
    res.json("ok")

})


app.put('/listings', async (req,res) => {
    const {
        id,
        title,
        description,
        price,
        condition,
        category,
        sold,
        addedPhotos,
    } = req.body;
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const productDoc = await Product.findById(id);
        if (userData.id === productDoc.owner.toString()) {
            productDoc.set({id,
                title,
                description,
                price,
                condition,
                category,
                sold,
                addedPhotos,});
            await productDoc.save()
            res.json('ok')

        }
    });
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
            const {name, email, _id} = await User.findById(userData.id);
            res.json({name, email, _id});
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
        dest: __dirname + `/uploads/${newName}`,
    });
    res.json(newName)
})

const photosMiddleware = multer({dest:'uploads/'});

app.post('/upload', photosMiddleware.array('photos', 100), async (req,res) => {
    const uploadedFiles = [];
    for (let i =0; i < req.files.length; i++){
        const {path, originalname} = req.files[i];
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        await fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''));
    }
   res.json(uploadedFiles);
});


app.post('/purchases')


app.listen(4000);