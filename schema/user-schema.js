import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

const userSchema = mongoose.Schema({
    Name: {type: String, required: true},
    ProfilePicture: {type: String},
    Email: {type: String, required: true, unique: true},
    Password: {type: String, required: true},
    Gender: {type: String},
    Contact: {type: Number},
    DOB: {type: Date},
    Address: {type: String},
    Courses: {type: Array}
})

autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, 'user')

const users = mongoose.model('user', userSchema);

export default users;