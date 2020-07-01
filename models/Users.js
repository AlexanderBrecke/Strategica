const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

    _id: {type: String},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String},
    password: {type: String},
    isAdmin: {type: Boolean},
    groupID: {type: String},
    classID: {type: String},
    avatarsToChoose: [
        {
            _id:false,
            name: {type:String},
            description: {type:String}
        }
    ],
    requests: [
        {
            _id: {type: String},
            message: {type: String}
        }
    ], 
    declinedAssignments: [
        {
            _id: {type:String},
            groupID: {type:String},
            reason: {type: String},
        }
    ]

}, {strict: false})

module.exports = mongoose.model("Users", userSchema);