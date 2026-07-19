import express from "express";
import {verifyWebhook, receiveWebhook} from "../modules/whatsapp/whatsapp.controller.js";

const router = express.Router();

router.get("/whatsapp",verifyWebhook);
router.post("/whatsapp",receiveWebhook);

export default router;