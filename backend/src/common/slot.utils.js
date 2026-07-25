import {timeToMinutes, minutesToTime, formatTime12Hour} from "./time.utils.js";

export const generateSlots = (sessions,slotDuration) => {

    const slots = [];

    for (const session of sessions) {

        let start = timeToMinutes(session.startTime);

        const end = timeToMinutes(session.endTime);

        while (start + slotDuration <= end) {

            slots.push({

                value: minutesToTime(start),

                label: formatTime12Hour(

                    minutesToTime(start)

                )

            });

            start += slotDuration;

        }

    }

    return slots;

};