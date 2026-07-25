import * as doctorRepository from "./doctor.repository.js";

export const getDoctors = async (clinicId) => {
    return await doctorRepository.findByClinic(clinicId);
};

export const getDoctorById = async (clinicId,doctorCode) => {
    return await doctorRepository.findByDoctorCode(clinicId,doctorCode);

};