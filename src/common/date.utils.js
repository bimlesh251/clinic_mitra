export const getAvailableDates = (clinic) => {

    const bookingWindowDays = clinic.bookingWindowDays || 7;

    const dates = [];
    const today = new Date();

    for (let i = 0; i < bookingWindowDays; i++) {

        const date = new Date(today);
        date.setDate(today.getDate() + i);

        dates.push(date);

    }

    return dates;

};

export const getWeekday = (date) => {

    return date.getDay();

};

export const formatWhatsappDate = (date) => {

    const options = {

        day: "2-digit",

        month: "short",

        weekday: "short"

    };

    return date.toLocaleDateString("en-IN", options);

};

export const formatISODate = (date) => {

    return date.toISOString().split("T")[0];

};