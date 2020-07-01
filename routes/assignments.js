const   express = require("express"),
        router = express.Router(),
        middleware = require("../middleware"),
        assignments = require("../models/Assignments"),
        groups = require("../models/Groups"),
        classes = require("../models/Classes")
        mongoose = require("mongoose");



router.get("/", middleware.isLoggedIn, (req,res,next) => {
    assignments.find().then(assignments => {
        classes.find().then(classes => {
            groups.find().then(groups => {
                res.render("assignments", {classes: classes, assignments: assignments, thisUser: req.user, groups: groups});
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    })
    .catch(err => {
        console.log(err);
        console.log("Could not find assignments");
        res.redirect("back")
    })
});

router.post("/", middleware.publishOrFinishAssignment, (req,res,next) => {
    res.redirect("/assignments");
});

router.get("/create", (req,res) => {
    res.render("createAssignment");
});

router.post("/create", middleware.createAssignment, (req,res,next) => {
    res.redirect("/assignments");
});

router.get("/:assignmentID", (req,res,next) => {
    assignments.findById({_id: req.params.assignmentID}).then(assignment => {
        groups.find().then(groups => {
            res.render("assignment", {assignment: assignment, thisUser: req.user, groups: groups});

        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.get("/:assignmentID/edit", (req,res) => {
    assignments.findById({_id: req.params.assignmentID})
        .then(assignment => {
            res.render("editAssignment", {assignment: assignment});
        })
        .catch(err => {console.log(err)});
});

router.put("/:assignmentID", middleware.checkForAdminRights, middleware.editAssignment, (req,res,next) => {
    res.redirect("/assignments");
});

router.delete("/:assignmentID", middleware.checkForAdminRights, middleware.deleteAssignment, (req,res) => {
    res.redirect("/assignments");
});

router.post("/:assignmentID/answer", middleware.answerAssignment, (req,res,next) => {
    res.redirect("/assignments");
});

router.put("/:assignmentID/answer/edit", middleware.editAssignmentAnswer, (req,res,next) => {
    res.redirect("/assignments");
});





module.exports = router;