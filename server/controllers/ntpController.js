
import moment from 'moment';

export const time = async (req, res) => {
    const t1 = req.body?.t1;
    const t2 = moment.now();

    const flightDifference = t2-t1;
    res.status(200).send({flightDifference: flightDifference, t3: moment().unix()});
};