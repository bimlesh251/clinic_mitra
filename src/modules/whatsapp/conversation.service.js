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
    startBooking,
    saveName,
    saveAge,
    saveDoctor,
    saveDate,
    saveTime,
    confirmAppointment
} from "./appointment.service.js";

import { sendTextMessage } from "./whatsapp.service.js";

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

    context.message = context.message.trim().toLowerCase();

    const {
        clinic,
        sender,
        message
    } = context;

    console.log("==================================");
    console.log("Clinic :", clinic.clinicName);
    console.log("Sender :", sender);
    console.log("Message:", message);

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
                    "main"
                );

            case ACTIONS.HINDI:

                return await sendTextMessage(

                    sender,

                    "🚧 Hindi language will be available soon."

                );

            default:
                return await sendTextMessage(
                    sender,
                    "Please select a language."

                );

        }

    }

    //------------------------------------------------------------
    // Main Menu
    //------------------------------------------------------------

    if (context.session.state === STATES.MAIN_MENU) {

        switch (message) {
            case ACTIONS.BOOK_APPOINTMENT:

                return await startBooking(context);
            case ACTIONS.MY_APPOINTMENT:

                return await sendTextMessage(
                    sender,
                    "🚧 My Appointment feature is under development."
                );

            case ACTIONS.CANCEL_APPOINTMENT:
                return await sendTextMessage(
                    sender,
                    "🚧 Cancel Appointment feature is under development."
                );

            case ACTIONS.CALL_CLINIC:

                return await sendTextMessage(

                    sender,

                    "📞 +91-9876543210"

                );

            case ACTIONS.CLINIC_LOCATION:

                return await sendTextMessage(

                    sender,

                    "📍 Clinic location will be shared soon."

                );

            default:

                return await sendTextMessage(

                    sender,

                    "Please choose an option from the menu."

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

                    sender,

                    "Please enter a valid age."

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

                        sender,

                        "Please select Confirm or Reschedule."

                    );

            }

        default:

            return await sendTextMessage(

                sender,

                "Type *Hi* to start a new conversation."

            );

    }

};
