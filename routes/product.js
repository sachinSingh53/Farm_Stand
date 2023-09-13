const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');

const Product = require('../models/product');

router.get('/',async(req,res)=>{
    const products=await Product.find({})
    
    res.render('products/index',{products})
     
 })

router.get('/new',(req,res)=>{
    res.render('products/new');
})
 
router.post('/',async(req,res)=>{
    const newProduct =  new Product(req.body);
    await newProduct.save();
    // console.log(newProduct);
    req.flash('success','Product added successfully');
    res.redirect(`/products/${newProduct._id}`);
})
 
 
router.get('/:id',async (req,res)=>{
    const {id} = req.params;
    const product = await Product.findById(id).populate('farm','name');
    // console.log(product);

    res.render('products/show',{product});
})
 
router.get('/:id/edit',async(req,res)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit',{product}); 
})
 
router.put('/:id',isLoggedIn, async(req,res)=>{
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body,{ runValidators: true ,new:true})
    req.flash('success','Product edited Successfully');
    res.redirect(`/products/${product._id}`)
})
 
router.delete('/:id',isLoggedIn, async (req,res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    req.flash('success','Product deleted Successfully');
    res.redirect('/farms');
})
 
module.exports=router;