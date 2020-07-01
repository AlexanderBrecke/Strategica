const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({

    _id: {type: String},
    name: {type: String, required: true},
    password: {type: String, required: true},
    students: [
        {
            _id: {type: String}
        }
    ],
    groups: [
        {
            _id: {type: String}
        }
    ],
    publishedAssignments: [
        {
            _id: {type: String}
        }
    ],
    finishedAssignments: [
        {
            _id: {type: String}
        }
    ],
    assignmentsAvailableForCorrection: [
        {
            _id: {type: String},
            groupID: {type: String}
        }
    ],
    avatarsNotAvailable: [
        {
            _id:false,
            name:{type:String}
        }
    ]
    

}, {strict: false})

module.exports = mongoose.model("classes", classSchema);