//Requiremets
const   users = require("../models/Users"),
        groups = require("../models/Groups"),
        functionMiddleware = require("./functions"),
        groupMiddleware = require("./group"),
        uuid = require("uuid"),
        classes = require("../models/Classes"),
        mongoose = require("mongoose");

const userMiddleware = {};

userMiddleware.isEmpty = functionMiddleware.isEmpty;
userMiddleware.declineGroup = groupMiddleware.declineGroup;

//---------------------------------------------------------------------USER STUFF-----------------------------------------------------------------------------

//Check if user is allowed to do this?
userMiddleware.checkUserOwnership = (req,res,next) => {
    //console.log(req.user);
    if(req.isAuthenticated()){
        // console.log(req.params.userID);

        //console.log(req.params);
        users.findById({_id: req.params.userID})
            .then(user => {
                // console.log(user);
                if(user){
                    // console.log(user);
                    return next();
                } else {
                    if(req.user.isAdmin){
                        return next();
                    }
                    console.log("could not find that user");
                    res.redirect("back");
                } 
            })


    } else {
        console.log("You need to be logged in for that");
        res.redirect("back");
    }
}

//Check what user is trying to access
userMiddleware.checkUserRequest = (req,res,next) => {
    if(req.isAuthenticated) {
        var thisUser = req.user[0];
    }
    return next();
}

//Check if the user is in the group
userMiddleware.checkIfUserIsInGroup = (req,res,next) => {
    if(req.isAuthenticated()) {
        // console.log(req.params);

        groups.findById({_id: req.params.groupID}).then(foundGroup => {
            if(!foundGroup){
                console.log("Group not found!");
                res.redirect("back");
            } else {
                if(req.user.groupID === req.params.groupID){
                    next();
                } else {
                    console.log("You don't belong to this group");
                    res.redirect(`/users/${req.user[0].id}`);
                }
            }
        }).catch(err => console.log(err));

        //console.log(found);
    } else {
        console.log("You need to be logged in for that");
        res.redirect("back");
    }
}

//UPDATE the user
userMiddleware.updateUser = (req,res,next) => {
    const updateInfo = req.body;
    // console.log(updateInfo);

    //Check that the user ID does not contain any blank spaces or undefined characters.
    var checkUserID = Object.values(req.params.userID);
    var indexToRemoveFrom;
    var userID;
    for(var i = 0; i < checkUserID.length; i++){
        if(checkUserID[i] === " " || checkUserID[i] === undefined){
            indexToRemoveFrom = i;
        }
    }
    if(indexToRemoveFrom !== undefined){
        if(indexToRemoveFrom === 0){
            checkUserID.shift();
        } else {
            checkUserID.splice(indexToRemoveFrom,1)
        }
        checkUserID.forEach(char => {
            // console.log(char);
            if(userID === undefined){
                userID = char;
            } else {
                userID += char;
            }
        })
    } else {
        checkUserID.forEach(char => {
            if(userID === undefined){
                userID = char;
            } else {
                userID += char;
            }
        })
    }
    // console.log(userID);
    
    
    //Find the user with the id and update them.
    users.findById({_id: userID}).then(userToUpdate => {
        //console.log(userToUpdate);

        if(req.user.isAdmin){
            if(req.user._id !== userToUpdate.id){
                console.log("trying to update another user");
                if(!userMiddleware.isEmpty(updateInfo.newEmail)){
                    userToUpdate.email = updateInfo.newEmail;
                    console.log("Updating " + userToUpdate.firstName + " " + userToUpdate.lastName + "'s email");
                } else if(userMiddleware.isEmpty(updateInfo.newEmail)){
                    userToUpdate.email = userToUpdate.email;
                }
                if(!userMiddleware.isEmpty(updateInfo.newPassword)){
                    userToUpdate.password = updateInfo.newPassword;
                    console.log("Updating " + userToUpdate.firstName + " " + userToUpdate.lastName + "'s password");
                } else if(userMiddleware.isEmpty(updateInfo.newPassword)){
                    userToUpdate.password = userToUpdate.password;
                }
                if(req.body.group !== userToUpdate.groupID){
                    groups.findById({_id: userToUpdate.groupID}).then(groupToMigrateFrom => {
                        groups.findById({_id: req.body.group}).then(groupToMigrateTo => {
                            var index;
                            for(var i = 0; i < groupToMigrateFrom.memberIDs.length; i++){
                                // console.log(groupToMigrateFrom.memberIDs[i]);
                                if(groupToMigrateFrom.memberIDs[i].id === userToUpdate.id){
                                    index = i;
                                }
                            }
                            if(index === 0){
                                groupToMigrateFrom.memberIDs.shift();
                            } else if(index !== 0 && index !== undefined) {
                                groupToMigrateFrom.memberIDs.splice(index, 1);
                            }

                            groupToMigrateTo.memberIDs.push(userToUpdate.id);
                            // console.log(groupToMigrateFrom.memberIDs);
                            // console.log(groupToMigrateTo.memberIDs);
                            groupToMigrateFrom.save();
                            groupToMigrateTo.save();

                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                    userToUpdate.groupID = req.body.group;
                }
                //console.log(userToUpdate);
            } else {
                console.log("trying to update this user");
                if(updateInfo.email === userToUpdate.email && !userMiddleware.isEmpty(updateInfo.newEmail)){
                    userToUpdate.email = updateInfo.newEmail;
                } else if(updateInfo.email !== userToUpdate.email && !userMiddleware.isEmpty(updateInfo.newEmail)){
                    console.log("You have typed the wrong email");
                    return res.redirect("back");
                }
                if(updateInfo.password === userToUpdate.password && !userMiddleware.isEmpty(updateInfo.newPassword)){
                    userToUpdate.password = updateInfo.password;
                } else if(updateInfo.password !== userToUpdate.password && !userMiddleware.isEmpty(updateInfo.newPassword)){
                    console.log("You have typed the wrong password");
                    return res.redirect("back");
                }
                //console.log(userToUpdate);
            }
        } else {
            if(updateInfo.email === userToUpdate.email && !userMiddleware.isEmpty(updateInfo.newEmail)){
                userToUpdate.email = updateInfo.newEmail;
            } else if(updateInfo.email !== userToUpdate.email && !userMiddleware.isEmpty(updateInfo.newEmail)){
                console.log("You have typed the wrong email");
                return res.redirect("back");
            }
            if(updateInfo.password === userToUpdate.password && !userMiddleware.isEmpty(updateInfo.newPassword)){
                userToUpdate.password = updateInfo.password;
            } else if(updateInfo.password !== userToUpdate.password && !userMiddleware.isEmpty(updateInfo.newPassword)){
                console.log("You have typed the wrong password");
                return res.redirect("back");
            }

            if(updateInfo.join){
                userToUpdate.groupID = updateInfo.join;
                userToUpdate.requests = [];
                
                if(userToUpdate.avatarsToChoose.length !== 0){
                    classes.findById({_id: userToUpdate.classID}).then(currentClass => {
                        // console.log(userToUpdate.avatarsToChoose);
                        for(var i = 0; i < currentClass.avatarsNotAvailable.length; i++){
                            var indexToRemoveFrom = undefined;
                            userToUpdate.avatarsToChoose.forEach(avatar => {
                                if(avatar.name === currentClass.avatarsNotAvailable[i].name){
                                    // console.log(avatar);
                                    // console.log(i);
                                    indexToRemoveFrom = i;
                                }
                            })
                            if(indexToRemoveFrom === 0){
                                currentClass.avatarsNotAvailable.shift();
                                i--;
                            } else if(indexToRemoveFrom !== 0 && indexToRemoveFrom !== undefined){
                                currentClass.avatarsNotAvailable.splice(indexToRemoveFrom,1);
                                i--;
                            }
                        }
                        // console.log(currentClass);
                        currentClass.save();
                    }).catch(err => console.log(err));
                }
            }
            if(updateInfo.decline){
                var index;
                for(var i = 0; i < userToUpdate.requests.length; i++){
                    if(userToUpdate.requests[i].id === updateInfo.decline){
                        index = i;
                    }
                }
                if(index === 0){
                    userToUpdate.requests.shift();
                } else {
                    userToUpdate.requests.splice(index, 1);
                }
                groups.findById({_id: updateInfo.decline}).then(groupToRemoveFrom => {
                    var index;
                    for(var i = 0; i < groupToRemoveFrom.memberIDs.length; i++){
                        if(groupToRemoveFrom.memberIDs[i].id === userToUpdate.id){
                            index = i;
                        }
                    }
                    if(index === 0){
                        groupToRemoveFrom.memberIDs.shift();
                    } else {
                        groupToRemoveFrom.memberIDs.splice(index,1);
                    }
                    // console.log(groupToRemoveFrom);
                    groupToRemoveFrom.save();
                }).catch(err => console.log(err));
            }
            // console.log(userToUpdate);
        }
        userToUpdate.save();
        return next();
        
    }).catch(err => console.log(err));
}



userMiddleware.createUser = (req,res,next) =>{

    const newUser = new users({
        _id: uuid.v4(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        classID: req.body.class
    })
    if(!req.body.classPass){
        console.log("Please fill in class password");
        res.redirect("/register");
    }else {
        classes.findById({ _id: newUser.classID })
            .then(currentClass => {
                if(currentClass && currentClass.password === req.body.classPass){
                    if(!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password || !newUser.classID){
                        console.log("Please fill out all the fields");
                        res.redirect("/register");
                    } else {
                        currentClass.students.push(newUser._id);
                        currentClass.save();
                        newUser.save()
                            .then(user => {
                                req.logIn(newUser, (err) => {
                                    if(err){return next(err);}
                                    res.redirect(`/users/${newUser.id}`)
                                })
                            })
                            .catch(err => console.log(err));
                    }
                }
            })
    }
}



userMiddleware.deleteUsersWithClass = (userToDelete) => {

    users.findByIdAndDelete({_id: userToDelete.id}, (err) => console.log(err));
}

//-------------------------------------------------------------------------------------------------

module.exports = userMiddleware;