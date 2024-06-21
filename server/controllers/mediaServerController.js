import { generate } from "random-words";

export const generateStreamKey = async (req, res) => {
    const streamKey = generate({ exactly: 3, minLength: 3, maxLength: 3, join: "-" });
    global.serverData.setServerDataByKey('streamKey', streamKey);
    res.status(200).send({message: "success"});
};