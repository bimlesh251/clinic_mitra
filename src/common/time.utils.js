export const timeToMinutes = (time) => {

    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;

};

export const minutesToTime = (minutes) => {

    const hrs = Math.floor(minutes / 60);

    const mins = minutes % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;

};

export const formatTime12Hour = (time) => {

    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();

    date.setHours(hours, minutes);

    return date.toLocaleTimeString("en-IN", {

        hour: "2-digit",

        minute: "2-digit",

        hour12: true

    });

};