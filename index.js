if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express=require('express');
const app=express();
const path =require('path');
const ejsMate = require('ejs-mate');
const mongoose =require('mongoose');
const methodOverride = require('method-override');

const User=require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const session = require('express-session');
const flash = require('connect-flash');

const usersRoutes = require('./routes/user');
const farmRoutes = require('./routes/farm');
const productRoutes = require('./routes/product');








const dbUrl=process.env.DB_URL; 
// 'mongodb://127.0.0.1:27017/farmStandTake2'
mongoose.connect(dbUrl,{
    // useNewUrlParser: true,
    // // useCreateIndex:true,
    // useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});




app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))


const sessionConfig = {
    secret:'thisismysecret',
    resave: false,

    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()*1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }

}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;  
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//FARM ROUTES.....................................................
app.use('/farms',farmRoutes);

//PRODUCT ROUTES.................................................
app.use('/products',productRoutes);

//USER ROUTES......................................................
app.use('/',usersRoutes);


app.listen(3000,()=>{
    console.log("listining on port 3000!!!");
})