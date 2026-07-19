import axios from "axios";
import config from "../../../configuration.js";

const BASE_URL =
  `https://graph.facebook.com/v23.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;

const headers = {
  Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

const sendRequest = async (payload) => {

  try {

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

export const sendTextMessage = (phone, text) => {

  return sendRequest({

    messaging_product: "whatsapp",

    to: phone,

    type: "text",

    text: {
      body: text,
    },

  });

};

export const sendButtonMessage = (
  phone,
  body,
  buttons
) => {

  return sendRequest({

    messaging_product: "whatsapp",

    recipient_type: "individual",

    to: phone,

    type: "interactive",

    interactive: {

      type: "button",

      body: {
        text: body,
      },

      action: {

        buttons: buttons.map(button => ({

          type: "reply",

          reply: button,

        })),

      },

    },

  });

};

export const sendListMessage = (
  phone,
  body,
  buttonText,
  rows
) => {

  return sendRequest({

    messaging_product: "whatsapp",

    recipient_type: "individual",

    to: phone,

    type: "interactive",

    interactive: {

      type: "list",

      body: {

        text: body,

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

  });

};

export const sendUrlButtonMessage = (
  phone,
  body,
  buttonText,
  url
) => {

  return sendTextMessage(
    phone,
    `${body}\n\n${url}`
  );

};