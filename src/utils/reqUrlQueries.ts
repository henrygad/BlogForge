import { URL } from "url";
import http from "http";

// This function extracts the query parameters from the request URL
// and returns them as a URL object.
const reqUrlQueries = (req: http.IncomingMessage): URL => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    return url;
};

export default reqUrlQueries;
