const   express = require("express"),
        router = express.Router(),
        middleware = require("../middleware"),
        users = require("../models/Users"),
        groups = require("../models/Groups"),
        avatars = require("../models/Avatars"),
        assignments = require("../models/Assignments"),
        classes = require("../models/Classes");


router.get("/create", middleware.isLoggedIn, middleware.giveAvatarsToChooseFrom, (req,res,next) =>{
    users.find().then(users => {
        classes.findById({_id: req.user.classID}).then(currentClass => {
            res.render("createGroup", {link: `/users/${req.user.id}`, thisUser: req.user, currentClass:currentClass, users: users, avatars:req.user.avatarsToChoose});
        }).catch(err=>console.log(err));
    }).catch(err => console.log(err));
});

router.post("/create", middleware.createGroup, (req,res,next) => {
    // console.log(req.user);
    setTimeout(function sometime(){
        res.redirect(`/users/${req.user.id}`);
    },250)
    // res.redirect(`/groups/${req.user.groupID}`);
    // res.redirect("gr");
})

router.get("/:groupID", middleware.checkIfUserIsInGroup, (req,res) => {
    groups.find().then(groups => {
        classes.find().then(classes => {
            users.find().then(users => {
                res.render("groups", {avatars: avatars, groups: groups, users: users, thisUser: req.user, link: `/users/${req.user.id}`, classes:classes});
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.get("/:groupID/update", middleware.checkIfUserIsInGroup, (req,res,next) => {
    users.find().then(users => {
        groups.findById({_id: req.user.groupID}).then(currentGroup => {
            // console.log(currentGroup)
            res.render("groupUpdate", {avatars: avatars,users:users,thisUser:req.user,group: currentGroup});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
    //console.log(req.params.id);
})

router.put("/:groupID", middleware.updateGroup, (req,res,next) => {
    res.redirect(`/groups/${req.user.groupID}`);
});

router.get("/:groupID/correction", middleware.giveAssignmentToCorrect, (req,res,next) => {
    groups.find().then(groups => {
        assignments.find().then(assigmnents => {
            res.render("assignmentCorrection", {groups: groups, thisUser: req.user, assignments: assigmnents});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.post("/:groupID/correction", middleware.correctAssignment, (req,res,next) => {
    res.redirect(`/groups/${req.user.groupID}`);
});


module.exports = router;