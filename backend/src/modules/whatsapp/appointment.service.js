import { STATES } from "./states.js";
import { sendTextMessage, sendButtonMessage, sendListMessage, sendLocationMessage } from "./whatsapp.service.js";
import { showDoctorList, showDateList, showSlotList } from "./menu.helper.js"
import { getSession, clearSession, updateSession } from "./session.service.js";
import { getDoctors, getDoctorById } from "../doctor/doctor.service.js";
import { ACTIONS } from "./constants.js"
import { getAvailableSlots } from "../doctorSchedule/doctorSchedule.service.js";
import { createAppointment, getUpcomingAppointments, getAppointment, cancelmyAppointment } from "../appointment/appointment.service.js"
import { generateAppointmentNumber } from "../counter/counter.service.js";

export const askName = async (context) => {
    const { sender, clinic, message, data, session } = context;
    return await sendTextMessage(
        {
            sender,
            text: "👤 Please enter your full name.",
            clinic
        }
    );
};

export const saveName = async (context) => {
    const { sender, clinic, message, data, session } = context;
    session.appointment.patientName = data;
    updateSession(
        sender,
        clinic,
        {
            state: STATES.ASK_AGE,
            appointment: session.appointment
        }
    );

    return sendTextMessage({ sender, text: "Please enter your age.", clinic });

};
export const saveAge = async (context) => {
    const { sender, clinic, message, data, session } = context;
    session.appointment.age = data;
    updateSession(sender, clinic,
        {
            state: STATES.SELECT_DOCTOR,
            appointment: session.appointment
        }
    );
    const doctors = await getDoctors(context.clinic._id);
    return showDoctorList(sender, doctors, clinic);

};
export const saveDoctor = async (context) => {
    const { sender, clinic, message, session } = context;


    const doctor = await getDoctorById(context.clinic._id, message);
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
    const { sender, clinic, message, session } = context;
    session.appointment.date = message;
    updateSession(sender, clinic, {
        state: STATES.SELECT_TIME,
        appointment: session.appointment
    });

    const slots = await getAvailableSlots(
        clinic._id,
        session.appointment.doctor.id,
        new Date(message)
    );
    return showSlotList(
        sender,
        slots,
        clinic
    );

};

export const saveTime = async (context) => {
    const { sender, clinic, message, session } = context;
    session.appointment.time = message;
    updateSession(sender, clinic, {
        state: STATES.PREVIEW,
        appointment: session.appointment
    });

    return showAppointmentPreview(context);
};

export const showAppointmentPreview = async (context) => {
    const { sender, clinic } = context;

    const session = getSession(sender, clinic);

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
        {
        sender,

        text:message,

        buttons:[

            {
                id: ACTIONS.CONFIRM,
                title: "Confirm"
            },

            {
                id: ACTIONS.RESCHEDULE,
                title: "Reschedule"
            }

        ],
        clinic

    }

    );

};

export const confirmAppointment = async (context) => {
    const { sender, clinic, session } = context;
    const appointmentNumber = await generateAppointmentNumber(clinic.appointmentPrefix, session.appointment.date);

    const payload = {
        appointmentNumber,
        clinicId: clinic._id,
        doctorId: session.appointment.doctor.id,
        patientName: session.appointment.patientName,
        patientPhone: sender,
        age: session.appointment.age,
        appointmentDate: new Date(session.appointment.date),
        slotTime: session.appointment.time
    };

    const appointment = await createAppointment(payload);


    const message = `
        ✅ Appointment Booked Successfully

        👤 Name : ${session.appointment.patientName}

        👨‍⚕️ Doctor :  ${session.appointment.doctorName}

        📅 Date : ${session.appointment.date}

        🕒 Time : ${session.appointment.time}

        📋 Appointment ID : ${appointment.appointmentNumber}
        `;

    clearSession(sender, clinic);

      return await sendButtonMessage(
        {
        sender,

        text:message,

        buttons:[

            {

                id: ACTIONS.BACK_TO_MENU,

                title: "Main Menu"

            }

        ],
        clinic
        }

    );

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

    return await askName(context);

};

export const showAppointments = async (context) => {

    const { clinic, sender } = context;

    const appointments = await getUpcomingAppointments(
        clinic._id,
        sender
    );

    if (!appointments.length) {

        return await sendTextMessage(
            {
                sender,
                text: "📅 You don't have any upcoming appointments.",
                clinic
            }
        );

    }

    const rows = appointments.map((appointment) => ({

        id: `appointment_${appointment._id}`,

        title: appointment.appointmentNumber,

        description: `${appointment.doctorId.name} | ${appointment.slotTime}`

    }));

    return await sendListMessage(
        {
        sender,

        text:"📅 Your Upcoming Appointments\n\nPlease select an appointment.",

        buttonText:"View Appointment",

        rows,
        clinic
        }

    );

};

export const showAppointmentDetails = async (context) => {
    const { sender, message, clinic } = context;
    const appointmentId = message.replace(ACTIONS.VIEW_APPOINTMENT, "");
    const appointment = await getAppointment(appointmentId);

    if (!appointment) {
        return await sendTextMessage(
            {
                sender,
                text: "Appointment not found.",
                clinic
            }
        );

    }

    const body = `
        📋 Appointment Details

        🆔 ${appointment.appointmentNumber}

        👨‍⚕️ Doctor
        ${appointment.doctorId.name}

        👤 Patient
        ${appointment.patientName}

        📅 Date
        ${appointment.appointmentDate.toLocaleDateString("en-IN")}

        🕒 Time
        ${appointment.slotTime}

        📌 Status
        ${appointment.status}
        `;

    return await sendButtonMessage(
        {
        sender,

        text:body,

        buttons:[

            {

                id: `cancel_${appointment._id}`,

                title: "Cancel"

            },

            {

                id: ACTIONS.BACK_TO_MENU,

                title: "Main Menu"

            }

        ],
        clinic
        }

    );

};

export const cancelAppointment = async (context) => {

    const { sender, message, clinic } = context;
    const appointmentId = message.replace("cancel_", "");

    const appointment = await cancelmyAppointment(appointmentId);

    if (!appointment) {
        return await sendTextMessage(
            {
                sender,
                text: "Unable to cancel appointment.",
                clinic
            }
        );
    }

   

    const body = `✅ Appointment Cancelled Successfully
    Appointment ID:  ${appointment.appointmentNumber}, `;


    return await sendButtonMessage(
        {
        sender,

        text:body,

        buttons:[

            {

                id: ACTIONS.BACK_TO_MENU,

                title: "Main Menu"

            }

        ],
        clinic
        }

    );

};

export const showClinicDetails = async (context) => {

    const { clinic, sender } = context;

    const message = `
🏥 *${clinic.clinicName}*

📍 Address

${clinic.address.line1}
${clinic.address.line2}

${clinic.address.city}, ${clinic.address.state} - ${clinic.address.pincode}

☎️ Reception

${clinic.clinicPhone}

📧 Email

${clinic.email}

🕘 Working Hours

Mon - Fri : ${clinic.workingHours.monday}

Saturday : ${clinic.workingHours.saturday}

Sunday : ${clinic.workingHours.sunday}
`;

    

    return await sendButtonMessage(
        {
        sender,

        text:message,

        buttons:[

            {

                id: ACTIONS.BACK_TO_MENU,

                title: "Main Menu"

            }

        ],
        clinic
        }
    );
};

export const showClinicLocation = async (context) => {
    return await sendLocationMessage(context);

};