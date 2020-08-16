var express = require("express"),
    bodyParser = require("body-parser"),
    router     = express.Router(),
    mongoose    = require("mongoose"),
    methodOverride  = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    PartyWall = require("../models/partywall"),
    User      = require("../models/user")

// Auth Routes

// Register Page
router.get("/register", function(req, res){
    res.render("register");
});

// Register Logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/partywall")
            });
        }
    });
})

// Login Page
router.get("/login", function(req, res){
    res.render("login");
});

// Login Logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/partywall",
        failureRedirect: "/login"
    }), function(req, res){

});

// Logout logic
router.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/partywall")
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

// middleware to check ownership of the post
function checkOrderOwnership(req, res, next){
    if(req.isAuthenticated()){
        PartyWall.findById(req.params.id, function(err, foundOrder){
            if(err){
                res.redirect("back");
            } else{
                // Does user own the order?
                if(foundOrder.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.redirect("back");
                }
            }
        });
    } else{
        res.redirect("back");
    }
}

module.exports = router;