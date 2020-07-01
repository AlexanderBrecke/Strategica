const   express = require("express"),
        router = express.Router(),
        middleware = require("../middleware"),
        uuid = require("uuid"),
        User = require("../models/Users"),
        classes = require("../models/Classes"),
        passport = require("passport");

//Root route
router.get("/",(req,res) => {
    res.render("landing");
    //console.log(req.session);
});
router.get("/register", (req,res) => {
    classes.find().then(allClasses => {
        res.render("register", {classes: allClasses});
    })
    .catch(err => {console.log(err)});
});

//CREATE NEW USER AND LOG THEM IN!
router.post("/register", middleware.createUser, (req,res,next) => {
})

router.get("/login", (req,res) => {
    res.render("login");
});
router.post("/login", (req,res,next) => {
    if(req.isAuthenticated()) {
        console.log("Please log out before trying to log in with a new user");
        res.redirect(`/users/${req.user.id}`);
    } else {
        passport.authenticate("local", (err,user,info) => {
            if(info){return res.send(info.message);}
            if(err){return next(err);}
            if(!user){return res.redirect("/login");}
            req.login(user, (err) => {
                if(err){return next(err);}
                res.redirect(`/users/${user.id}`);
            })
        })(req,res,next);
    }
});
router.get("/logout", (req,res) => {
    req.logOut();
    res.redirect("/");
});


module.exports = router;