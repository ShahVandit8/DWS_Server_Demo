import Attendance from "../schema/attendance-schema.js";
import moment from "moment";

export const addAttendance = async (request, response) => {

    try {

        const { Attendance_date, Course_id, Attendance_data, Total_Student, Present_Student, Absent_Student, Day } = request.body;

        const newdate = moment(Attendance_date).format('yyyy-MM-DD')

        const check = await Attendance.find({ Course_id: Course_id, Attendance_date: newdate })

        if (check.length) {
            response.send({ status: 'error', message: "Attendance is already saved" });
            // response.status(401).json({ message: "Attendance is already saved" })
        }
        else {
            const newAttendance = new Attendance({ Attendance_date: newdate, Course_id, Attendance_data, Total_Student, Present_Student, Absent_Student, Day })
            const attendancedd = newAttendance.save()

            if (attendancedd) {
                response.send({ status: 'ok', attendancedd });
                // response.status(200).json(attendancedd)
            }
            else {
                response.send({ status: 'error1', message: "Attendance could not be saved" });
                // response.status(400).json({ message: "Attendance could not be saved" })
            }
        }

    }
    catch (err) {
        console.error(err)
    }

}

export const getAttendanceByDate = async (request, response) => {

    const { date } = request.body
    const newdate = moment(date).format('yyyy-MM-DD')

    try {
        const attendance = await Attendance.findOne({ Course_id: request.params.id, Attendance_date: newdate })
        if (attendance) {
            response.send({ status: 'ok', data: attendance });
        }
        else {
            response.send({ status: 'error', message: "Attendance not found" });
        }
    }
    catch (err) {
        response.send({ status: 'error', message: "Attendance not found" });
    }

}

export const getAttendanceByStudentId = async (request, response) => {

    const { student_id } = request.body

    try {
        const attendance = await Attendance.find({ Course_id: request.params.id, "Attendance_data.Student_id" : student_id })
        if (attendance) {
            response.send({ status: 'ok', data: attendance });
        }
        else {
            response.send({ status: 'error', message: "Attendance not found" });
        }
    }
    catch (err) {
        response.send({ status: 'error', message: "Attendance not found" });
    }

}

export const editAttendance = async (request, response) => {

    try {

        const { Attendance_date, Course_id, Attendance_data, Total_Student, Present_Student, Absent_Student, Day } = request.body;

        const newdate = moment(Attendance_date).format('yyyy-MM-DD')

        // console.log(newdate)
        // console.log(Course_id)
        // console.log(Attendance_data)
        // console.log(Total_Student)
        // console.log(Present_Student)
        // console.log(Absent_Student)
        // console.log(Day)

        const check = await Attendance.updateOne({ Course_id: Course_id, Attendance_date: newdate }, {Attendance_date, Course_id, Attendance_data, Total_Student, Present_Student, Absent_Student, Day})

        if (check) {
            response.send({ status: 'ok', message: "Attendance is Updated" });
            // response.status(401).json({ message: "Attendance is already saved" })
        }
        else {
            response.send({ status: 'error', message: "Attendance is not Updated" });
        }

    }
    catch (err) {
        console.error(err)
    }

}


export const getAttendanceListByDate = async (request, response) => {

    const { date } = request.body
    const newdate = moment(date).format('yyyy-MM-DD')

    try {
        const attendance = await Attendance.find({ Attendance_date: newdate })
        if (attendance) {
            response.send({ status: 'ok', data: attendance });
        }
        else {
            response.send({ status: 'error', message: "Attendance not found" });
        }
    }
    catch (err) {
        response.send({ status: 'error', message: "Attendance not found" });
    }

}
