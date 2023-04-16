import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

const instructorSchema = mongoose.Schema({
    Name: {type: String, required: true},
    ProfilePhoto: {type: String, required: true},
    Email: {type: String, required: true, unique: true},
    Password: {type: String, required: true},
    Gender: {type: String, required: true},
    DOB: {type: Date, required: true},
    Mobile: {type: Number, required: true},
    Address: {type: String, required: true},
    Courses: {type: Array},
    Status: {type: String, required: true},
})

autoIncrement.initialize(mongoose.connection);
instructorSchema.plugin(autoIncrement.plugin, 'instructor')

const instructor = mongoose.model('instructor', instructorSchema);

export default instructor;