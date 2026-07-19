import { MENUS } from "./menu.config.js";
import { getAvailableDates, formatISODate, formatWhatsappDate } from "../../common/date.utils.js";
import { sendListMessage, sendButtonMessage } from "./whatsapp.service.js";



export const showMenu = async (phone, menuName) => {

  const menu = MENUS[menuName];

  if (!menu) {
    console.log(`Menu '${menuName}' not found`);
    return;
  }
  return await sendListMessage(
    phone,
    menu.body,
    menu.button,
    menu.rows
  );
};

export const showButtonMenu = async (phone, menuName) => {

  const menu = MENUS[menuName];

  if (!menu) {
    console.log(`Menu '${menuName}' not found`);
    return;
  }
  return await sendButtonMessage(
    phone,
    menu.body,
    menu.rows
  );
};

export const showBackMenu = async (phone) => {

  return await sendButtonMessage(
    phone,
    "Choose an option",
    [
      {
        id: "menu",
        title: "Main Menu"
      }
    ]
  );

};

export const showDateList = async (phone,clinic) => {
    const dates = getAvailableDates(clinic);

    const rows = dates.map(date => ({
        id: formatISODate(date),
        title: formatWhatsappDate(date)
    }));

    return sendListMessage(
        phone,
        "📅 Select Appointment Date",
        "Choose Date",
        rows
    );
};

// export const showSlotList = async (phone) => {

//     const rows = getAvailableSlots();

//     return sendListMessage(

//         phone,

//         "Please select a time.",

//         "Available Slots",

//         rows

//     );

// };

export const showSlotList = async (

    phone,

    slots

) => {

    if (!slots.length) {

        return sendTextMessage(

            phone,

            "❌ No slots available for this date."

        );

    }

    const rows = slots.map(slot => ({

        id: slot.value,

        title: slot.label

    }));

    return sendListMessage(

        phone,

        "🕒 Select Time",

        "Choose Slot",

        rows

    );

};

export const showDoctorList = async (
    phone,
    doctors
) => {

    const rows = doctors.map(doc => ({

        id: doc.doctorCode,

        title: doc.name,

        description: doc.specialization

    }));

    return await sendListMessage(

        phone,

        "👨‍⚕️ Please select a doctor.",

        "Choose Doctor",

        rows

    );

};





