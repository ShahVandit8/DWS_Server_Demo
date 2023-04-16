import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

const resoursesSchema = mongoose.Schema({
    Course_id: {type: Number, required: true},
    File : {type: String, required: true},
    File_type : {type: String, required: true}
})

autoIncrement.initialize(mongoose.connection);
resoursesSchema.plugin(autoIncrement.plugin, 'resourses')

const Resources = mongoose.model('resourses', resoursesSchema);

export default Resources;