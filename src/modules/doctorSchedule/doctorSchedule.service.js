import * as repository from "./doctorSchedule.repository.js";
import {generateSlots} from "../../common/slot.utils.js";


export const getDoctorSchedule = async (clinicId,doctorId,weekday,appointmentDate) => {
    return await repository.findSchedule(clinicId,doctorId,weekday,appointmentDate);
};

export const getAvailableSlots = async (clinicId,doctorId,appointmentDate) => {

    const weekday = appointmentDate.getDay();
    const schedule = await repository.findSchedule(clinicId,doctorId,weekday,appointmentDate);
    
    if (!schedule) {
        return [];
    }

    return generateSlots(
        schedule.sessions,
        schedule.slotDuration
    );

};