import https from "https";

// This function generates a blog post using the Mistral AI model via OpenRouter API
// It takes a topic as input and returns the generated blog content through a callback function
const proxyGenerateAiBlog = ({ topic }: { topic: string }, cb: (res: string) => void) => {
    const key = process.env.OPENROUTER_API_KEY;

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
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            "Content-Length": payload.length,
        },
    };
    
    // Console loading
    console.log("Generating blog...");
   
    // Initialize an empty string to hold the response body
    let responseBody = "";

    // Create the HTTPS request
    // and set up event listeners for data and end events   
    const httpsReq = https.request(options, (response) => {
        response.on("data", (chunk) => (responseBody += chunk));

        response.on("end", () => {           
            cb(responseBody);
        });
    });

    // Handle any errors that occur during the request
    httpsReq.on("error", (err) => {
        throw new Error(`❌ Faild to to generate blog. error: ${err.message}`);
    });

    // Write the payload to the request body and end the request
    httpsReq.write(payload);

    // End the request to signal that no more data will be sent
    httpsReq.end();
};

export default proxyGenerateAiBlog;
