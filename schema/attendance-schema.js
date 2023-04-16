import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

const attendacneSchema = mongoose.Schema({
    Attendance_date: {type: String, required: true},
    Course_id: {type: Number, required: true},
    Attendance_data: {type: Array},
    Total_Student : {type: Number, required: true},
    Present_Student : {type: Number, required: true},
    Absent_Student : {type: Number, required: true},
    Day: {type: String, required: true},
})

autoIncrement.initialize(mongoose.connection);
attendacneSchema.plugin(autoIncrement.plugin, 'attendance')

const Attendance = mongoose.model('attendance', attendacneSchema);

export default Attendance;