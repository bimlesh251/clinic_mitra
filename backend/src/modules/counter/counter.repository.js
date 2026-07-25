import Counter from "./counter.model.js";

export const getNextSequence = async (key) => {

    const counter = await Counter.findOneAndUpdate(

        { key },

        {

            $inc: {

                sequence: 1

            }

        },

        {

            new: true,

            upsert: true

        }

    );

    return counter.sequence;

};