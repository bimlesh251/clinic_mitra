import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({

    clinicId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Clinic",

        required: true,

        index: true

    },

    doctorId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Doctor",

        required: true,

        index: true

    },

    patientName: {

        type: String,

        required: true

    },

    patientPhone: {

        type: String,

        required: true,

        index: true

    },

    age: Number,

    appointmentDate: {

        type: Date,

        required: true,

        index: true

    },
    appointmentNumber: {

        type: String,

        required: true,

        unique: true,

        index: true

    },
    slotTime: {

        type: String,

        required: true

    },

    status: {

        type: String,

        enum: [

            "BOOKED",

            "CANCELLED",

            "COMPLETED",

            "NO_SHOW"

        ],

        default: "BOOKED"

    },

    remarks: String

}, {

    timestamps: true

});

appointmentSchema.index({

    clinicId: 1,

    doctorId: 1,

    appointmentDate: 1,

    slotTime: 1

});

export default mongoose.model(
    "Appointment",
    appointmentSchema
);