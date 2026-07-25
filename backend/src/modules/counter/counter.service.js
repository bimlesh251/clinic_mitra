import { getNextSequence }
from "./counter.repository.js";

export const generateAppointmentNumber = async (

    clinicCode,

    appointmentDate

) => {

    const date = new Date(appointmentDate);

    const yy = String(date.getFullYear()).slice(-2);

    const mm = String(

        date.getMonth() + 1

    ).padStart(2, "0");

    const dd = String(

        date.getDate()

    ).padStart(2, "0");

    const datePart = `${yy}${mm}${dd}`;

    const counterKey = `${clinicCode}-${datePart}`;

    const sequence = await getNextSequence(

        counterKey

    );

    return `${clinicCode.toUpperCase()}-${datePart}-${String(sequence).padStart(4,"0")}`;

};