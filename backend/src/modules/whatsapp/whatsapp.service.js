import axios from "axios";

const sendRequest = async (payload, clinic) => {
  try {
    const BASE_URL = `https://graph.facebook.com/v23.0/${clinic.whatsapp.phoneNumberId}/messages`;
    console.log("base URL", BASE_URL)
    const headers = {
      Authorization: `Bearer ${clinic.whatsapp.accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      BASE_URL,
      payload,
      { headers }
    );

    // console.log(response.status);
    // console.log(response.data);

    return response.data;

  } catch (err) {

    console.error(err.response?.data || err.message);

  }

};

export const sendTextMessage = (payload) => {

  // phone, text
  const { sender, text, clinic } = payload

  return sendRequest({

    messaging_product: "whatsapp",

    to: sender,

    type: "text",

    text: {
      body: text,
    },

  }, clinic);

};

export const sendButtonMessage = (payload) => {
  const { sender, text, buttons, clinic } = payload
  
  return sendRequest({

    messaging_product: "whatsapp",

    recipient_type: "individual",

    to: sender,

    type: "interactive",

    interactive: {

      type: "button",

      body: {
        text: text,
      },

      action: {

        buttons: buttons.map(button => ({

          type: "reply",

          reply: button,

        })),

      },

    },

  }, clinic);

};

export const sendListMessage = (payload) => {

  const { sender, text, buttonText, rows, clinic } = payload
  

  return sendRequest({

    messaging_product: "whatsapp",

    recipient_type: "individual",

    to: sender,

    type: "interactive",

    interactive: {

      type: "list",

      body: {

        text: text,

      },

      action: {

        button: buttonText,

        sections: [

          {

            title: "Available Options",

            rows,

          },

        ],

      },

    },

  }, clinic);

};

export const sendUrlButtonMessage = (phone,body,buttonText,url) => {

  return sendTextMessage(
    phone,
    `${body}\n\n${url}`
  );

};

export const sendLocationMessage = async (payload) => {
  
  const { clinic, sender } = payload;

  return sendRequest({

    messaging_product: "whatsapp",

    to: sender,

    type: "location",

    location: {

      latitude: clinic.location.latitude,

      longitude: clinic.location.longitude,

      name: clinic.clinicName,

      address: `${clinic.address.line1}, ${clinic.address.city}`

    }
  }, clinic);

};