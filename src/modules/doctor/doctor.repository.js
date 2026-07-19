import Doctor from "./doctor.model.js";

export const findByClinic = async (clinicId) => {

    return await Doctor.find({clinicId,isActive: true})
    .sort({name: 1});

};

export const findByDoctorCode = async (clinicId,doctorCode) => {
    return await Doctor.findOne({clinicId,doctorCode,isActive: true});
};

export const findById = async (id) => {

    return await Doctor.findById(id);

};