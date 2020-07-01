const   express = require("express"),
        router = express.Router(),
        middleware = require("../middleware"),
        users = require("../models/Users"),
        assignments = require("../models/Assignments"),
        groups = require("../models/Groups"),
        classes = require("../models/Classes");



router.get("/users", middleware.checkForAdminRights, (req,res,next) => {
    users.find().then(users=>{
        res.render("usersAll", {users: users, thisUser: req.user, groups: groups});
    }).catch(err => console.log(err));
});

router.get("/groups/:groupID", middleware.checkForAdminRights, (req,res,next) => {
    groups.find().then(groups => {
        users.find().then(users => {
            classes.find().then(classes => {
                assignments.find().then(assignments => {
                    var currentGroup = groups.filter(group => req.path.includes(group.id))[0];
                    res.render("group", {currentGroup: currentGroup, groups: groups, users: users, thisUser: req.user, classes: classes, assignments: assignments});
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.get("/groups/:groupID/:assignmentID", middleware.checkForAdminRights, (req,res,next) => {
    groups.findById({_id: req.params.groupID}).then(currentGroup => {
        assignments.findById({_id: req.params.assignmentID}).then(currentAssignment => {
            res.render("statusDetails", {currentGroup: currentGroup, assignments: assignments, users: users, thisUser: req.user, currentAssignment: currentAssignment});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.get("/groups/:groupID/:assignmentID/assess", middleware.checkForAdminRights, (req,res,next) => {
    groups.findById({_id: req.params.groupID}).then(currentGroup => {
        assignments.findById({_id: req.params.assignmentID}).then(currentAssignment => {
            assignments.find().then(assignments => {
                groups.find().then(groups => {
                    var assessingAssignment = currentGroup.assignmentAnswers.filter(answer => answer.id === currentAssignment.id)[0];
                    res.render("assignmentCorrection", {declinedAssignment: undefined, thisUser: req.user, groups: groups, assessingAssignment: assessingAssignment, assignments: assignments, classes: classes});
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.get("/declined", middleware.checkForAdminRights, (req,res,next) => {
    groups.find().then(groups => {
        assignments.find().then(assigmnents => {
            classes.find().then(classes => {
                res.render("status", {groups: groups, assignments: assigmnents, thisUser: req.user, classes: classes})
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.get("/declined/:assignmentID/:groupID", middleware.checkForAdminRights, (req,res,next) => {
    
    assignments.find().then(assignments => {
        groups.find().then(groups => {
            classes.find().then(classes => {
                var declinedAssignment;
                req.user.declinedAssignments.forEach(decline => {
                    if(req.params.assignmentID === decline.id && req.params.groupID === decline.groupID){
                        declinedAssignment = decline;
                    }
                })
                res.render("assignmentCorrection", {assessingAssignment: undefined, thisUser: req.user, groups: groups, declinedAssignment: declinedAssignment, assignments: assignments, classes:classes});
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.put("/declined/:assignmentID/:groupID", middleware.checkForAdminRights, middleware.adminAssessment, (req,res,next) => {
    res.redirect(`/users/${req.user.id}`);
});


module.exports = router;