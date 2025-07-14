import https from "https";


const proxyGenerateAiBlog = ({ topic }: { topic: string }, cb: (data: string) => void) => {

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
