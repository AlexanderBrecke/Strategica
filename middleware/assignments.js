const   groups = require("../models/Groups"),
        assignments = require("../models/Assignments"),
        Assignment = require("../models/Assignments"),
        classes = require("../models/Classes"),
        uuid = require("uuid"),
        mongoose = require("mongoose");

const assignmentMiddleware = {}



//---------------------------------------------------------------------ASSIGNMENT STUFF------------------------------------------------------------------------

//Create an assignment
assignmentMiddleware.createAssignment = (req,res,next) => {

    const newAssignment = new Assignment({
        //_id: new mongoose.Types.ObjectId(),
        _id: uuid.v4(),
        level: req.body.assignmentLevel,
        title: req.body.assignmentTitle,
        introduction: req.body.assignmentIntroduction,
        tasks: []
    })

    if(!Array.isArray(req.body.taskTitle)){
        if(req.body.taskTitle !== "" && req.body.taskText !== ""){
            newAssignment.tasks.push({
                title :req.body.taskTitle,
                text: req.body.taskText,
                image: req.body.image
            });
        } else {
            console.log("Please fill out the title and text of the task")
            return res.redirect("/assignments/create");
        }
    } else {
        if(req.body.taskTitle !== "" && req.body.taskText !== ""){
            for(var i = 0; i < req.body.taskTitle.length; i++) {
                newAssignment.tasks.push({
                    title: req.body.taskTitle[i],
                    text: req.body.taskText[i],
                    image: req.body.image[i]
                })
            }
        } else {
            console.log("Please fill out the title and text of the tasks");
            return res.redirect("/assignments/create");
        }
    }
    // console.log(newAssignment);
    newAssignment.save();


    return next();
}

assignmentMiddleware.publishAssignment = (assignmentToPublish, classesToPublishFor) => {

    classes.findById({_id: classesToPublishFor}).then(classesToPublishFor => {
        if(!classesToPublishFor.publishedAssignments.includes(assignmentToPublish.id)){
            classesToPublishFor.publishedAssignments.push(assignmentToPublish.id);
        }
        // console.log(classesToPublishFor);
        classesToPublishFor.save();
    })
}

assignmentMiddleware.finishAssignment = (assignmentToFinish, classesToFinishFor) => {

    classes.findById({_id: classesToFinishFor}).then(classesToFinishFor => {
        // console.log(classesToFinishFor)
        if(!classesToFinishFor.finishedAssignments.includes(assignmentToFinish.id)){
            classesToFinishFor.finishedAssignments.push(assignmentToFinish.id);
        }
        // console.log(classesToFinishFor);
        classesToFinishFor.save();
    })
}

//Publish or finish assignments
assignmentMiddleware.publishOrFinishAssignment = (req,res,next) => {
  
    var classesToPublishFor = req.body.classPublish;
    var classesToFinishFor = req.body.classFinish;

    if(classesToPublishFor !== undefined && classesToFinishFor === undefined){
        if(!Array.isArray(classesToPublishFor)){
            assignments.findById({_id: req.body.assignmentToPublish}).then(assignmentToPublish => {
                // console.log(assignmentToPublish);
                if(classesToPublishFor !== undefined){
                    assignmentMiddleware.publishAssignment(assignmentToPublish, classesToPublishFor);
                }
            }).catch(err => console.log(err));
        } else {
            classesToPublishFor.forEach(currentClass => {
                assignments.findById({_id: req.body.assignmentToPublish}).then(assignmentToPublish => {
                    // console.log(assignmentToPublish);
                    if(classesToPublishFor !== undefined){
                        assignmentMiddleware.publishAssignment(assignmentToPublish, currentClass);
                    }
                }).catch(err => console.log(err));
            })
        }
    } else if(classesToPublishFor === undefined && classesToFinishFor !== undefined){
        if(!Array.isArray(classesToFinishFor)){
            assignments.findById({_id: req.body.assignmentToFinish}).then(assignmentToFinish => {
                // console.log(assignmentToFinish);
                if(classesToFinishFor !== undefined){
                    assignmentMiddleware.finishAssignment(assignmentToFinish, classesToFinishFor);
                }
            }).catch(err => console.log(err));
        } else {
            classesToFinishFor.forEach(currentClass => {
                assignments.findById({_id: req.body.assignmentToFinish}).then(assignmentToFinish => {
                    if(classesToFinishFor !== undefined){
                        assignmentMiddleware.finishAssignment(assignmentToFinish, currentClass);
                    }
                }).catch(err => console.log(err));
            })
        }
    } else if(classesToPublishFor !== undefined && classesToFinishFor !== undefined){

        if(!Array.isArray(classesToPublishFor)){
            assignments.findById({_id: req.body.assignmentToPublish}).then(assignmentToPublish => {
                // console.log(assignmentToPublish);
                if(classesToPublishFor !== undefined){
                    assignmentMiddleware.publishAssignment(assignmentToPublish, classesToPublishFor);
                }
            }).catch(err => console.log(err));
        } else {
            classesToPublishFor.forEach(currentClass => {
                assignments.findById({_id: req.body.assignmentToPublish}).then(assignmentToPublish => {
                    // console.log(assignmentToPublish);
                    if(classesToPublishFor !== undefined){
                        assignmentMiddleware.publishAssignment(assignmentToPublish, currentClass);
                    }
                }).catch(err => console.log(err));
            })
        }

        if(!Array.isArray(classesToFinishFor)){
            assignments.findById({_id: req.body.assignmentToFinish}).then(assignmentToFinish => {
                // console.log(assignmentToFinish);
                if(classesToFinishFor !== undefined){
                    assignmentMiddleware.finishAssignment(assignmentToFinish, classesToFinishFor);
                }
            }).catch(err => console.log(err));
        } else {
            classesToFinishFor.forEach(currentClass => {
                assignments.findById({_id: req.body.assignmentToFinish}).then(assignmentToFinish => {
                    if(classesToFinishFor !== undefined){
                        assignmentMiddleware.finishAssignment(assignmentToFinish, currentClass);
                    }
                }).catch(err => console.log(err));
            })
        }

    }

    return next();

}

//Edit assignments
assignmentMiddleware.editAssignment = (req,res,next) => {

    assignments.findById({_id: req.params.assignmentID}).then(assignmentToEdit => {

        function removeTasks() {
            for(var i = assignmentToEdit.tasks.length; i > req.body.taskTitle.length; i--){
                assignmentToEdit.tasks.shift();
            }
        }
        function createTasks(){
            for(var i = assignmentToEdit.tasks.length; i < req.body.taskTitle.length; i++){
                assignmentToEdit.tasks.push({title:"foo",text:"bar",image:"foobar"});
            }
        }
        function fillOneTask() {
            if(req.body.taskTitle !== "" && req.body.taskText !== ""){
                assignmentToEdit.tasks[0].title = req.body.taskTitle;
                assignmentToEdit.tasks[0].text = req.body.taskText;
                assignmentToEdit.tasks[0].image = req.body.image;
            } else {
                console.log("Please fill out the title and text of the task");
                return res.redirect(`/assignments/${assignmentToEdit.id}/edit`);
            }
        }
        function fillMultipleTasks() {
            for(var i = 0; i < req.body.taskTitle.length; i++) {
                if(req.body.taskTitle !== "" && req.body.taskText !== ""){
                    assignmentToEdit.tasks[i].title = req.body.taskTitle[i];
                    assignmentToEdit.tasks[i].text = req.body.taskText[i];
                    assignmentToEdit.tasks[i].image = req.body.image[i];
                } else {
                    console.log("Please fill out the title and text of the task")
                    return res.redirect(`/assignments/${assignmentToEdit.id}/edit`);
                }
            }
        }
        
        if(req.body.assignmentTitle !== "" && req.body.assignmentDetails !== ""){
            console.log(assignmentToEdit);
            console.log(req.body.assignmentLevel);
            assignmentToEdit.level = req.body.assignmentLevel;
            assignmentToEdit.title = req.body.assignmentTitle;
            assignmentToEdit.introduction = req.body.assignmentIntroduction;
        } else {
            console.log("Please fill in a title and details for the assignment");
            return res.redirect(`/assignments/${assignmentToEdit.id}/edit`);
        }
        if(!Array.isArray(req.body.taskTitle)){
            if(assignmentToEdit.tasks.length > 1){
                for(var i = assignmentToEdit.tasks.length; i > 1; i--){
                    assignmentToEdit.tasks.shift();
                }
                fillOneTask();
            } else if(assignmentToEdit.tasks.length === 1) {
                fillOneTask();
            }
        } else {
            if(assignmentToEdit.tasks.length < req.body.taskTitle.length){
                createTasks();
                fillMultipleTasks();
            } else if(assignmentToEdit.tasks.length > req.body.taskTitle.length){
                removeTasks();
                fillMultipleTasks();
            } else if(assignmentToEdit.tasks.length === req.body.taskTitle.length){
                fillMultipleTasks();
            }
        }
        assignmentToEdit.save();
        return next();
    
       


    }).catch(err => console.log(err));
    

}

assignmentMiddleware.deleteAssignment = (req,res,next) => {

    assignments.deleteOne({_id: req.params.assignmentID}, (err) => {console.log(err)});
    return next();
}

assignmentMiddleware.answerAssignment = (req,res,next) => {

    groups.findById({_id: req.user.groupID}).then(currentGroup => {
        classes.findById({_id: currentGroup.classID}).then(currentClass => {

            if(req.body.taskAnswer.includes("") && Array.isArray(req.body.taskAnswer) || req.body.taskAnswer === "" && !Array.isArray(req.body.taskAnswer)) {
                console.log("Please fill out all the answers");
                res.redirect(`/assignments/${req.params.assignmentID}`);
            } else {
                var assignment = {
                    groupID: currentGroup.id,
                    _id: req.params.assignmentID
                } 
                currentGroup.assignmentAnswers.push(assignment);

                var answers;
                var assignmentToAnswer = currentGroup.assignmentAnswers.filter(answer => answer.id === req.params.assignmentID)[0];
                if(!Array.isArray(req.body.taskAnswer)){
                    answers = [];
                    answers.push(req.body.taskAnswer);
                } else if(Array.isArray(req.body.taskAnswer)){
                    answers = req.body.taskAnswer;
                }
                answers.forEach(answer => {
                    assignmentToAnswer.answers.push({answer: answer});
                })
                // console.log(currentGroup.assignmentAnswers);

                currentClass.assignmentsAvailableForCorrection.push(assignment);
                // console.log(currentClass);
                currentClass.save();
                currentGroup.save();
            }


        }).catch(err => console.log(err));
    }).catch(err => console.log(err));

    return next();
}

assignmentMiddleware.editAssignmentAnswer = (req,res,next) => {

    // console.log(req.body.taskAnswer);
    if(Array.isArray(req.body.taskAnswer) && !req.body.taskAnswer.includes("")){
        groups.findById({_id: req.user.groupID}).then(currentGroup => {
            assignments.findById({_id: req.params.assignmentID}).then(currentAssignment => {
                classes.findById({_id: currentGroup.classID}).then(currentClass => {
    
                    var editedAssignment = currentGroup.assignmentAnswers.filter(assignment => assignment.id === currentAssignment.id)[0];
                    for(var i = 0; i < editedAssignment.answers.length; i++){
                        editedAssignment.answers[i].answer = req.body.taskAnswer[i];
                    }
                    editedAssignment.score = 0;
                    editedAssignment.correctedBy = undefined;
                    editedAssignment.isCorrected = false;
                    editedAssignment.accepted = false;
                    if(editedAssignment.declined){
                        editedAssignment.declined = false;
                    }
                    if(editedAssignment.assessedByAdmin){
                        editedAssignment.assessedByAdmin = false;
                        if(editedAssignment.adminScore !== undefined){
                            editedAssignment.adminScore = 0;
                        }
                    }
                    currentClass.assignmentsAvailableForCorrection.push({_id: editedAssignment.id, groupID: editedAssignment.groupID});
                    currentGroup.save();
                    currentClass.save();
                    return next();
    
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    } else if(!Array.isArray(req.body.taskAnswer) && req.body.taskAnswer !== ""){
        groups.findById({_id: req.user.groupID}).then(currentGroup => {
            assignments.findById({_id: req.params.assignmentID}).then(currentAssignment => {
                classes.findById({_id: currentGroup.classID}).then(currentClass => {
    
                    var editedAssignment = currentGroup.assignmentAnswers.filter(assignment => assignment.id === currentAssignment.id)[0];
                    editedAssignment.answers[0].answer = req.body.taskAnswer;
                    editedAssignment.score = 0;
                    editedAssignment.correctedBy = undefined;
                    editedAssignment.isCorrected = false;
                    editedAssignment.accepted = false;
                    if(editedAssignment.declined){
                        editedAssignment.declined = false;
                    }
                    if(editedAssignment.assessedByAdmin){
                        editedAssignment.assessedByAdmin = false;
                        if(editedAssignment.adminScore !== undefined){
                            editedAssignment.adminScore = 0;
                        }
                    }
                    currentClass.assignmentsAvailableForCorrection.push({_id: editedAssignment.id, groupID: editedAssignment.groupID});
                    // console.log(editedAssignment);
                    // console.log(currentGroup);
                    // console.log(currentClass);
                    currentGroup.save();
                    currentClass.save();
                    return next();
    
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    } else if(Array.isArray(req.body.taskAnswer) && req.body.taskAnswer.includes("") || !Array.isArray(req.body.taskAnswer) && req.body.taskAnswer === ""){
        console.log("please fill out all the fields");
        res.redirect("back");
    }
}

//-------------------------------------------------------------------------------------------------

module.exports = assignmentMiddleware;