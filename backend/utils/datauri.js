// this code for transform files to base64 format that we can store it in database and use it in our project

import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
};
export default getDataUri;