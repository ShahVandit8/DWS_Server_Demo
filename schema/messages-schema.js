import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

const messagesSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Email : {type: String, required: true},
    Subject : {type: String, required: true},
    Message : {type: String, required: true},
})

autoIncrement.initialize(mongoose.connection);
messagesSchema.plugin(autoIncrement.plugin, 'messages')

const Messages = mongoose.model('messages', messagesSchema);

export default Messages;