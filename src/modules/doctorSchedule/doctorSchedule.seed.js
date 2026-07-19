import mongoose from "mongoose";
import config from "../../../configuration.js";

import Clinic from "../clinic/clinic.model.js";
import Doctor from "../doctor/doctor.model.js";
import DoctorSchedule from "./doctorSchedule.model.js";

const seedDoctorSchedules = async () => {

    try {

        await mongoose.connect(config.MONGO_URL);

        console.log("Mongo Connected");

        const clinic = await Clinic.findOne({clinicCode: "raj"});

        if (!clinic) {

            console.log("Clinic not found");
            process.exit();

        }

        const doctors = await Doctor.find({

            clinicId: clinic._id,

            isActive: true

        });

        if (!doctors.length) {

            console.log("No doctors found");
            process.exit();

        }

        await DoctorSchedule.deleteMany({

            clinicId: clinic._id

        });

        const schedules = [];

        for (const doctor of doctors) {

            // Monday
            schedules.push({

                clinicId: clinic._id,

                doctorId: doctor._id,

                weekday: 1,

                slotDuration: doctor.slotDuration,

                sessions: [

                    {
                        startTime: "09:00",
                        endTime: "13:00"
                    },
                    {
                        startTime: "14:00",
                        endTime: "18:00"
                    }

                ]

            });

            // Tuesday
            schedules.push({

                clinicId: clinic._id,

                doctorId: doctor._id,

                weekday: 2,

                slotDuration: doctor.slotDuration,

                sessions: [

                    {
                        startTime: "10:00",
                        endTime: "16:00"
                    }

                ]

            });

            // Wednesday
            schedules.push({

                clinicId: clinic._id,

                doctorId: doctor._id,

                weekday: 3,

                slotDuration: doctor.slotDuration,

                sessions: [

                    {
                        startTime: "09:00",
                        endTime: "13:00"
                    },
                    {
                        startTime: "14:00",
                        endTime: "18:00"
                    }

                ]

            });

            // Thursday
            schedules.push({

                clinicId: clinic._id,

                doctorId: doctor._id,

                weekday: 4,

                slotDuration: doctor.slotDuration,

                sessions: [

                    {
                        startTime: "09:00",
                        endTime: "18:00"
                    }

                ]

            });

            // Friday
            schedules.push({

                clinicId: clinic._id,

                doctorId: doctor._id,

                weekday: 5,

                slotDuration: doctor.slotDuration,

                sessions: [

                    {
                        startTime: "09:00",
                        endTime: "17:00"
                    }

                ]

            });

        }

        await DoctorSchedule.insertMany(schedules);

        console.log(`${schedules.length} schedules inserted`);

        process.exit();

    }
    catch (err) {

        console.log(err);

        process.exit();

    }

};

seedDoctorSchedules();