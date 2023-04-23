import Instructor from '../schema/instructor-schema.js';
import courses from '../schema/course-schema.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

export const addInstructor = async (request, response) => {

    try {
        const { Name, Email, Password, Gender, DOB, Mobile, Address } = request.body;
        const ProfilePhoto = request.file.filename;
        const Status = 'Active'

        // console.log(Topics);
        if (!Name || !Email || !Password || !Gender || !DOB || !Mobile || !Address) {
            return response.status(422).json({ error: 'Please fill the required feilds' })
        }

        const instructoralready = await Instructor.find({ Name: Name })
        if (instructoralready.length) {
            response.status(400).json({ message: 'Instructor is already Regisgtered' });
        }
        else {
            const newInstructor = new Instructor({ Name, ProfilePhoto, Email, Password, Gender, DOB, Mobile, Address, Status })

            try {
                const InstructorRegister = await newInstructor.save();

                if (InstructorRegister) {
                    response.status(201).json({ message: 'Instructor Registration successful' });
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

export const LoginInstructor = async (request, response) => {

    try {
        const { email, password } = request.body;

        if (!email || !password) {
            response.status(401).json({ error: "please fill data" })
        }

        const login = await Instructor.findOne({
            Email: email,
            Password: password
        })


        if (login) {

            const token = jwt.sign({
                name: login.Name,
                email: login.Email,
                id: login._id
            }, 'secret123')

            response.cookie("jwttokeninstructor", token, {
                expires: new Date(Date.now() + 9999999),
                httpOnly: true
            })

            return response.send({ status: 'ok', instructortoken: token, instructor: login });

            // return res.json({status: 'ok', userlogin: token })
        }
        else {
            return response.send({ status: 'NA', message: 'Wrong Credentials' })
        }

    }
    catch (err) {
        console.error(err);
    }

}

export const getInstructorList = async (request, response) => {
    try {
        const instructorlist = await Instructor.find({ Status: 'Active' }).sort({ Name: 1 })
        response.status(200).json(instructorlist);
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}

export const getInstructorById = async (request, response) => {
    try {
        const instructor = await Instructor.findOne({ _id: request.params.id })
        response.status(200).json(instructor);
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}

export const editInstructor = async (request, response) => {

    try {
        const { Name, Email, Gender, Password, DOB, Mobile, Address, Courses } = request.body;

        const CoursesArray = JSON.parse(Courses)

        if (request.file) {
            console.log("File exists")
            const ProfilePhoto = request.file.filename;

            const editInstructor = new Instructor({ Name, ProfilePhoto, Email, Gender, Password, DOB, Mobile, Address, Courses: CoursesArray })

            try {
                const Instructoredit = await Instructor.updateOne({ _id: request.params.id }, editInstructor);

                if (Instructoredit) {

                    const instructor = await Instructor.find({ _id: request.params.id })

                    const courselist = instructor[0].Courses;

                    courselist.map(async item => {
                        const newInstructor = {
                            id: instructor[0]._id,
                            Name: instructor[0].Name,
                            ProfilePhoto: instructor[0].ProfilePhoto
                        }
                        const Instructoreditincourse = await courses.updateOne({ _id: item.id }, { Instructor: newInstructor });
                    })


                    response.status(201).json({ message: 'Instrcutor Details Updated successfully' });
                }
            }
            catch (err) {
                response.status(409).json({ message: err.message });
            }
        }
        else {
            console.log("File does not exist")

            const editInstructor = new Instructor({ Name, Email, Gender, Password, DOB, Mobile, Address, Courses: CoursesArray })

            try {
                const Instructoredit = await Instructor.updateOne({ _id: request.params.id }, editInstructor);

                if (Instructoredit) {

                    const instructor = await Instructor.find({ _id: request.params.id })

                    const courselist = instructor[0].Courses;

                    courselist.map(async item => {
                        const newInstructor = {
                            id: instructor[0]._id,
                            Name: instructor[0].Name,
                            ProfilePhoto: instructor[0].ProfilePhoto
                        }
                        const Instructoreditincourse = await courses.updateOne({ _id: item.id }, { Instructor: newInstructor });
                    })
                    response.status(201).json({ message: 'Instrcutor Details Updated successfully' });
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



export const editInstructorProfile = async (request, response) => {

    try {
        const { Name, Email, Gender, Password, DOB, Mobile, Address, Courses } = request.body;

        const CoursesArray = JSON.parse(Courses)

        if (request.file) {
            console.log("File exists")
            const ProfilePhoto = request.file.filename;

            const editInstructor = new Instructor({ Name, ProfilePhoto, Email, Gender, Password, DOB, Mobile, Address, Courses: CoursesArray })

            try {
                const Instructoredit = await Instructor.updateOne({ _id: request.params.id }, editInstructor);

                if (Instructoredit) {

                    const instructor = await Instructor.find({ _id: request.params.id })

                    const courselist = instructor[0].Courses;

                    courselist.map(async item => {
                        const newInstructor = {
                            id: instructor[0]._id,
                            Name: instructor[0].Name,
                            ProfilePhoto: instructor[0].ProfilePhoto
                        }
                        const Instructoreditincourse = await courses.updateOne({ _id: item.id }, { Instructor: newInstructor });
                    })

                    const token = jwt.sign({
                        name: instructor[0].Name,
                        email: instructor[0].Email,
                        id: instructor[0]._id
                    }, 'secret123')

                    response.cookie("jwttokenadmin", token, {
                        expires: new Date(Date.now() + 9999999),
                        httpOnly: true
                    })

                    return response.status(200).json({ status: 'ok', instructortoken: token, instructor: instructor[0] });

                    // response.status(201).json({ message: 'Instrcutor Details Updated successfully' });
                }
            }
            catch (err) {
                response.status(409).json({ message: err.message });
            }
        }
        else {
            console.log("File does not exist")

            const editInstructor = new Instructor({ Name, Email, Gender, Password, DOB, Mobile, Address, Courses: CoursesArray })

            try {
                const Instructoredit = await Instructor.updateOne({ _id: request.params.id }, editInstructor);

                if (Instructoredit) {

                    const instructor = await Instructor.find({ _id: request.params.id })

                    const courselist = instructor[0].Courses;

                    courselist.map(async item => {
                        const newInstructor = {
                            id: instructor[0]._id,
                            Name: instructor[0].Name,
                            ProfilePhoto: instructor[0].ProfilePhoto
                        }
                        const Instructoreditincourse = await courses.updateOne({ _id: item.id }, { Instructor: newInstructor });
                    })

                    const token = jwt.sign({
                        name: instructor[0].Name,
                        email: instructor[0].Email,
                        id: instructor[0]._id
                    }, 'secret123')

                    response.cookie("jwttokenadmin", token, {
                        expires: new Date(Date.now() + 9999999),
                        httpOnly: true
                    })

                    return response.status(200).json({ status: 'ok', instructortoken: token, instructor: instructor[0] });

                    // response.status(201).json({ message: 'Instrcutor Details Updated successfully' });
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

export const editInstructorPassword = async (request, response) => {

    try {
        const { oldpass, newpass } = request.body;

        const instructor = await Instructor.findById({ _id: request.params.id })

        if (instructor.Password === oldpass) {
            const InstructorPassUpdate = await Instructor.updateOne({ _id: request.params.id }, { Password: newpass });
            response.status(201).json({ message: 'Password Matched' });
        }
        else {
            response.status(409).json({ message: 'Password Not Matched' });
        }

    }
    catch (err) {
        console.error(err);
    }
}


export const getInstructorCount = async (request, response) => {
    try {
        const instructorcount = await Instructor.countDocuments({})
        response.status(200).json(instructorcount);
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}

export const addCourseInInstructor = async (request, response) => {

    try {
        const { Courses } = request.body;

        const CourseArray = JSON.parse(Courses)

        const courseininstructor = await Instructor.updateOne({ _id: request.params.id }, { Courses: CourseArray })

        if (courseininstructor) {
            response.status(201).json({ message: 'Instrcutor Details Updated successfully' });
        }
    }
    catch (err) {
        console.error(err);
    }
}


export const editInstructorStatus = async (request, response) => {

    try {
        console.log(request.params.id)
        const instructor = await Instructor.updateOne({ _id: request.params.id }, { Status : 'Inactive'})

        if (instructor) {          
            response.send({ status: 200, message: 'Instructor Updated successfully'})
        }
        else {
            response.status(409).json({ message: 'Instructor not updated' });
        }

    }
    catch (err) {
        console.error(err);
    }
}


export const ForgotPasswordINSAPI = async (request, response) => {
    try {
        const Email = request.params.id;
        const useralready = await Instructor.find({ Email: Email })
        dotenv.config();
        if (useralready.length) {

            const date = new Date();
            let time = date.getTime();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAILJS_USERNAME,
                    pass: process.env.EMAILJS_PASSWORD
                }
            });

            const options = {
                // from : "78degreescafe@gmail.com",
                from: "thedigitalworkstation@gmail.com",
                to: Email,
                subject: "Forgot Password - Recovery",
                text: `Your Change Password Link is ${process.env.FRONT_END_URL}/change-password/instructor/${time}/${useralready[0]._id} Note : This link is only valid for 5 minutes.`
            }

            transporter.sendMail(options, (err, info) => {
                if (err) {
                    console.log(err);
                    return;
                }
            })
            response.status(200).json({ message: "The email is sent" });

        }
        else {
            response.status(404).json({ message: "This email is not valid" });
        }
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}


export const changePasswordINS = async (request, response) => {

    try {
        const { newpass } = request.body;

        const userdets = await Instructor.updateOne({ _id: request.params.id }, { Password: newpass })

        if (userdets) {

            return response.status(200).json({ status: 'ok', message: 'Password Change Successfully' });
        }
        else {
            response.status(201).json({ status: 'NA', message: 'Error while changing password' });
        }

    }
    catch (err) {
        console.error(err);
    }
}