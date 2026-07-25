import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    }

}, {
    _id: false
});

const doctorScheduleSchema = new mongoose.Schema({

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

    weekday: {

        type: Number,

        required: true

    },

    sessions: {

        type: [sessionSchema],

        default: []

    },

    slotDuration: {

        type: Number,

        default: 30

    },

    effectiveFrom: {

        type: Date,

        default: Date.now

    },

    effectiveTo: {

        type: Date,

        default: null

    },

    isActive: {

        type: Boolean,

        default: true

    }

}, {

    timestamps: true

});

doctorScheduleSchema.index({

    clinicId: 1,

    doctorId: 1,

    weekday: 1,

    effectiveFrom: -1

});

export default mongoose.model(
    "DoctorSchedule",
    doctorScheduleSchema
);