const   express = require("express"),
        router = express.Router(),
        middleware = require("../middleware"),
        users = require("../models/Users"),
        groups = require("../models/Groups"),
        classes = require("../models/Classes");


router.get("/:userID", middleware.checkUserOwnership, middleware.checkForRequests, (req,res, next) => {
    classes.find().then(classes => {
        groups.find().then(groups => {
            users.find().then(users => {
                res.render("users", {classes: classes, thisUser: req.user, users: users, groups: groups});
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => {console.log(err)});
});

router.get("/:userID/update", middleware.checkUserOwnership,  (req,res) => {
    users.findById({ _id: req.params.userID}).then(userToUpdate => {
        groups.find().then(groups => {
            res.render("usersUpdate", {thisUser: req.user, users: users, userToUpdate: userToUpdate, groups: groups});
        }).catch(err => console.log(err));
    }).catch(err => {console.log(err)});
});

router.put("/:userID", middleware.updateUser, (req,res) => {
    res.redirect(`/users/${req.user.id}`);
});

router.delete("/:userID", middleware.checkForAdminRights, (req,res) => {

    users.findByIdAndRemove({_id: req.params.userID}).remove().exec();
});

module.exports = router;