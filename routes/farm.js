const express=require('express');
const router = express.Router();
const Farm = require('../models/farm');
const Product = require('../models/product');
const {isLoggedIn} = require('../middleware');

router.get('/',async(req,res)=>{
    const farms = await Farm.find({});
    res.render('farms/index',{farms});
})

router.get('/new',isLoggedIn,(req,res)=>{

    res.render('farms/new')
})
router.get('/:id',async(req,res)=>{
    const {id} = req.params;
    const farm = await Farm.findById(id).populate('products');
    

    res.render('farms/show',{farm});
})

router.post('/',isLoggedIn,async(req,res)=>{
    const farm=new Farm(req.body);
    farm.author = req.user._id;

    await farm.save();
    req.flash('success','Successfully made a new Farm');
    res.redirect('/farms');
})

router.get('/:id/products/new',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    const farm =await Farm.findById(id); 
    res.render('products/new',{id,farm});
})

router.post('/:id/products',isLoggedIn,async(req,res)=>{
    const {id}=req.params;
    const farm = await Farm.findById(id);
    

    const {name,price,category}=req.body;
    const product=new Product({name,price,category});

    farm.products.push(product);
    product.farm=farm;

    
    await farm.save();
    await product.save();
    
    res.redirect(`/farms/${id}`);
    
})

router.get('/:id/edit',isLoggedIn,async(req,res)=>{
    const farm = await Farm.findById(req.params.id);
    res.render('farms/edit',{farm});
})

router.put('/:id',isLoggedIn, async(req,res)=>{
    const { id } = req.params;
   const farm = await Farm.findByIdAndUpdate(id, req.body,{ runValidators: true ,new:true})
   req.flash('success','Successfully updated the farm');
    res.redirect(`/farms/${farm._id}`)
})

router.delete('/:id',isLoggedIn,async(req,res)=>{
    const farm = await Farm.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully deleted the Farm');
    
    res.redirect('/farms');
})


module.exports = router;
