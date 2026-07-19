import { findByPhoneNumberId} from "./clinic.repository.js";

export const getClinicByPhoneNumberId = async ( phoneNumberId ) => {

    const clinic = await findByPhoneNumberId( phoneNumberId );

    if (!clinic) {

        throw new Error(

            "Clinic not found."

        );

    }

    return clinic;

};