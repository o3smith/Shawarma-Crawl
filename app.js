var express         = require('express'),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    methodOverride  = require("method-override"),
    Restaurant      = require("./models/restaurants"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

//requiring routes
var commentRoutes       = require("./routes/comments"),
    restaurantRoutes    = require ("./routes/restaurants"),
    indexRoutes         = require("./routes/index")

       
mongoose.connect("mongodb://localhost:27017/shawarma_crawl", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Monty is my cute kitty",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("The Shawarma Crawl Server Has Started!")
});