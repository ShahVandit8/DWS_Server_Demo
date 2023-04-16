import Messages from "../schema/messages-schema.js";

export const createMessage = async (request, response) => {

    try {
        const { Name, Email, Subject, Message } = request.body;

        const message = new Messages({ Name, Email, Subject, Message })

        const create = await message.save();

        if (create) {
            response.send({ status: 200, data: create });
        }
    }
    catch (err) {
        response.send({ status: 400, error: err })
    }

}

export const getMessages = async (request, response) => {

    try {
        const messages = await Messages.find()

        if (messages) [
            response.send({ status: 200, data: messages })
        ]
    }
    catch (err) {
        response.send({ status: 400, error: err })
    }
}

export const getMessageById = async (request, response) => {

    try {
        const messages = await Messages.findOne({ _id: request.params.id })

        if (messages) [
            response.send({ status: 200, data: messages })
        ]
    }
    catch (err) {
        response.send({ status: 400, error: err })
    }
}

export const deleteMessage = async (request, response) => {

    try {
        const delete_message = await Messages.deleteOne({ _id: request.params.id })

        if (delete_message) [
            response.send({ status: 200, message: 'Message Deleted Successfully' })
        ]
    }
    catch (err) {
        response.send({ status: 400, error: err })
    }
}

export const checkMessageByEmail = async (request, response) => {

    try {
        const { Email } = request.body;
        const message_exist = await Messages.find({ Email: Email })

        if (message_exist.length) {
            response.send({ status: 200, message: 'Email Exist' })
        }
        else {
            response.send({ status: 201, message: "Email not found" })
        }
    }
    catch (err) {
        response.send({ status: 400, error: err })
    }
}