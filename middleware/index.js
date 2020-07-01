//Requiremets
const   userMiddleware = require("./user"),
        groupMiddleware = require("./group"),
        assignmentMiddleware = require("./assignments"),
        correctionMiddleware = require("./correction"),
        requestMiddleware = require("./request"),
        classMiddleware = require("./class"),
        functionMiddleware = require("./functions");

//All middleware goes here
const middlewareObj = {};

//Check if the user is logged in
middlewareObj.isLoggedIn = (req,res,next) => {
    //console.log(groups[0].answeredAssignments);
    if(req.isAuthenticated()){
        return next();
    }
}

middlewareObj.checkForAdminRights = (req,res,next) => {
    if(req.isAuthenticated){
        // console.log(req.user);
        if(req.user.isAdmin){
            return next();
        } else {
            console.log("You do not have those privilegies");
            res.redirect(`/users/${req.user.id}`);
        }
    }
}

//---------------------------------------------------------------------USER STUFF-----------------------------------------------------------------------------

middlewareObj.checkUserOwnership = userMiddleware.checkUserOwnership;

middlewareObj.checkUserRequest = userMiddleware.checkUserRequest;

middlewareObj.checkIfUserIsInGroup = userMiddleware.checkIfUserIsInGroup;

middlewareObj.updateUser = userMiddleware.updateUser;

middlewareObj.createUser = userMiddleware.createUser;

userMiddleware.deleteUsersWithClass = userMiddleware.deleteUsersWithClass;

//-------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------GROUP STUFF-----------------------------------------------------------------------------

middlewareObj.giveAvatarsToChooseFrom = groupMiddleware.giveAvatarsToChooseFrom;

middlewareObj.createGroup = groupMiddleware.createGroup;

middlewareObj.updateGroup = groupMiddleware.updateGroup;

middlewareObj.declineGroup = groupMiddleware.declineGroup;

middlewareObj.removeUserFromGroup = groupMiddleware.removeUserFromGroup;

middlewareObj.quitGroup = groupMiddleware.quitGroup;

//-------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------ASSIGNMENT STUFF------------------------------------------------------------------------

middlewareObj.createAssignment = assignmentMiddleware.createAssignment;

middlewareObj.publishOrFinishAssignment = assignmentMiddleware.publishOrFinishAssignment;

middlewareObj.editAssignment = assignmentMiddleware.editAssignment;

middlewareObj.deleteAssignment = assignmentMiddleware.deleteAssignment;

middlewareObj.answerAssignment = assignmentMiddleware.answerAssignment;

middlewareObj.editAssignmentAnswer = assignmentMiddleware.editAssignmentAnswer;

//-------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------CORRECTION STUFF------------------------------------------------------------------------

middlewareObj.giveAssignmentToCorrect = correctionMiddleware.giveAssignmentToCorrect;

middlewareObj.correctAssignment = correctionMiddleware.correctAssignment;

middlewareObj.answerCorrection = correctionMiddleware.answerCorrection;

middlewareObj.adminAssessment = correctionMiddleware.adminAssessment;

//-------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------REQUEST STUFF------------------------------------------------------------------------

middlewareObj.checkForRequests = requestMiddleware.checkForRequests;

middlewareObj.cleanUpRequests = requestMiddleware.cleanUpRequests;

//-------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------FUNCTION STUFF------------------------------------------------------------------------

middlewareObj.isEmpty = functionMiddleware.isEmpty;

//-------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------Class STUFF---------------------------------------------------------------------------

middlewareObj.createClass = classMiddleware.createClass;

middlewareObj.updateClass = classMiddleware.updateClass;

middlewareObj.deleteClass = classMiddleware.deleteClass;

//-------------------------------------------------------------------------------------------------






module.exports = middlewareObj;