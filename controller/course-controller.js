import Courses from '../schema/course-schema.js';
import instructor from '../schema/instructor-schema.js';

export const addCourse = async (request, response) => {

    try {
        const { Name, Category, ShortDescription, Level, Modules, LongDescription, Price, SellingPrice, Instructor, Duration, StartDate, Timings } = request.body;
        const CoverImage = request.file.filename;
        const ModuleArray = JSON.parse(Modules)
        const InstructorOBJ = JSON.parse(Instructor)
        const StudentCount = 0
        const Rating = 0
        const RatingList = []
        const RatingOutOf = 0
        const Completion = 0
        const Status = 'Active'

        // console.log(Topics);
        if (!Name || !Category || !ShortDescription || !Level || !LongDescription || !Price || !SellingPrice || !Duration || !StartDate || !Timings) {
            return response.status(422).json({ error: 'Please fill the required feilds' })
        }

        const CourseAlreadyExists = await Courses.find({ Name: Name })
        if (CourseAlreadyExists.length) {
            response.status(400).json({ message: 'Course is already Regisgtered' });
        }
        else {
            const newCourse = new Courses({ Name, CoverImage, Category, ShortDescription, StudentCount, Rating, RatingList, RatingOutOf, Level, Modules: ModuleArray, LongDescription, Price, SellingPrice, Instructor: InstructorOBJ, Duration, StartDate, Timings, Completion, Status })



            try {
                const CourserRegister = await newCourse.save();

                if (CourserRegister) {

                    const coursedetails = await Courses.find({ Name: Name })
                    const instructor1 = await instructor.find({ _id: InstructorOBJ.id })

                    const courselist = instructor1[0].Courses;
                    console.log(courselist);
                    courselist.push({
                        id: coursedetails[0]._id,
                        Name: coursedetails[0].Name,
                        CoverImage: coursedetails[0].CoverImage,
                    })

                    console.log(courselist)

                    const editcourselist = new instructor({ Courses: courselist })

                    const instructorupdate = await instructor.updateOne({ _id: InstructorOBJ.id }, editcourselist)
                    response.status(201).json(instructorupdate);
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

export const getCourseList = async (request, response) => {
    try {
        const courselist = await Courses.find({}).sort({ Title: 1 })
        response.status(200).json(courselist);
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}

export const getITCourseList = async (request, response) => {
    try {
        const courselist = await Courses.find({ Category: 'Information Technology', Status: 'Active' }).sort({ Title: 1 })
        response.status(200).json(courselist);
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}

export const getMultimediaCourseList = async (request, response) => {
    try {
        const courselist = await Courses.find({ Category: 'Multimedia' }).sort({ Title: 1 })
        response.status(200).json(courselist);
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}

export const getCourseById = async (request, response) => {
    try {
        const Onecourse = await Courses.findOne({ _id: request.params.id })
        response.status(200).json(Onecourse);
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}

export const getCourseListByInstructorId = async (request, response) => {
    try {
        const courselist = await Courses.find({ "Instructor.id": Number(request.params.id) })
        response.status(200).json(courselist);
    } catch (err) {
        console.log(err)
        response.status(404).json({ message: err.message })
    }
}

export const getActiveCourse = async (request, response) => {
    try {
        const courselist = await Courses.find({ Status: 'Active' })
        response.status(200).json(courselist);
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}

export const getInactiveCourse = async (request, response) => {
    try {
        const courselist = await Courses.find({ Status: 'Inactive' })
        response.status(200).json(courselist);
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}

export const getCourseCount = async (request, response) => {
    try {
        const coursecount = await Courses.countDocuments({})
        response.status(200).json(coursecount);
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}


export const editCourseDetails = async (request, response) => {
    try {
        const { Name, Category, ShortDescription, Level, Modules, LongDescription, Price, SellingPrice, Instructor, Duration, StartDate, Timings } = request.body;
        const ModuleArray = JSON.parse(Modules)
        const InstructorOBJ = JSON.parse(Instructor)

        if (request.file) {
            const CoverImage = request.file.filename;
            // const courseedit = new Courses({ Name, CoverImage, Category, ShortDescription, Level, Modules: ModuleArray, LongDescription, Price, SellingPrice, Instructor: InstructorOBJ, Duration, StartDate, Timings })

            try {
                const editcourse = await Courses.updateOne({ _id: request.params.id }, { Name, CoverImage, Category, ShortDescription, Level, Modules: ModuleArray, LongDescription, Price, SellingPrice, Instructor: InstructorOBJ, Duration, StartDate, Timings })

                console.log(editcourse)

                if (editcourse) {
                    const coursedets = await Courses.findOne({ _id: request.params.id })

                    const instructordets = await instructor.findOne({ Instructor: { id: coursedets.Instructor.id } })

                    const courselist = instructordets.Courses

                    const currentcoursedata = courselist.filter((item) => item.id != request.params.id)

                    currentcoursedata.push({
                        id: coursedets._id,
                        Name: coursedets.Name,
                        CoverImage: coursedets.CoverImage,
                    })

                    const editcourselist = new instructor({ Courses: currentcoursedata })
                    const instructorupdate = await instructor.updateOne({ _id: coursedets.Instructor.id }, editcourselist)

                    if(instructorupdate) {
                        response.status(200).json({ message: "Course Details Updated Successfully" })
                    }
                }
            }
            catch (err) {
                response.status(405).json({ message: err.message })
            }
        }
        else {

            const courseedit = new Courses({ Name, Category, ShortDescription, Level, Modules: ModuleArray, LongDescription, Price, SellingPrice, Instructor: InstructorOBJ, Duration, StartDate, Timings })

            try {
                const editcourse = await Courses.updateOne({ _id: request.params.id }, courseedit)

                if (editcourse) {

                    const coursedets = await Courses.findOne({ _id: request.params.id })

                    const instructordets = await instructor.findOne({ Instructor: { id: coursedets.Instructor.id } })

                    const courselist = instructordets.Courses

                    const currentcoursedata = courselist.filter((item) => item.id != request.params.id)

                    currentcoursedata.push({
                        id: coursedets._id,
                        Name: coursedets.Name,
                        CoverImage: coursedets.CoverImage,
                    })

                    const editcourselist = new instructor({ Courses: currentcoursedata })
                    const instructorupdate = await instructor.updateOne({ _id: coursedets.Instructor.id }, editcourselist)

                    if(instructorupdate) {
                        response.status(200).json({ message: "Course Details Updated Successfully" })
                    }
                    
                }
            }
            catch (err) {
                response.status(405).json({ message: err.message })
            }
        }

    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}

export const editCourseByModuleStatus = async (request, response) => {

    try {
        // const { Title, CourseType, Instructor, Timing, Days, Duration, SkillLevel, Language, Price, Description, Topics, NextBatch, Status } = request.body;
        const { Completion, Modules } = request.body;

        const editCourseTopic = new Courses({ Modules, Completion })

        try {
            const Courseedit = await Courses.updateOne({ _id: request.params.id }, editCourseTopic);

            if (Courseedit) {
                response.status(201).json({ message: 'Course Updated successful' });
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

export const editCourseInstructor = async (request, response) => {

    try {
        const { Instructor } = request.body;

        try {
            const oldcoursedets = await Courses.findOne({ _id: request.params.id })
            const Courseedit = await Courses.updateOne({ _id: request.params.id }, { Instructor: Instructor });

            if (Courseedit) {

                const instructordets = await instructor.find({ _id: oldcoursedets.Instructor.id })
                const courselist = instructordets[0].Courses;
                const newcourselist = courselist.filter((item) => item.id != request.params.id)
                console.log(newcourselist)

                const instructorupdate = await instructor.updateOne({ _id: oldcoursedets.Instructor.id }, { Courses: newcourselist })

                if (instructorupdate) {
                    const coursedetails = await Courses.find({ _id: request.params.id })

                    const instructor1 = await instructor.find({ _id: Instructor.id })

                    const courselist = instructor1[0].Courses;
                    console.log(courselist);
                    courselist.push({
                        id: coursedetails[0]._id,
                        Name: coursedetails[0].Name,
                        CoverImage: coursedetails[0].CoverImage,
                    })

                    console.log(courselist)

                    const editcourselist = new instructor({ Courses: courselist })

                    const instructorupdate = await instructor.updateOne({ _id: Instructor.id }, editcourselist)

                    if (instructorupdate) {
                        response.status(201).json(instructorupdate);
                    }

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


export const changeCourseStatus = async (request, response) => {

    try {
        const course = await Courses.find({ _id: request.params.id })

        const courseStatus = course[0].Status

        if (courseStatus === 'Active') {
            const courseupdate = await Courses.updateOne({ _id: request.params.id }, { Status: 'Inactive' })
            response.status(200).json({ message: 'Course Status updated to Inactive' });
        }
        else if (courseStatus === 'Inactive') {
            const courseupdate = await Courses.updateOne({ _id: request.params.id }, { Status: 'Active' })
            response.status(200).json({ message: 'Course Status updated to Active' });
        }

    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}


