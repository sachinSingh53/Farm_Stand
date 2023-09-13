const mongoose =require('mongoose');

const Product =require('./models/product');


mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
.then(()=>{
    console.log("Connection Open!!");
})
.catch(err=>{
    console.log("Error!!!");
    console.log(err);
})

// const p= new Product({
//     name:'Ruby Grapefruit',
//     price:50,
//     category:'fruit'
// })

// p.save()
// .then(p=>{
//     console.log(p)
// })
// .catch(e=>{
//     console.log(e)
// })

const seedProducts = [
    {
        name:'Potato',
        price:20,
        category:'vegetable'
    },
    {
        name:'Apple',
        price:80,
        category:'fruit'
    },
    {
        name:'Mango',
        price:60,
        category:'fruit'
    },
    {
        name:'Tomato',
        price:20,
        category:'vegetable'
    },
    {
        name:'Lassi',
        price:20,
        category:'dairy'
    }
    
]
Product.insertMany(seedProducts)
.then(res=>{
    console.log(res);
})
.catch(err=>{
    console.log(err);
})