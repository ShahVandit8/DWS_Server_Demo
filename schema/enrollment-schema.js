import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

const enrollmentSchema = mongoose.Schema({
    Student_id: {type: Number, required: true},
    Course_id: {type: Number, required: true},
    Enrollment_date: {type: String, required: true},
    Course_StartDate: {type: String, required: true},
    Status: {type: String, required: true},
    Amount: {type: Number, required: true},
})

autoIncrement.initialize(mongoose.connection);
enrollmentSchema.plugin(autoIncrement.plugin, 'enrollment')

const Enrollment = mongoose.model('enrollment', enrollmentSchema);

export default Enrollment;