import { ACTIONS } from "./constants.js";
import { STATES } from "./states.js";

import {
    createSession,
    getSession,
    updateSession,
    clearSession
} from "./session.service.js";

import {
    showButtonMenu,
    showMenu
} from "./menu.helper.js";

import {
    startBooking, saveName, saveAge, saveDoctor, saveDate, saveTime, confirmAppointment,
    showAppointments, showAppointmentDetails, cancelAppointment, showClinicLocation, showClinicDetails
} from "./appointment.service.js";

import { sendTextMessage } from "./whatsapp.service.js";
import counterModel from "../counter/counter.model.js";

const GLOBAL_COMMANDS = [
    "hi",
    "hello",
    "hey",
    "menu"
];

export const handleMessage = async (context) => {

    //------------------------------------------------------------
    // Normalize Message
    //------------------------------------------------------------
    context.data = context.message;
    context.message = context.message.trim().toLowerCase();

    const {
        clinic,
        sender,
        message,
    } = context;

    // console.log("Clinic :", clinic.clinicName);
    // console.log("Sender :", sender);
    // console.log("Message:", message);

    if (message.startsWith("appointment_")) {
        return await showAppointmentDetails(context);

    }

    //------------------------------------------------------
    // Cancel Appointment
    //------------------------------------------------------

    if (message.startsWith("cancel_")) {
        return await cancelAppointment(context);

    }

    //------------------------------------------------------------
    // Create Session
    //------------------------------------------------------------

    let session = getSession(sender, clinic);
    if (!session) {

        createSession(sender, clinic);

        session = getSession(sender, clinic);

    }

    context.session = session;

    //------------------------------------------------------------
    // Global Commands
    //------------------------------------------------------------

    if (GLOBAL_COMMANDS.includes(message)) {

        clearSession(sender, clinic);
        context.session = getSession(sender, clinic);

        return await showButtonMenu(
            sender,
            clinic,
            "language"
        );

    }

    //------------------------------------------------------------
    // Language Selection
    //------------------------------------------------------------

    if (context.session.state === STATES.LANGUAGE) {
        switch (message) {
            case ACTIONS.ENGLISH:
                updateSession(sender, clinic, {
                    language: "en",
                    state: STATES.MAIN_MENU
                });

                context.session = getSession(sender, clinic);
                return await showMenu(
                    sender,
                    "main",
                    clinic
                );

            case ACTIONS.HINDI:

                return await sendTextMessage(
                    {
                        sender,

                        text: "🚧 हिंदी भाषा जल्द ही उपलब्ध होगी।",
                        clinic
                    }

                );

            default:
                return await sendTextMessage(
                    {
                        sender,
                        text: "Please select a language.",
                        clinic
                    }
                );

        }

    }

    //------------------------------------------------------------
    // Main Menu
    //------------------------------------------------------------

    if (context.session.state === STATES.MAIN_MENU) {

        switch (message) {
            case ACTIONS.BOOK_APPOINTMENT:
                console.log("I am in book appointment")
                return await startBooking(context);
            case ACTIONS.MY_APPOINTMENT:
                return await showAppointments(context);
            case ACTIONS.CLINIC_ADDRESS:
                return await showClinicDetails(context);
            case ACTIONS.CLINIC_LOCATION:
                return await showClinicLocation(context);

            default:

                return await sendTextMessage(
                    {
                        sender,
                        text: "Please choose an option from the menu.",
                        clinic:context.clinic
                    }

                );

        }

    }

    //------------------------------------------------------------
    // Refresh Session
    //------------------------------------------------------------

    context.session = getSession(sender, clinic);

    //------------------------------------------------------------
    // Conversation State Router
    //------------------------------------------------------------


    switch (context.session.state) {

        case STATES.ASK_NAME:

            return await saveName(context);

        case STATES.ASK_AGE:

            if (isNaN(message)) {

                return await sendTextMessage(
                    {
                        sender,
                        text: "Please enter a valid age.",
                        clinic
                    }
                );

            }

            context.message = Number(message);

            return await saveAge(context);

        case STATES.SELECT_DOCTOR:

            return await saveDoctor(context);

        case STATES.SELECT_DATE:

            return await saveDate(context);

        case STATES.SELECT_TIME:

            return await saveTime(context);

        case STATES.PREVIEW:

            switch (message) {

                case ACTIONS.CONFIRM:

                    return await confirmAppointment(context);

                case ACTIONS.RESCHEDULE:

                    return await startBooking(context);

                default:

                    return await sendTextMessage(
                        {
                            sender,
                            text: "Please select Confirm or Reschedule.",
                            clinic
                        }

                    );

            }

        default:

            return await sendTextMessage(

                {
                sender,
                text:"Type *Hi* to start a new conversation.",
                clinic
                }

            );

    }



};
