//Requiremets
const   users = require("../models/Users"),
        Class = require("../models/Classes"),
        groups = require("../models/Groups"),
        functionMiddleware = require("./functions"),
        groupMiddleware = require("./group"),
        userMiddleware = require("./user"),
        uuid = require("uuid");

const classMiddleware = {};



classMiddleware.createClass = (req,res,next) => {

    var newClass = new Class({
        _id: uuid.v4(),
        name: req.body.className,
        password: req.body.classPassword
    })
    // console.log(newClass);
    newClass.save().then(newclass => {console.log("Created class " + newclass.name)}).catch(err => {console.log(err)});
   
    return next();
}



classMiddleware.updateClass = (req,res,next) => {

    //console.log(req.params);

    Class.findById({_id: req.params.classID}).then(classToUpdate => {
        // console.log(classToUpdate);

        console.log("Updating " + classToUpdate.name);
        if(req.body.className !== "" && classToUpdate.name !== req.body.className){
            classToUpdate.name = req.body.className;
            console.log("Updating name");
        }
        if(req.body.classPassword !== "" && classToUpdate.password !== req.body.classPassword){
            classToUpdate.password = req.body.classPassword;
            console.log("Updating password");
        }
        //classToUpdate.students = classToUpdate.students;
        console.log(classToUpdate);
        classToUpdate.save();
        return next();

    })
}



classMiddleware.deleteClass = (req,res,next) => {

    Class.findById({_id: req.params.classID}).then(currentClass => {
        currentClass.students.forEach(student => {
            users.findById({_id: student.id}).then(studentToRemove => {
                // console.log(studentToRemove);
                userMiddleware.deleteUsersWithClass(studentToRemove);
            }).catch(err => console.log(err));
        })
        currentClass.groups.forEach(group => {
            groups.findByIdAndDelete({_id: group.id}, (err) => console.log(err));
        })
        Class.findByIdAndDelete({_id: currentClass.id}, (err) => console.log(err));
    }).catch(err => console.log(err));
    return next();
}



module.exports = classMiddleware;