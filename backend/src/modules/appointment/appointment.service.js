import * as repository from "./appointment.repository.js";

export const createAppointment = async (appointment) => {
    return await repository.create(appointment);
};


export const getUpcomingAppointments = async ( clinicId, patientPhone) => {
    return repository.findUpcomingAppointments(
        clinicId,
        patientPhone
    );
};

export const getAppointment = async (appointmentId) => {
    return await repository.findById(appointmentId);

};

export const cancelmyAppointment = async (appointmentId) => {
    return await repository.cancelAppointment(appointmentId);

};

