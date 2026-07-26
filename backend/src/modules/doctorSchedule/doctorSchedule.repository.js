import DoctorSchedule from "./doctorSchedule.model.js";

export const findByDoctor = async (

    clinicId,

    doctorId

) => {

    return await DoctorSchedule.find({

        clinicId,

        doctorId,

        isActive: true

    }).sort({

        weekday: 1

    });

};

export const findSchedule = async (clinicId,doctorId,weekday,appointmentDate) => {
    const result = await DoctorSchedule.findOne({clinicId:clinicId,doctorId:doctorId,weekday:weekday,isActive: true

        // effectiveFrom: {
        //     $lte: appointmentDate
        // },
        // $or: [

        //     {
        //         effectiveTo: null
        //     },

        //     {

        //         effectiveTo: {
        //             $gte: appointmentDate
        //         }

        //     }

        // ]

    });
    if(appointmentDate){
        console.log(appointmentDate)
    }

    return result

};

export const create = async (payload) => {

    return await DoctorSchedule.create(payload);

};