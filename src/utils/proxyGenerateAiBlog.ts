import https from "https";


const proxyGenerateAiBlog = ({ topic }: { topic: string }, cb: (res: string) => void) => {

    const prompt = `Write a blog post with title, intro and body about: ${topic}`;

    const payload = JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
            { role: "system", content: "You are a helpful blog assistant." },
            { role: "user", content: prompt },
        ],
    });

    const options = {
        hostname: "openrouter.ai",
        path: "/api/v1/chat/completions",
        method: "POST",
        headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
            "Content-Length": payload.length,
        },
    };

    let responseBody = "";
    const httpsReq = https.request(options, (response) => {
        response.on("data", (chunk) => (responseBody += chunk));

        response.on("end", () => {           
            cb(responseBody);
        });
    });

    httpsReq.on("error", (err) => {
        throw new Error(`❌ Faild to to generate blog. error: ${err.message}`);
    });

    httpsReq.write(payload);
    httpsReq.end();
};

export default proxyGenerateAiBlog;
