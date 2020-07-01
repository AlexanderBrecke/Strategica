const mongoose = require("mongoose");

const assignmentSchrema = mongoose.Schema({
    _id: {type: String},
    level: { type: Number, required: true },
    title: { type: String, required: true },
    introduction: { type: String, required: true },
    tasks: [
        {
            _id: false,
            title: { type: String, required: true },
            text: { type: String, required: true },
            image: String
        }
    ]
});

module.exports = mongoose.model("Assignments", assignmentSchrema);
