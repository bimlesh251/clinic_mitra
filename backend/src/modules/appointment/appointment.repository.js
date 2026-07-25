import Appointment from "./appointment.model.js";

export const create = async (payload) => {

    return await Appointment.create(payload);

};

export const findBookedSlot = async (

    clinicId,

    doctorId,

    appointmentDate,

    slotTime

) => {

    return await Appointment.findOne({

        clinicId,

        doctorId,

        appointmentDate,

        slotTime,

        status: "BOOKED"

    });

};

export const findAppointments = async (

    clinicId,

    patientPhone

) => {

    return await Appointment.find({

        clinicId,

        patientPhone,

        status: "BOOKED"

    }).sort({

        appointmentDate: 1

    });

};


export const findUpcomingAppointments = async (

    clinicId,

    patientPhone

) => {

    const today = new Date();

    today.setHours(0,0,0,0);

    return Appointment.find({

        clinicId,

        patientPhone,

        appointmentDate: {

            $gte: today

        },

        status: "BOOKED"

    })

    .populate("doctorId","name")

    .sort({

        appointmentDate:1,

        slotTime:1

    });

};

export const findById = async (appointmentId) => {
    return await Appointment.findById(appointmentId)
        .populate("doctorId");
};

export const cancelAppointment = async (appointmentId) => {
    return await Appointment.findByIdAndUpdate(appointmentId,
        {status: "CANCELLED"},
        {new: true}
    );
};