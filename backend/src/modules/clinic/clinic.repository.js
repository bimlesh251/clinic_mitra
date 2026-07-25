import Clinic from "./clinic.model.js";

export const findByPhoneNumberId = async (phoneNumberId) => {

    return await Clinic.findOne({

        phoneNumberId,

        isActive: true

    });

};

export const findById = async (id) => {

    return await Clinic.findById(id);

};

export const createClinic = async (data) => {

    return await Clinic.create(data);

};

export const getAllClinics = async () => {

    return await Clinic.find({

        isActive: true

    });

};