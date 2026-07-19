import { STATES } from "./states.js";
import { sendTextMessage, sendButtonMessage } from "./whatsapp.service.js";
import {showDoctorList, showDateList, showSlotList} from "./menu.helper.js"
import { getSession, clearSession, updateSession } from "./session.service.js";
import { getDoctors, getDoctorById } from "../doctor/doctor.service.js";
import {ACTIONS } from "./constants.js"
import { getAvailableSlots } from "../doctorSchedule/doctorSchedule.service.js";

export const askName = async (phone) => {
    return await sendTextMessage(
        phone,
        "👤 Please enter your full name."
    );
};

export const saveName = async (context) => {
    const {sender, clinic, message, session} = context;
    session.appointment.patientName = message;
    updateSession(
        sender,
        clinic,
        {
            state: STATES.ASK_AGE,
            appointment: session.appointment
        }
    );

    return sendTextMessage(sender, "Please enter your age.");

};
export const saveAge = async (context) => {
    const {sender, clinic, message, session} = context;
    session.appointment.age = message;
    updateSession(sender,clinic,
        {
            state: STATES.SELECT_DOCTOR,
            appointment: session.appointment
        }
    );
    const doctors = await getDoctors(context.clinic._id);
    return showDoctorList(sender, doctors);

};
export const saveDoctor = async (context) => {
    const {sender, clinic, message, session} = context;
    

    const doctor = await getDoctorById(context.clinic._id,message);
    session.appointment.doctorId = doctor.doctorCode;
    session.appointment.doctorName = doctor.name;
    session.appointment.doctor = {
        id: doctor._id,
        code: doctor.doctorCode,
        // doctorCode: doctor.doctorCode,
        name: doctor.name,
        specialization: doctor.specialization
    };

    updateSession(sender, clinic, {
        state: STATES.SELECT_DATE,
        appointment: session.appointment

    });

    return showDateList(sender, clinic);

};

export const saveDate = async (context) => {
    const {sender, clinic, message, session} = context;
    session.appointment.date = message;
    updateSession(sender, clinic, {
        state: STATES.SELECT_TIME,
        appointment: session.appointment
    });

    console.log("session.appointment ", session.appointment)

    const slots = await getAvailableSlots(
        clinic._id,
        session.appointment.doctor.id,
        new Date(message)
    );

    console.log("slots == ", slots)

    return showSlotList(
        sender,
        slots
    );

};

export const saveTime = async (context) => {
    const {sender, clinic, message, session} = context;
    
    session.appointment.time = message;
    updateSession(sender, clinic, {
        state: STATES.PREVIEW,
        appointment: session.appointment
    });
    return showAppointmentPreview(sender);
};

export const showAppointmentPreview = async (context) => {
    const {sender, clinic, session} = context;
    const appointment = session.appointment;

    const message = `
        📋 Appointment Summary

        👤 Name : ${appointment.patientName}

        🎂 Age : ${appointment.age}

        👨‍⚕️ Doctor : ${appointment.doctor.name}

        📅 Date : ${appointment.date}

        🕒 Time : ${appointment.time}
    `;

    return sendButtonMessage(

        sender,

        message,

        [

            {
                id: ACTIONS.CONFIRM,
                title: "Confirm"
            },

            {
                id: ACTIONS.RESCHEDULE,
                title: "Reschedule"
            }

        ]

    );

};

export const confirmAppointment = async (context) => {
    const {sender, clinic, session} = context;
    
    const appointment = session.appointment;

    const message = `
        ✅ Appointment Booked Successfully

        Patient : ${appointment.patientName}

        Doctor : ${appointment.doctorName}

        Date : ${appointment.date}

        Time : ${appointment.time}

        Appointment ID : TEMP-${Date.now()}
        `;

    clearSession(sender, clinic);

    return sendTextMessage(sender,message);

};

export const startBooking = async (context) => {
    const { sender, clinic } = context;
    
    updateSession(sender, clinic, {

        state: STATES.ASK_NAME,

        appointment: {

            patientName: "",

            age: "",

            doctorId: "",

            doctorName: "",

            date: "",

            time: ""

        }

    });
    
    return await askName(sender);

};