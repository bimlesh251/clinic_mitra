import config from "../../../configuration.js";

import { processWebhook }
    from "./webhook.processor.js";

export const verifyWebhook = (
    req,
    res
) => {

    const mode =
        req.query["hub.mode"];

    const token =
        req.query["hub.verify_token"];

    const challenge =
        req.query["hub.challenge"];

    if (
        mode === "subscribe" &&
        token === config.VERIFY_TOKEN
    ) {

        return res
            .status(200)
            .send(challenge);

    }

    return res.sendStatus(403);

};

export const receiveWebhook = async (
    req,
    res
) => {
    
    //Event Processing
    await processWebhook(req.body);
    res.status(200).json({status: "ok",});
};