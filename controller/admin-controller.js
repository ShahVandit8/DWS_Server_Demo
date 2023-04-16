import Admin from '../schema/admin-schema.js';
import jwt from 'jsonwebtoken';

export const addAdmin = async (request, response) => {

    try {
        const { Name, Email, Password, Gender, DOB, Mobile, Address } = request.body;
        const ProfileCover = request.file.filename;

        // console.log(Topics);
        if (!Name || !Email || !Password || !Gender || !DOB || !Mobile || !Address) {
            return response.status(422).json({ error: 'Please fill the required feilds' })
        }

        const adminalready = await Admin.find({ Name: Name })
        if (adminalready.length) {
            response.status(400).json({ message: 'Admin is already Regisgtered' });
        }
        else {
            const newAdmin = new Admin({ Name, ProfileCover, Email, Password, Gender, DOB, Mobile, Address })

            try {
                const AdminRegister = await newAdmin.save();

                if (AdminRegister) {
                    response.status(201).json({ message: 'Admin Registration successful' });
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


export const LoginAdmin = async (request, response) => {

    try {
        const { email, password } = request.body;

        if (!email || !password) {
            response.status(401).json({ error: "please fill data" })
        }

        const userlogin = await Admin.findOne({
            Email: email,
            Password: password
        })


        if (userlogin) {

            const token = jwt.sign({
                name: userlogin.Name,
                email: userlogin.Email,
                id: userlogin._id
            }, 'secret123')

            response.cookie("jwttokenadmin", token, {
                expires: new Date(Date.now() + 9999999),
                httpOnly: true
            })

            return response.status(200).json({ status: 'ok', admintoken: token, admin: userlogin });

            // return res.json({status: 'ok', userlogin: token })
        }
        else {
            return response.status(400).json({ message: 'Wrong Credentials' })
        }

    }
    catch (err) {
        console.error(err);
    }

}

export const getAdminById = async (request, response) => {
    try {
        const OneAdmin = await Admin.findById(request.params.id)
        response.status(200).json(OneAdmin);
    } catch (err) {
        response.status(404).json({ message: err.message })
    }
}

export const editAdmin = async (request, response) => {

    try {
        const { Name, Email, Gender, DOB, Mobile, Address } = request.body;

        if (request.file) {
            const ProfileCover = request.file.filename;

            const editAdmin = new Admin({ Name, ProfileCover, Email, Gender, DOB, Mobile, Address })

            try {
                const Adminedit = await Admin.updateOne({ _id: request.params.id }, editAdmin);

                if (Adminedit) {

                    const admindets = await Admin.findOne({ _id: request.params.id })

                    if (admindets) {

                        const token = jwt.sign({
                            name: admindets.Name,
                            email: admindets.Email,
                            id: admindets._id
                        }, 'secret123')

                        response.cookie("jwttokenadmin", token, {
                            expires: new Date(Date.now() + 9999999),
                            httpOnly: true
                        })

                        return response.status(200).json({ status: 'ok', admintoken: token, admin: admindets });
                        // response.status(201).json({ message: 'Admin Details Updated successfully' });
                    }
                }
            }
            catch (err) {
                    response.status(409).json({ message: err.message });
                }
            }
        else {

            const editAdmin = new Admin({ Name, Email, Gender, DOB, Mobile, Address })

            try {
                const Adminedit = await Admin.updateOne({ _id: request.params.id }, editAdmin);

                if (Adminedit) {

                    const admindets = await Admin.findOne({ _id: request.params.id })

                    if (admindets) {

                        const token = jwt.sign({
                            name: admindets.Name,
                            email: admindets.Email,
                            id: admindets._id
                        }, 'secret123')

                        response.cookie("jwttokenadmin", token, {
                            expires: new Date(Date.now() + 9999999),
                            httpOnly: true
                        })

                        return response.status(200).json({ status: 'ok', admintoken: token, admin: admindets });
                        // response.status(201).json({ message: 'Admin Details Updated successfully' });
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

export const editAdminPassword = async (request, response) => {

    try {
        const { oldpass, newpass } = request.body;

        const admindets = await Admin.findById({ _id: request.params.id })

        if (admindets.Password === oldpass) {
            const AdminPassUpdate = await Admin.updateOne({ _id: request.params.id }, { Password: newpass });
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