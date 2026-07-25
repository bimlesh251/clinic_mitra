import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
            index: true
        },

        doctorCode: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        specialization: {
            type: String,
            default: ""
        },

        consultationFee: {
            type: Number,
            default: 0
        },

        slotDuration: {
            type: Number,
            default: 30
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Doctor", doctorSchema);