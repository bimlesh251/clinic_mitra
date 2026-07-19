import { ACTIONS } from "./constants.js"

export const MENUS = {
  
  language: {

    body: "👋 Welcome to *Test Clinic Bot*.\n\nPlease choose your language.",

    rows: [

      {

        id: ACTIONS.ENGLISH,

        title: "English"

      },

      {

        id: ACTIONS.HINDI,

        title: "हिन्दी"

      }

    ]

  },

  main: {

    body: "How can I help you today?",

    button: "Choose Option",

    rows: [

      {

        id: ACTIONS.BOOK_APPOINTMENT,

        title: "Book Appointment"

      },

      {

        id: ACTIONS.MY_APPOINTMENT,

        title: "My Appointment"

      },

      {

        id: ACTIONS.CANCEL_APPOINTMENT,

        title: "Cancel Appointment"

      },

      {

        id: ACTIONS.CALL_CLINIC,

        title: "Call Clinic"

      },

      {

        id: ACTIONS.CLINIC_LOCATION,

        title: "Clinic Location"

      }

    ]

  }

};