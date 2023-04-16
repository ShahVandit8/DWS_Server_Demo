import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

const adminSchema = mongoose.Schema({
    Name: {type: String, required: true},
    ProfileCover: {type: String, required: true},
    Email: {type: String, required: true, unique: true},
    Password: {type: String, required: true},
    Gender: {type: String, required: true},
    DOB: {type: Date, required: true},
    Mobile: {type: Number, required: true},
    Address: {type: String, required: true}
})

autoIncrement.initialize(mongoose.connection);
adminSchema.plugin(autoIncrement.plugin, 'admin')

const admin = mongoose.model('admin', adminSchema);

export default admin;