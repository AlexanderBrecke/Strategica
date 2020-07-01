const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({

    _id: {type: String},
    avatar: {
        _id: false,
        name: {type:String},
        description: {type:String}
    },
    score: {type:Number},
    memberIDs: [
        {
            _id: {type:String}
        }
    ],
    classID: {type:String},
    assignmentAnswers: [
        {
            groupID:{type:String},
            _id: {type:String},
            answers:[
                {
                    _id:false,
                    answer:{type:String},
                    comment: {type:String},
                    adminComment:{type:String}
                },
            ],
            assessment:{type:String},
            isCorrected:{type:Boolean},
            score:{type:Number},
            accepted:{type:Boolean},
            declined:{type:Boolean},
            adminAssessment:{type:String},
            adminScore:{type:Number},
            assessedByAdmin:{type:Boolean},
            correctedBy:{type:String}

        }
    ],
    correctingAssignments:[
        {
            _id: {type:String},
            groupID: {type:String},
        }
    ]

}, {strict: false})

module.exports = mongoose.model("Groups", groupSchema);