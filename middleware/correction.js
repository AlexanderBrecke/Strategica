const   users = require("../models/Users"),
        groups = require("../models/Groups"),
        classes = require("../models/Classes"),
        assignments = require("../models/Assignments");

const correctionMiddleware = {}


//---------------------------------------------------------------------CORRECTION STUFF------------------------------------------------------------------------

//Give the group an assignment to correct

correctionMiddleware.giveAssignmentToCorrect = (req,res,next) => {
    if(!req.user.isAdmin){

        groups.findById({_id: req.user.groupID}).then(currentGroup => {
            classes.findById({_id: currentGroup.classID}).then(currentClass => {
                
                var indexToRemoveFrom;
                for(var i = 0; i < currentClass.assignmentsAvailableForCorrection.length; i++){
                    // console.log(i);
                    if(currentClass.assignmentsAvailableForCorrection[i].groupID !== currentGroup.id && currentGroup.correctingAssignments.length < 1){
                        currentGroup.correctingAssignments.push({_id: currentClass.assignmentsAvailableForCorrection[i].id, groupID: currentClass.assignmentsAvailableForCorrection[i].groupID});
                        // console.log(currentGroup.correctingAssignments);
                        indexToRemoveFrom = i;
                    }
                }
                if(indexToRemoveFrom === 0){
                    currentClass.assignmentsAvailableForCorrection.shift();
                } else if(indexToRemoveFrom !== 0 && indexToRemoveFrom !== undefined){
                    currentClass.assignmentsAvailableForCorrection.splice(indexToRemoveFrom,1);
                }
                currentClass.save();
                currentGroup.save();
                // console.log(currentGroup.correctingAssignments);
                setTimeout(function waitsome(){
                    return next();
                }, 250)
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));

    }
}

correctionMiddleware.correctAssignment = (req,res,next) => {

    // console.log(req.body);

    groups.findById({_id: req.user.groupID}).then(correctingGroup => {
        groups.findById({_id: correctingGroup.correctingAssignments[0].groupID}).then(targetGroup => {

            var targetAssignment = targetGroup.assignmentAnswers.filter(answer => answer.id === correctingGroup.correctingAssignments[0].id)[0];
            // console.log(req.body.answerComments);
            if(!Array.isArray(req.body.answerComments)){
                // console.log(targetAssignment.answers[0]);
                targetAssignment.answers[0].comment = req.body.answerComments;
            } else {
                for(var i = 0; i < req.body.answerComments.length; i++){
                    targetAssignment.answers[i].comment = req.body.answerComments[i];
                }
            }
            targetAssignment.assessment = req.body.assessment;
            targetAssignment.score = req.body.score;
            targetAssignment.isCorrected = true;
            targetAssignment.correctedBy = correctingGroup.id;
            
            // console.log(targetAssignment);
            targetGroup.save();
            
            // console.log(correctingGroup);
            correctingGroup.correctingAssignments.shift();
            correctingGroup.save();
            // console.log(correctingGroup);
            return next();
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));

}

correctionMiddleware.answerCorrection = (req,res,next) => {

    if(!req.user.isAdmin){
        groups.findById({_id: req.user.groupID}).then(currentGroup => {
            
            if(req.body.accept){
                var assignmentToAccept = currentGroup.assignmentAnswers.filter(answer => answer.id === req.body.accept)[0];
                assignmentToAccept.accepted = true;
                groups.findById({_id: assignmentToAccept.correctedBy}).then(correctingGroup => {
                    if(correctingGroup.score === undefined){
                        correctingGroup.score = 1;
                    } else {
                        correctingGroup.score = Number(correctingGroup.score) + 1;
                    }
                    // console.log(correctingGroup.score);
                    correctingGroup.save();
                }).catch(err => console.log(err));
                // console.log(currentGroup);
            } else if(req.body.decline){
                var assignmentToDecline = currentGroup.assignmentAnswers.filter(answer => answer.id === req.body.decline)[0];
                assignmentToDecline.declined = true;
                // console.log(req.body.declineReason);
                users.findById({_id: "admin"}).then(admin => {
                    admin.declinedAssignments.push({
                        _id: assignmentToDecline.id,
                        groupID: currentGroup.id,
                        reason: req.body.declineReason
                    })
                    // console.log(admin.declinedAssignments);
                    admin.save();
                }).catch(err => console.log(err));
                // console.log(assignmentToDecline);
            }
            currentGroup.save();
            return next();
        }).catch(err => console.log(err));
    }
    
}


correctionMiddleware.adminAssessment = (req,res,next) => {
    //console.log(req);

    groups.findById({_id: req.params.groupID}).then(assessedGroup => {
        assignments.findById({_id: req.params.assignmentID}).then(assessedAssignment => {
            users.findById({_id: "admin"}).then(admin => {
                var currentAssessedAssignment = assessedGroup.assignmentAnswers.filter(answer => answer.id === assessedAssignment.id)[0];
                groups.findById({_id: currentAssessedAssignment.correctedBy}).then(correctingGroup => {
                    var adminComments = req.body.answerComments;
                    var adminAssessment = req.body.assessment;
                    var scoreAgreement = req.body.agreement;
                    var scoreToGive = req.body.score;

                    // console.log(currentAssessedAssignment);
    
                    if(currentAssessedAssignment.answers.length > 1){
                        for(var i = 0; i < currentAssessedAssignment.answers.length; i++){
                            currentAssessedAssignment.answers[i].adminComment = adminComments[i];
                        }
                    } else {
                        currentAssessedAssignment.answers[0].adminComment = adminComments;
                    }
                    currentAssessedAssignment.adminAssessment = adminAssessment;
    
                    var assessingDecline;
                    admin.declinedAssignments.forEach(decline => {
                        if(decline.id === currentAssessedAssignment.id && decline.groupID === currentAssessedAssignment.groupID){
                            assessingDecline = true;
                        }
                    });
    
                    if(assessingDecline){
                        // console.log(req.body);
                        if(scoreAgreement === "disagree"){
                            currentAssessedAssignment.adminScore = scoreToGive;
                        } else if(scoreAgreement === "agree"){
                            if(correctingGroup.score !== undefined){
                                correctingGroup.score = Number(correctingGroup.score) + 1;
                            } else {
                                correctingGroup.score = 1;
                            }
                        }
                        var indexToRemoveFromDeclined;
                        for(var i = 0; i < admin.declinedAssignments.length; i++){
                            if(admin.declinedAssignments[i].id === currentAssessedAssignment.id && admin.declinedAssignments[i].groupID === currentAssessedAssignment.groupID){
                                indexToRemoveFromDeclined = i;
                            }
                        }
                        if(indexToRemoveFromDeclined === 0){
                            admin.declinedAssignments.shift();
                        } else {
                            admin.declinedAssignments.splice(indexToRemoveFromDeclined,1);
                        }
                        currentAssessedAssignment.assessedByAdmin = true;
    
                        // console.log(assessedGroup.assignmentAnswers);
                    } else {
                        if(scoreAgreement === "disagree"){
                            currentAssessedAssignment.adminScore = scoreToGive;
                            correctingGroup.score = Number(correctingGroup.score) - 1;
                        }
                    }

                    // console.log(correctingGroup.score);
                    admin.save();
                    correctingGroup.save();
                    assessedGroup.save();

                    return next();
    
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}

//-------------------------------------------------------------------------------------------------

module.exports = correctionMiddleware;