import { getClinicByPhoneNumberId } from "../clinic/clinic.service.js";
import { handleMessage } from "./conversation.service.js";

export const processWebhook = async (data) => {

    try {

        if (!data?.entry?.length || !data.entry[0]?.changes?.length) {
            console.log("Invalid webhook payload");
            return;
        }

        const value = data.entry[0].changes[0].value;

        if (!value.messages) {
            console.log("Ignoring status event");
            return;
        }

        const messageObj = value.messages[0];
        const sender = messageObj.from;
        const phoneNumberId = value.metadata.phone_number_id;
        const clinic = await getClinicByPhoneNumberId(phoneNumberId);
        
        let message = "";

        if (messageObj.type === "text") {
            message = messageObj.text.body;
        }

        else if (messageObj.type === "interactive") {
            const interactive = messageObj.interactive;

            if (interactive.type === "button_reply") {
                message = interactive.button_reply.id;
            }

            else if (interactive.type === "list_reply") {
                message = interactive.list_reply.id;
            }

            else {
                return;
            }

        }

        else {
            return;
        }

        const context = {
            clinic,
            sender,
            phoneNumberId,
            message
        };

        await handleMessage(context);

    } catch (err) {

        console.log("Webhook Error:", err);

    }

};