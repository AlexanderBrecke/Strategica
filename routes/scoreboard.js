const   express = require("express"),
        router = express.Router(),
        middleware = require("../middleware/index"),
        groups = require("../models/Groups"),
        users = require("../models/Users"),
        assignments = require("../models/Assignments"),
        classes = require("../models/Classes");


router.get("/:classID", (req,res,next) => {
    groups.find().then(groups => {
        assignments.find().then(assignments => {
            classes.findById({_id: req.params.classID}).then(currentClass => {
                res.render("scoreboard", {groups: groups, currentClass: currentClass, thisUser: req.user, assignments: assignments})
            })
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.get("/details/:groupID", (req,res,next) => {
    groups.findById({_id: req.params.groupID}).then(currentGroup => {
        assignments.find().then(assignments => {
            res.render("scoreboardDetails", {currentGroup: currentGroup, assignments: assignments});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})



module.exports = router;