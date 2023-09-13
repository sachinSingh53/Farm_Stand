const express=require('express');
const router = express.Router();
const User = require('../models/user');

const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('users/register');
})
router.post('/register',(async(req,res,next)=>{
    try{
    const {username,email,password} = req.body;
    const user = new User({email,username});

    const registeredUser = await User.register(user,password);
    
    req.login(registeredUser,err=>{
        if(err) return next(err);
        req.flash('success','Welcome to yelp-camp!');
        res.redirect('/farms');
    })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register'); 
    }
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login',passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),(req,res)=>{
    req.flash('success','Welcome Back');
    // const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect('/farms');
   
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
});
module.exports = router;