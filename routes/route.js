import express  from "express";
import multer from "multer"

import { registerUser, loginUser, editBasicDetailsUser, editPhotoUser, editAccountSecurity, getUsers, getUserById, getStudent, getStudentListForCourse, getAllStudentListForCourse, editWholeUser, getStudentMultipleCourses, ForgotPasswordAPI } from "../controller/user-controller.js";
import { LoginAdmin, getAdminById, editAdmin, editAdminPassword } from "../controller/admin-controller.js";
import { addCourse, getCourseList, getITCourseList, getCourseById, getCourseListByInstructorId, getActiveCourse, getInactiveCourse, getCourseCount, editCourseDetails, editCourseByModuleStatus, editCourseInstructor, getMultimediaCourseList, changeCourseStatus, getCourseByIdList } from "../controller/course-controller.js";
import { LoginInstructor, addInstructor, getInstructorList, getInstructorById, editInstructor, editInstructorProfile, getInstructorCount, addCourseInInstructor, editInstructorPassword, editInstructorStatus} from "../controller/instructor-controller.js";
import { makeEnrollment, getEnrollments, getActiveEnrollments, getEnrollmentsByMultipleCourse, getRecentEnrollments, getRevenue, getRevenueCourseWise, markEnrollmentAsPassedout, markEnrollmentAsTerminated, markEnrollmentAsActive, getEnrollmentsByCourseId } from "../controller/enrollment-controller.js";
import { addAttendance, getAttendanceByDate, editAttendance, getAttendanceListByDate, getAttendanceByStudentId } from "../controller/attendance-controller.js";
import { addFile, getFilesByCourse, deleteFile, getFiles, getFilesByMultiCourse } from "../controller/resourses-controller.js";
import { checkMessageByEmail, createMessage, deleteMessage, getMessageById, getMessages } from "../controller/message-controller.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '_' + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  const filestorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/files/courses')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '_' + file.originalname)
    }
  })
  
  const fileupload = multer({ storage: filestorage })

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/edituserbasicdetails/:id', editBasicDetailsUser);
router.post('/editwholeuser/:id', upload.single("ProfilePicture"), editWholeUser);
router.post('/edituserphoto/:id', upload.single("ProfilePicture"), editPhotoUser);
router.post('/edituserpassword/:id', editAccountSecurity);
router.get('/allusers', getUsers);
router.get('/userdetails/:id', getUserById);
router.get('/all-student', getStudent);
router.post('/all-student-courses', getStudentMultipleCourses);
router.get('/students-list/:id', getStudentListForCourse);
router.get('/all-students-list/:id', getAllStudentListForCourse);



router.post('/login-admin', LoginAdmin);
router.get('/admin/:id', getAdminById);
router.post('/edit-admin/:id',upload.single("ProfileCover"), editAdmin);
router.post('/updatepass/:id' , editAdminPassword);


router.post('/addcourse',upload.single("CoverImage"), addCourse);
router.get('/coursedetail/:id', getCourseById);
router.post('/courses-detail', getCourseByIdList);
router.get('/allcourses', getCourseList);
router.get('/courses-instructor/:id', getCourseListByInstructorId);
router.get('/it-courses', getITCourseList);
router.get('/multimedia-courses', getMultimediaCourseList);
router.get('/active-courses', getActiveCourse);
router.get('/inactive-courses', getInactiveCourse);
router.get('/coursecount', getCourseCount);
router.post('/editcourse/:id',upload.single("CoverImage"), editCourseDetails);
router.post('/editcoursemodulesstatus/:id', editCourseByModuleStatus);
router.post('/editcourseinstructor/:id', editCourseInstructor);
router.get('/editcoursestatus/:id', changeCourseStatus);


router.post('/login-instructor', LoginInstructor);
router.post('/addinstructor',upload.single("ProfilePhoto"), addInstructor);
router.get('/allinstructors', getInstructorList);
router.get('/instructor/:id', getInstructorById);
router.post('/editinstructor/:id',upload.single("ProfilePhoto"), editInstructor);
router.post('/editinstructor/profile/:id',upload.single("ProfilePhoto"), editInstructorProfile);
router.get('/instructorcount', getInstructorCount);
router.post('/editinstructorcourse/:id', addCourseInInstructor);
router.post('/update-instructor-pass/:id' , editInstructorPassword);
router.get('/update-instructor-status/:id' , editInstructorStatus);



router.post('/add-enrollment', makeEnrollment);
router.get('/all-enrollments', getEnrollments);
router.get('/all-enrollments/:id', getEnrollmentsByCourseId);
router.post('/all-enrollments-courses', getEnrollmentsByMultipleCourse);
router.get('/active-enrollments', getActiveEnrollments);
router.get('/recent-enrollments', getRecentEnrollments);
router.get('/total-revenue', getRevenue);
router.get('/revenue/:id', getRevenueCourseWise);
router.get('/enrollment-update/passedout/:id', markEnrollmentAsPassedout)
router.get('/enrollment-update/terminated/:id', markEnrollmentAsTerminated)
router.get('/enrollment-update/active/:id', markEnrollmentAsActive)

router.post('/add-attendance', addAttendance);
router.post('/attendance-bydate/:id', getAttendanceByDate)
router.post('/attendance-bystudent/:id', getAttendanceByStudentId)
router.post('/edit-attendance', editAttendance)
router.post('/date-attendance', getAttendanceListByDate)


router.post('/add-file', fileupload.single("File"), addFile)
router.get('/get-files/:id', getFilesByCourse)
router.post('/get-files-courses', getFilesByMultiCourse)
router.get('/delete-file/:id', deleteFile)
router.get('/get-all-files', getFiles)


router.post('/create-message', createMessage)
router.get('/messages', getMessages)
router.get('/message/:id', getMessageById)
router.get('/delete-message/:id', deleteMessage)
router.post('/check-message', checkMessageByEmail)

router.get('/forget-password/:id', ForgotPasswordAPI)


export default router;
