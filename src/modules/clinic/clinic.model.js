import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(

    {

        clinicId: {
            type: String,
            unique: true,
            default: () => crypto.randomUUID()
        },
        
        clinicName: {

            type: String,

            required: true,

            trim: true

        },

        clinicCode: {

            type: String,

            required: true,

            unique: true,

        },

        phoneNumberId: {

            type: String,

            required: true,

            unique: true

        },

        displayPhoneNumber: {

            type: String,

            required: true

        },

        address: {

            type: String,

            default: ""

        },

        email: {

            type: String,

            default: ""

        },

        timezone: {

            type: String,

            default: "Asia/Kolkata"

        },

        defaultLanguage: {

            type: String,

            default: "en"

        },

        slotDuration: {

            type: Number,

            default: 30

        },

        bookingWindowDays: {

            type: Number,

            default: 7

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

export default mongoose.model("Clinic", clinicSchema);