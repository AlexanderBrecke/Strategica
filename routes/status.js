const   express = require("express"),
        router = express.Router(),
        middleware = require("../middleware/index"),
        groups = require("../models/Groups"),
        users = require("../models/Users"),
        assignments = require("../models/Assignments"),
        classes = require("../models/Classes");

router.get("/:groupID", (req,res,next) => {
    groups.find().then(groups => {
        assignments.find().then(assignments => {
            res.render("status", {groups: groups, assignments: assignments, thisUser: req.user})
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})

router.get("/:groupID/details/:assignmentID", (req,res,next) => {
    assignments.findById({_id: req.params.assignmentID}).then(assignmentToShow => {
        groups.find().then(groups => {
            classes.find().then(classes => {
                res.render("statusDetails", {groups: groups, assignment: assignmentToShow, thisUser: req.user, classes: classes})
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
           
})

router.put("/:groupID/details/:assignmentID", middleware.answerCorrection, (req,res,next) => {
    res.redirect(`/status/${req.user.groupID}`);
})


module.exports = router;