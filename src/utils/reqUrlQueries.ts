import { URL } from "url";
import http from "http";

const reqUrlQueries = (req: http.IncomingMessage): URL => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    return url;
};

export default reqUrlQueries;
