import users from "../schema/user-schema.js";
import jwt from 'jsonwebtoken';
import fs from 'file-system'
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

export const registerUser = async (request, response) => {

    try {
        const { Name, Email, Password } = request.body;

        if (!Name || !Email || !Password) {
            return response.status(422).json({ error: 'Please fill the required feilds' })
        }

        const userallready = await users.find({ Email: Email })
        if (userallready.length) {
            response.status(400).json({ message: 'User is already Regisgtered' });
        }

        else {
            const ProfilePicture = 'profile.jpg';
            const Gender = '';
            const Contact = 0;
            const DOB = '';
            const Address = '';

            const newUser = new users({ Name, Email, Password, ProfilePicture, Gender, Contact, DOB, Address });

            try {
                const UserRegister = await newUser.save();

                if (UserRegister) {

                    const inserteduser = await users.findOne({ _id: UserRegister._id })

                    if (inserteduser) {
                        const token = jwt.sign({
                            name: inserteduser.Name,
                            email: inserteduser.Email,
                            id: inserteduser._id
                        }, 'secret123')

                        response.cookie("jwttoken", token, {
                            expires: new Date(Date.now() + 9999999),
                            httpOnly: true
                        })

                        return response.status(200).json({ status: 'User Registration successful', usertoken: token, user: inserteduser });
                    }
                }
            }
            catch (err) {
                response.status(409).json({ message: err.message });
            }
        }
    }
    catch (err) {
        console.error(err);
    }
}

export const loginUser = async (request, response) => {

    try {
        const { Email, Password } = request.body;

        if (!Email || !Password) {
            response.status(401).json({ error: "please fill data" })
        }

        console.log(Email)
        console.log(Password)

        const userloged = await users.findOne({
            Email: Email,
            Password: Password
        })


        if (userloged) {
            const token = jwt.sign({
                name: userloged.Name,
                email: userloged.Email,
                id: userloged._id
            }, 'secret123')

            response.cookie("jwttoken", token, {
                expires: new Date(Date.now() + 9999999),
                httpOnly: true
            })

            return response.status(200).json({ status: 'ok', usertoken: token, user: userloged });
        }
        else {
            return response.status(201).json({ status: 'NA', message: 'Wrong Credentials' })
        }
    }
    catch (err) {
        console.error(err);
    }

}

export const editBasicDetailsUser = async (request, response) => {

    try {
        const { Name, Email, Gender, DOB, Contact, Address, Courses } = request.body;

        const edituserbasicdetails = new users({ Name, Email, Gender, DOB, Contact, Address, Courses })

        try {
            const UserEdited = await users.updateOne({ _id: request.params.id }, edituserbasicdetails);

            if (UserEdited) {
                const userdetails = await users.findOne({ _id: request.params.id })

                if (userdetails) {
                    const token = jwt.sign({
                        name: userdetails.Name,
                        email: userdetails.Email,
                        id: userdetails._id
                    }, 'secret123')

                    response.cookie("jwttoken", token, {
                        expires: new Date(Date.now() + 9999999),
                        httpOnly: true
                    })

                    return response.status(200).json({ status: 'ok', usertoken: token, user: userdetails });
                }
                else {
                    response.status(408).json({ message: 'error' });

                }
            }
        }
        catch (err) {
            response.status(409).json({ message: err.message });
        }

    }
    catch (err) {
        console.error(err);
    }
}

export const editPhotoUser = async (request, response) => {

    try {
        const ProfilePicture = request.file.filename;

        const olddata = await users.findOne({ _id: request.params.id })
        const path = 'public/images/' + olddata.ProfilePicture

        if (path != 'public/images/profile.jpg') {
            fs.unlink(path, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }

        // const edituserphoto = new users({ ProfilePicture })

        try {
            const UserEdited = await users.updateOne({ _id: request.params.id }, {ProfilePicture} );

            if (UserEdited) {
                const userdetails = await users.findOne({ _id: request.params.id })

                if (userdetails) {
                    const token = jwt.sign({
                        name: userdetails.Name,
                        email: userdetails.Email,
                        id: userdetails._id
                    }, 'secret123')

                    response.cookie("jwttoken", token, {
                        expires: new Date(Date.now() + 9999999),
                        httpOnly: true
                    })

                    return response.status(200).json({ status: 'ok', usertoken: token, user: userdetails });
                }
                else {
                    response.status(408).json({ message: 'error' });

                }
            }
        }
        catch (err) {
            response.status(409).json({ message: err.message });
        }

    }
    catch (err) {
        console.error(err);
    }
}

export const editAccountSecurity = async (request, response) => {

    try {
        const { oldpass, newpass } = request.body;

        const userdets = await users.findById({ _id: request.params.id })

        if (userdets.Password === oldpass) {
            const UserPassUpdate = await users.updateOne({ _id: request.params.id }, { Password: newpass });

            if (UserPassUpdate) {
                const userdetails = await users.findOne({ _id: request.params.id })

                if (userdetails) {
                    const token = jwt.sign({
                        name: userdetails.Name,
                        email: userdetails.Email,
                        id: userdetails._id
                    }, 'secret123')

                    response.cookie("jwttoken", token, {
                        expires: new Date(Date.now() + 9999999),
                        httpOnly: true
                    })

                    return response.status(200).json({ status: 'ok', usertoken: token, user: userdetails });
                }
                else {
                    response.status(408).json({ message: 'error' });

                }
            }
        }
        else {
            response.status(409).json({ message: 'Password Not Matched' });
        }

    }
    catch (err) {
        console.error(err);
    }
}

export const editWholeUser = async (request, response) => {

    try {

        const { Name, Email, Password, Gender, DOB, Contact, Address, Courses } = request.body;
        const CourseList = JSON.parse(Courses)

        if (request.file) {

            const olddata = await users.findOne({ Email: Email })
            const path = 'public/images/' + olddata.ProfilePicture

            if (path != 'public/images/profile.jpg') {
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            }

            const ProfilePicture = request.file.filename;

            const edituserbasicdetails = new users({ Name, ProfilePicture, Email, Password, Gender, DOB, Contact, Address, Courses: CourseList })

            try {
                const UserEdited = await users.updateOne({ _id: request.params.id }, edituserbasicdetails);

                if (UserEdited) {

                    return response.status(200).json({ status: 'ok', message: 'User Edited Successfully' });
                }
                else {
                    response.status(408).json({ message: 'error' });

                }
            }
            catch (err) {
                response.status(407).json({ message: 'error' });
            }


        }
        else {
            const edituserbasicdetails = new users({ Name, Email, Password, Gender, DOB, Contact, Address, Courses: CourseList })

            try {
                const UserEdited = await users.updateOne({ _id: request.params.id }, edituserbasicdetails);

                if (UserEdited) {

                    return response.status(200).json({ status: 'ok', message: 'User Edited Successfully' });
                }
                else {
                    response.status(408).json({ message: 'error' });

                }
            }
            catch (err) {
                response.status(407).json({ message: 'error' });
            }
        }

    }
    catch (err) {
        response.status(409).json({ message: err.message });
    }

}



export const getUsers = async (request, response) => {

    try {
        const userlist = await users.find({ Courses: { $exists: true, $eq: [] } })
        response.status(200).json(userlist);
    }
    catch (err) {
        console.error(err);
    }
}

export const getStudent = async (request, response) => {

    try {
        const userlist = await users.find({ Courses: { $exists: true, $ne: [] } })
        response.status(200).json(userlist);
    }
    catch (err) {
        console.error(err);
    }
}

export const getStudentMultipleCourses = async (request, response) => {

    try {
        // console.log(request.body)
        const { array } = request.body
        // console.log(array)
        const userlist = await users.find({ Courses: { $elemMatch: { Course_id: { "$in": array } } } })
        // console.log(userlist)
        response.status(200).json(userlist);
    }
    catch (err) {
        console.error(err);
    }
}

export const getUserById = async (request, response) => {
    try {
        const user = await users.findById({ _id: request.params.id })
        response.status(200).json(user);
    }
    catch (err) {
        console.error(err);
    }
}


export const onCourseEnrollment = async (request, response) => {

    try {
        const { courses } = request.body;

        const userdets = await users.updateOne({ _id: request.params.id }, { Courses: courses })



        if (userdets.Password === oldpass) {
            const UserPassUpdate = await users.updateOne({ _id: request.params.id }, { Password: newpass });

            if (UserPassUpdate) {
                const userdetails = await users.findOne({ _id: request.params.id })

                if (userdetails) {
                    const token = jwt.sign({
                        name: userdetails.Name,
                        email: userdetails.Email,
                        id: userdetails._id
                    }, 'secret123')

                    response.cookie("jwttoken", token, {
                        expires: new Date(Date.now() + 9999999),
                        httpOnly: true
                    })

                    return response.status(200).json({ status: 'ok', usertoken: token, user: userdetails });
                }
                else {
                    response.status(408).json({ message: 'error' });

                }
            }
        }
        else {
            response.status(409).json({ message: 'Password Not Matched' });
        }

    }
    catch (err) {
        console.error(err);
    }
}


export const getStudentListForCourse = async (request, response) => {
    try {
        const studentlist = await users.find({ Courses: { $elemMatch: { Course_id: Number(request.params.id), Status: 'Active' } } })
        response.status(200).json(studentlist);
    }
    catch (err) {
        console.error(err);
    }
}

export const getAllStudentListForCourse = async (request, response) => {
    try {
        const studentlist = await users.find({ Courses: { $elemMatch: { Course_id: Number(request.params.id) } } })
        response.status(200).json(studentlist);
    }
    catch (err) {
        console.error(err);
    }
}


export const ForgotPasswordAPI = async (request, response) => {
    try{
        const Email = request.params.id;
        const useralready = await users.find({ Email: Email })
        dotenv.config();
        if(useralready.length){

            const transporter = nodemailer.createTransport({
                service : 'gmail',
                auth: {
                    user: process.env.EMAILJS_USERNAME,
                    pass: process.env.EMAILJS_PASSWORD
                }
            });

            const options = {
                // from : "78degreescafe@gmail.com",
                from : "thedigitalworkstation@gmail.com",
                to : Email, 
                subject : "Forgot Password - Recovery",
                text : `Your Password is ${useralready.map(item => (item.Password))}`
            }

            transporter.sendMail(options, (err,info) => {
                if(err) {
                    console.log(err);
                    return;
                }
            })
            response.status(200).json({ message: "The email is sent"}); 

        }
        else{
            response.status(404).json({ message: "This email is not valid"}); 
        }
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}