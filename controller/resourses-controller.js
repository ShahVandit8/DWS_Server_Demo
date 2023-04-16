import Resources from "../schema/resources-schema.js";
import fs from 'file-system'

export const addFile = async (request, response) => {

    try{
        const { Course_id, File_type} = request.body;
        const File = request.file.filename

        const resource  = new Resources({Course_id, File, File_type}) 

        const insert = resource.save()

        if(insert) {
            response.send({ status: 200, message: 'File added successfully', data: insert})
        }
        else {
            response.send({ status: 401, message: 'File not added'})
        }
    }
    catch(err){
        response.send({ status: 402, message: 'Error'})
    }
}


export const getFilesByCourse = async (request, response) => {

    try{
        const FilesData = await Resources.find({Course_id: request.params.id})

        if(FilesData){
            response.send({ status: 200, message: 'Data found', data: FilesData})
        }
        else {
            response.send({ status: 404, message: 'Data not found'})
        }
    }
    catch(err){
        response.send({ status: 400, message: 'Error'})
    }

}

export const getFilesByMultiCourse = async (request, response) => {

    try{
        const { array } = request.body
        const FilesData = await Resources.find({Course_id: { "$in" : array } })

        if(FilesData){
            response.send({ status: 200, message: 'Data found', data: FilesData})
        }
        else {
            response.send({ status: 404, message: 'Data not found'})
        }
    }
    catch(err){
        response.send({ status: 400, message: 'Error'})
    }

}

export const getFiles = async (request, response) => {

    try{
        const FilesData = await Resources.find()

        if(FilesData){
            response.send({ status: 200, message: 'Data found', data: FilesData})
        }
        else {
            response.send({ status: 404, message: 'Data not found'})
        }
    }
    catch(err){
        response.send({ status: 400, message: 'Error'})
    }

}


export const deleteFile = async (request, response) => {

    try{

        const files = await Resources.findOne({_id: request.params.id})
        console.log(files)

        const path = 'public/files/courses/'+files.File
        console.log(path)

        fs.unlink(path, (err) => {
            if (err) {
              console.error(err)
              return
            }

          })

          const deletefile = await Resources.deleteOne({_id: request.params.id})

          if(deletefile){
            response.send({ status: 200, message: "File deleted succesfully"})
          }
          else {
            response.send({ status: 404, message: "File not deleted"})
          }

    }
    catch(err){
        response.send({ status: 400, message: 'Error'})
    }

}