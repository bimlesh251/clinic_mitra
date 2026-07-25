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
        appointmentPrefix: {

            type: String,

            default: "RAJ"

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
        clinicPhone: {
            type: String,
            required: true
        },
        whatsapp: {

            phoneNumberId: String,

            accessToken: String,

            verifyToken: String,

            displayPhoneNumber: String,

            businessAccountId: String

        },
        welcomeMessage: {

            en: String,

            hi: String,

        },
        address: {

            line1: String,

            line2: String,

            city: String,

            state: String,

            pincode: String

        },

        location: {

            latitude: Number,

            longitude: Number

        },

        email: {

            type: String,

            default: ""

        },

        timezone: {

            type: String,

            default: "Asia/Kolkata"

        },

        workingHours: {

            monday: String,

            tuesday: String,

            wednesday: String,

            thursday: String,

            friday: String,

            saturday: String,

            sunday: String

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