import { STATES } from "./states.js";

const sessions = {};

const getSessionKey = (phone, clinic) => {

    return `${clinic.phoneNumberId}:${phone}`;

};

export const createSession = (phone, clinic) => {

    const key = getSessionKey(phone, clinic);

    //Set this object to new Map session variable
    
    sessions[key] = {

        clinicId: clinic._id,

        clinicCode: clinic.clinicCode,

        language: clinic.defaultLanguage,

        state: STATES.LANGUAGE,

        appointment: {

            patientName: "",

            age: null,

            doctor: null,

            date: null,

            time: null

        }

    };

};

export const getSession = (phone, clinic) => {

    const key = getSessionKey(phone, clinic);

    return sessions[key];

};

export const updateSession = (phone, clinic, updates) => {

    const key = getSessionKey(phone, clinic);

    // console.log("Updating Session");
    // console.log("Key:", key);

    // console.log("Before");
    // console.log(sessions[key]);

    sessions[key] = {
        ...sessions[key],
        ...updates
    };

    // console.log("After");
    // console.log(sessions[key]);

};

export const clearSession = (phone, clinic) => {

    const key = getSessionKey(phone, clinic);

    delete sessions[key];

};