import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

const courseSchema = mongoose.Schema({
    Name: {type: String, required: true, unique: true},
    CoverImage: {type: String, required: true},
    Category: {type: String, required: true},
    ShortDescription: {type: String, required: true},
    StudentCount: {type: Number},
    Rating: {type: Number},
    RatingList: {type: Array},
    RatingOutOf: {type: Number},
    Level: {type: String, required: true},
    Modules: {type: Array, required: true},
    LongDescription: {type: String, required: true},
    Price: {type: Number, required: true},
    SellingPrice: {type: Number, required: true},
    Instructor: {type: Object},
    Duration: {type: String, required: true},
    StartDate: {type: Date, required: true},
    Timings: {type: String, required: true},
    Completion: {type: Number, required: true},
    Status: {type: String, required: true},
})

autoIncrement.initialize(mongoose.connection);
courseSchema.plugin(autoIncrement.plugin, 'Courses')

const Courses = mongoose.model('Courses', courseSchema);

export default Courses;