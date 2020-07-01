const   groups = require("../models/Groups"),
        users = require("../models/Users");

const requestMiddleware = {}


//---------------------------------------------------------------------REQUEST STUFF------------------------------------------------------------------------

//THIS SENDS A REQUEST IF THE USER HAS BEEN INVITED TO THE GROUP!
requestMiddleware.checkForRequests = (req,res,next) => {

    if(!req.user.isAdmin){
        // return next();

        var requestsToPush = [];
        users.findById({_id: req.user.id}).then(currentUser => {
            // return next();
            if(currentUser.groupID === undefined){
                groups.find().then(groups => {
                    if(groups.length !== 0){
                        groups.forEach(group => {
                            group.memberIDs.forEach(member => {
                                if(member.id === currentUser.id){
                                    requestsToPush.push(group.id);
                                }
                            })
                        })
                        var indexToRemoveFrom;
                        currentUser.requests.forEach(request => {
                            if(requestsToPush.includes(request.id)){
                                indexToRemoveFrom = requestsToPush.indexOf(request.id);
                            }
                            if(indexToRemoveFrom !== undefined && indexToRemoveFrom !== null){
                                if(indexToRemoveFrom === 0){
                                    requestsToPush.shift();
                                    indexToRemoveFrom = null;
                                } else {
                                    requestsToPush.splice(indexToRemoveFrom, 1);
                                    indexToRemoveFrom = null;
                                }
                            }
                        })
                        requestsToPush.forEach(request => {
                            var currentGroup = groups.filter(group => group.id === request)[0];
                            currentUser.requests.push({message: `You have been invited to join a group`, _id: currentGroup.id});
                        })
                        currentUser.save();
                    }
                    return next();
                }).catch(err => console.log(err));
            } else {
                return next();
            }
        }).catch(err => console.log(err));


    } else {
        
        return next();
    }
}

requestMiddleware.cleanUpRequests = () => {
    var members = []
    groups.find().then(groups => {
        if(groups.length > 0){
            groups.forEach(group => {
               group.memberIDs.forEach(member => {
                   if(member !== undefined){
                       members.push(member);
                   }
               })
               group.memberIDs = members;
               members = [];
            })
        }
    }).catch(err => console.log(err));
}

//-------------------------------------------------------------------------------------------------

module.exports = requestMiddleware;