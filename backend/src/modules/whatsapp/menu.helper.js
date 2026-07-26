import { MENUS } from "./menu.config.js";
import { getAvailableDates, formatISODate, formatWhatsappDate } from "../../common/date.utils.js";
import { sendListMessage, sendButtonMessage, sendTextMessage } from "./whatsapp.service.js";



export const showMenu = async (sender, menuName, clinic) => {

  const menu = MENUS[menuName];

  if (!menu) {
    console.log(`Menu '${menuName}' not found`);
    return;
  }
  return await sendListMessage(
    {
      sender,
      text: menu.body,
      buttonText: menu.button,
      rows: menu.rows,
      clinic
    }
  );
};

export const showButtonMenu = async (sender, clinic, menuName) => {

  const menu = MENUS[menuName];

  if (!menu) {
    console.log(`Menu '${menuName}' not found`);
    return;
  }
  return await sendButtonMessage(
    {
      sender,
      text: clinic.welcomeMessage.en,
      buttons: menu.rows,
      clinic
    }
  );
};

export const showBackMenu = async (sender) => {

  return await sendButtonMessage(
    sender,
    "Choose an option",
    [
      {
        id: "menu",
        title: "Main Menu"
      }
    ]
  );

};

export const showDateList = async (sender, clinic) => {
  const dates = getAvailableDates(clinic);

  const rows = dates.map(date => ({
    id: formatISODate(date),
    title: formatWhatsappDate(date)
  }));

  return sendListMessage(
    {
      sender,
      text: "📅 Select Appointment Date",
      buttonText: "Choose Date",
      rows,
      clinic
    }
  );
};

export const showSlotList = async (

  sender,

  slots,
  clinic

) => {

  if (!slots.length) {

    return sendTextMessage(
      {
      sender,

      text:"❌ No slots available for this date.",
      clinic
      }

    );

  }

  const rows = slots.map(slot => ({

    id: slot.value,

    title: slot.label

  }));

  return sendListMessage(
    {
    sender,

    text: "🕒 Select Time",

    buttonText: "Choose Slot",

    rows,
    clinic
    }

  );

};

export const showDoctorList = async (
  sender,
  doctors,
  clinic
) => {

  const rows = doctors.map(doc => ({

    id: doc.doctorCode,

    title: doc.name,

    description: doc.specialization

  }));

  return await sendListMessage(
    {
    sender,
    text:"👨‍⚕️ Please select a doctor.",
    buttonText: "Choose Doctor",
    rows,
    clinic
    }

  );

};