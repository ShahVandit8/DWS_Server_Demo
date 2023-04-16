import mongoose from 'mongoose';


const Connection = async (username, password) => {

    const URL = `mongodb+srv://${username}:${password}@cluster0.m9kkcg0.mongodb.net/demo?retryWrites=true&w=majority`

    try {
        await mongoose.connect(URL, {useUnifiedTopology : true, useNewUrlParser : true})
        console.log("Database connection established")
    }
    catch (err) {
        console.error("Error while connecting to database ",err)
    }
}

export default Connection;