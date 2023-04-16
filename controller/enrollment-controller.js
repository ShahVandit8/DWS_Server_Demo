import Enrollment from "../schema/enrollment-schema.js";
import users from "../schema/user-schema.js";
import Courses from "../schema/course-schema.js";
import jwt from "jsonwebtoken";

export const makeEnrollment = async (request, response) => {

    const { Student_id, Course_id, Enrollment_date, Course_StartDate, Amount } = request.body

    const enrollment = new Enrollment({ Student_id, Course_id, Enrollment_date, Course_StartDate, Amount, Status: 'Active' })

    try {
        const result = await enrollment.save()

        const course = await Courses.findOne({ _id: Course_id })

        const studentcount = course.StudentCount
        const newcount = studentcount + 1
        const courseupdate = await Courses.updateOne({ _id: Course_id }, { StudentCount: newcount })

        const user = await users.findOne({ _id: Student_id })
        const courselist = user.Courses
        courselist.push({
            Course_id: Course_id,
            Enrollment_id: result._id,
            Enrollment_date: Enrollment_date,
            Course_StartDate: Course_StartDate,
            Status: 'Active'
        })

        const userupdate = await users.updateOne({ _id: Student_id }, { Courses: courselist })

        if (result || courseupdate || userupdate) {

            const userdets = await users.findOne({ _id: Student_id })

            if (userdets) {
                const token = jwt.sign({
                    name: userdets.Name,
                    email: userdets.Email,
                    id: userdets._id
                }, 'secret123')

                response.cookie("jwttoken", token, {
                    expires: new Date(Date.now() + 9999999),
                    httpOnly: true
                })

                return response.status(200).json({ status: 'ok', usertoken: token, user: userdets, enrollmentdetails: result });
                // response.status(200).json(result);
            }
        }

    } catch (err) {
        response.status(404).json({ message: err })
        console.log(err)
    }
}

export const getEnrollments = async (request, response) => {

    try {
        const enrollments = await Enrollment.find()
        response.status(200).json(enrollments)
    }
    catch (err) {
        response.status(404).json({ message: err.message })
    }

}

export const getEnrollmentsByCourseId = async (request, response) => {

    try {
        const enrollments = await Enrollment.find({ Course_id: Number(request.params.id) })
        response.status(200).json(enrollments)
    }
    catch (err) {
        response.status(404).json({ message: err.message })
    }

}

export const getEnrollmentsByMultipleCourse = async (request, response) => {

    try {
        const { array } = request.body
        const enrollments = await Enrollment.find({ Course_id: { "$in" : array } })
        response.status(200).json(enrollments)
    }
    catch (err) {
        response.status(404).json({ message: err.message })
    }

}

export const getActiveEnrollments = async (request, response) => {

    try {
        const enrollments = await Enrollment.find({ Status: 'Active' })
        response.status(200).json(enrollments)
    }
    catch (err) {
        response.status(404).json({ message: err.message })
    }

}

export const getRecentEnrollments = async (request, response) => {

    try {
        const enrollments = await Enrollment.find()
        const list = enrollments.reverse()
        response.status(200).json(list)
    }
    catch (err) {
        response.status(404).json({ message: err.message })
    }

}

export const getRevenue = async (request, response) => {

    try {
        const enrollments = await Enrollment.find()
        var totalrev = 0
        enrollments.map(item => {
            totalrev += item.Amount
        })
        response.status(200).json(totalrev);
    }
    catch (err) {
        response.status(404).json({ message: err.message })
    }

}

export const getRevenueCourseWise = async (request, response) => {

    try {
        const enrollments = await Enrollment.find({ Course_id: request.params.id })
        var totalrev = 0
        enrollments.map(item => {
            totalrev += item.Amount
        })
        response.status(200).json(totalrev);
    }
    catch (err) {
        response.status(404).json({ message: err.message })
    }

}

export const markEnrollmentAsPassedout = async (request, response) => {

    try {
        const enrollments = await Enrollment.updateOne({ _id: request.params.id }, { Status: 'Passed Out' })

        const update = await users.updateOne({ "Courses.Enrollment_id": Number(request.params.id) }, {$set: { "Courses.$.Status" : "Passed Out" }})

        if (update && enrollments) {
            response.status(200).json({ message: 'Enrollment updated successfully'})
        }

    }
    catch (err) {
        response.status(404).json({ message: err.message })
    }

}

export const markEnrollmentAsTerminated = async (request, response) => {

    try {
        const enrollments = await Enrollment.updateOne({ _id: request.params.id }, { Status: 'Terminated' })

        const update = await users.updateOne({ "Courses.Enrollment_id": Number(request.params.id) }, {$set: { "Courses.$.Status" : "Terminated" }})

        if (update && enrollments) {
            response.status(200).json({ message: 'Enrollment updated successfully'})
        }

    }
    catch (err) {
        response.status(404).json({ message: err.message })
    }

}

export const markEnrollmentAsActive = async (request, response) => {

    try {
        const enrollments = await Enrollment.updateOne({ _id: request.params.id }, { Status: 'Active' })

        const update = await users.updateOne({ "Courses.Enrollment_id": Number(request.params.id) }, {$set: { "Courses.$.Status" : "Active" }})

        if (update && enrollments) {
            response.status(200).json({ message: 'Enrollment updated successfully'})
        }

    }
    catch (err) {
        response.status(404).json({ message: err.message })
    }

}