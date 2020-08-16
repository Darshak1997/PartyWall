var express = require("express"),
    bodyParser = require("body-parser"),
    app     = express(),
    mongoose    = require("mongoose"),
    methodOverride  = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    PartyWall = require("./models/partywall"),
    User      = require("./models/user")


// Routes 
var partywallRoutes = require("./routes/partywall"),
    indexRoutes    = require("./routes/index");

// Connect Mongoose
mongoose.connect("mongodb://localhost/partywall", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Passport Configuration
app.use(require("express-session")({
    secret: "Food",
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
    next();
});

app.use(partywallRoutes);
app.use(indexRoutes);

// Listening on port 3000
app.listen("3000", function(){
    console.log("Application Started....")
});