const   express = require("express"),
        router = express.Router(),
        middleware = require("../middleware"),
        users = require("../models/Users"),
        assignments = require("../models/Assignments"),
        groups = require("../models/Groups"),
        classes = require("../models/Classes"),
        mongoose = require("mongoose");





router.get("/", middleware.checkForAdminRights, (req,res,next) => {
    classes.find().then(classes => {
        users.find().then(users => {
            groups.find().then(groups => {
                res.render("classes", {classes: classes, users: users, thisUser: req.user, groups: groups});
            }).catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => {console.log(err)});
});


router.get("/create", middleware.checkForAdminRights, (req,res,next) => {
    res.render("createClass", {thisUser: req.user});
});

router.post("/create", middleware.checkForAdminRights, middleware.createClass, (req,res,next) => {
    res.redirect("/classes");
});

router.get("/:classID", middleware.checkForAdminRights, (req,res,next) => {
    classes.findById({_id: req.params.classID}).then(currentClass => {
        users.find().then(users => {
            groups.find().then(groups => {
                res.render("classDetails", {currentClass: currentClass, users: users, thisUser: req.user, groups: groups});
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.get("/:classID/edit", middleware.checkForAdminRights, (req,res,next) => {
    classes.findById({_id: req.params.classID}).then(currentClass => {
        users.find().then(users => {
            groups.find().then(groups => {
                res.render("classUpdate", {currentClass: currentClass, users: users, thisUser: req.user, groups: groups});
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.put("/:classID", middleware.checkForAdminRights, middleware.updateClass, (req,res,next) => {
    res.redirect("/classes");
});

router.delete("/:classID", middleware.checkForAdminRights, middleware.deleteClass, (req,res,next) => {
    res.redirect("/classes");
})

router.get("/:classID/groups/create", middleware.checkForAdminRights, (req,res,next) => {
    var currentClass = classes.filter(thisClass => req.path.includes(thisClass.id))[0];
    res.render("createGroup", {groups: groups, users: users, thisUser: req.user, classes: classes, currentClass: currentClass});
});


router.get("/:classID/groups", middleware.checkForAdminRights, (req,res,next) => {
    classes.findById({_id: req.params.classID}).then(currentClass => {
        groups.find().then(groups => {
            users.find().then(users => {
                res.render("groups", {groups: groups, users: users, thisUser: req.user, currentClass: currentClass});
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});


module.exports = router;