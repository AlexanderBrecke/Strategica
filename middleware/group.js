//Requiremets
const   users = require("../models/Users"),
        groups = require("../models/Groups"),
        classes = require("../models/Classes"),
        uuid = require("uuid"),
        avatars = require("../models/Avatars");

const groupMiddleware = {};

//---------------------------------------------------------------------GROUP STUFF-----------------------------------------------------------------------------

//Give avatars to choose from
groupMiddleware.giveAvatarsToChooseFrom = (req,res,next) => {
    classes.findById({_id: req.user.classID}).then(currentClass => {
        users.findById({_id: req.user.id}).then(currentUser =>{
            if(currentUser.avatarsToChoose.length === 0){
                var avatarsToChoose = [];
                if(avatarsToChoose.length < 3){
                    for(var i = 0; i < 3;){
                        var min = 0;
                        var max = avatars.length;
                        var rand = Math.floor(Math.random() * (+ min +max));
                        var notAvailable = false;
                        
                        if(currentClass.avatarsNotAvailable.some(notAvailable => notAvailable.name === avatars[rand].name)){
                            notAvailable = true;
                            // console.log(avatars[rand].name + " not available");
                        }
                        if(avatarsToChoose.some(choosing => choosing.name === avatars[rand].name)){
                            notAvailable = true;
                            // console.log(avatars[rand].name + " already in list");
                        }
                        if(!notAvailable){
                            // console.log(notAvailable)
                            avatarsToChoose.push(avatars[rand]);
                            currentClass.avatarsNotAvailable.push({name: avatars[rand].name});
                            i++;
                        }
                    }
                    avatarsToChoose.forEach(avatar => {
                        currentUser.avatarsToChoose.push(avatar);
                    });
                    // console.log(currentClass.avatarsNotAvailable);
                    // console.log(currentUser);
                    currentUser.save();
                    currentClass.save();
                    setTimeout(function waitSomeTime(){
                        return next();
                    },1000)
                }
            } else {
                return next();
            }
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}

//CREATE the group
groupMiddleware.createGroup = (req,res,next) => {

    // console.log(req.body);
    // console.log(req.body.avatars);
    if(req.body.avatar === undefined){
        console.log("Please choose an avatar");
        res.redirect("back");
    } else {
        const createdGroup = new groups({
            _id: uuid.v4(),
            memberIDs: [],
            avatar: {
                name: avatars.filter(avatar => avatar.name === req.body.avatar)[0].name,
                description: avatars.filter(avatar => avatar.name === req.body.avatar)[0].description
            },
            classID: req.user.classID,
            answeredAssignments: [],
            correctingAssignments: []
        })
        // console.log(createdGroup);
    
        classes.findById({_id: createdGroup.classID}).then(currentClass => {
            // console.log(currentClass)
            var avatarsNotChosen = [];
            req.body.avatars.forEach(avatar => {
                if(avatar !== createdGroup.avatar.name){
                    avatarsNotChosen.push(avatar);
                }
            });
    
            for(var i = 0; i < currentClass.avatarsNotAvailable.length; i++){
                var indexToRemoveFrom = undefined;
                avatarsNotChosen.forEach(avatar => {
                    if(avatar === currentClass.avatarsNotAvailable[i].name){
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
            // console.log(createdGroup);
            createdGroup.memberIDs.push(req.user._id);
            // console.log(req.body.invite);
            if(Array.isArray(req.body.invite)){
                req.body.invite.forEach(inv => {
                    createdGroup.memberIDs.push(inv);
                })
            } else if(!Array.isArray(req.body.invite) && req.body.invite !== undefined) {
                createdGroup.memberIDs.push(req.body.invite);
            }
            currentClass.groups.push(createdGroup.id);
            users.findById({_id: req.user.id}).then(currentUser => {
                currentUser.groupID = createdGroup.id;
                currentUser.avatarsToChoose = [];
                // console.log(currentUser);
                currentUser.save()
                setTimeout(function waitSomeTime(){
                    return next();
                },250)
            }).catch(err => console.log(err));
            createdGroup.save();
            currentClass.save();
        }).catch(err => console.log(err));
    }

    

    // console.log(createdGroup);
}

//UPDATE the group
groupMiddleware.updateGroup = (req,res,next) => {
    // console.log(req.body)

    groups.findById({_id: req.user.groupID}).then(groupToUpdate => {

        if(req.body.avatar !== undefined){
            groupToUpdate.name = req.body.avatar;
            groupToUpdate.avatar = req.body.avatar;
        }
        if(req.body.invite !== undefined){
            groupToUpdate.memberIDs.push(req.body.invite);
        }



        groupToUpdate.save();
        // console.log(groupToUpdate);

        return next();
    }).catch(err => console.log(err));
}

//Allow the user to decline group invite
groupMiddleware.declineGroup = (user, declineID) => {
    var requests = [] 
    requests = user.requests;
    var requestToDecline = [];
    
    groups.forEach(group => {
        if(group.id === declineID) {
            user.requests.forEach(request => {
                if(Object.values(request).includes(declineID)){
                    requestToDecline.push(request);
                }
            })
            groupMiddleware.removeUserFromGroup(user, group);
        }
    })
    var index = requests.indexOf(requestToDecline[0]);
    if(requestToDecline.length > 0) {
        if(index !== 0){
            requests.splice(index,1);
        } else if(index === 0){
            requests.shift();
        }
    }
    user.requests = requests;
    return;
}

//Remove a user from the groups list of users
groupMiddleware.removeUserFromGroup = (userToRemove, groupToRemoveFrom) => {
    var index;
    var groupsIDs = [];
    groups.forEach(group => {
        if(group.id === groupToRemoveFrom.id){
            groupsIDs = group.memberIDs;
            index = groupsIDs.indexOf(userToRemove.id);
            if(index !== 0){
                groupsIDs.splice(index,1);
            } else if(index === 0){
                groupsIDs.shift();
            }
            group.memberIDs = groupsIDs;
        }
    })
}

//Let a user quit the group, and if no users in the group, remove the group
groupMiddleware.quitGroup = (userToRemove, groupToRemoveFromID) => {
    var index;
    var groupsIDs = [];
    var groupToRemove;
    groups.forEach(group => {
        if(group.id === groupToRemoveFromID){
            groupsIDs = group.memberIDs;
            index = groupsIDs.indexOf(userToRemove.id);
            if(index!==0){
                groupsIDs.splice(index,1);
                userToRemove.groupID = null;
            } else if(index === 0){
                groupsIDs.shift();
                userToRemove.groupID = null;
            }
            if(groupsIDs.length > 0){
                group.memberIDs = groupsIDs;
            } else {
                groupToRemove = group;
            }
        }
    })
    if(groupToRemove){
        var groupIndex = groups.indexOf(groupToRemove);
        if(groupIndex !== 0)
        {
            groups.splice(groupIndex,1);
        } else if(groupIndex === 0) {
            groups.shift();
        }
    }
}

groupMiddleware.deleteGroupsWithClass = (groupToDelete) => {
    groups.findByIdAndDelete({_id: groupToDelete.id}, (err) => console.log(err));
}

//-------------------------------------------------------------------------------------------------




module.exports = groupMiddleware;