import path from "path";
import fs from "fs";
import os from "os";
import readline from "readline";

// Manual .env parser
const loadEnvManually = (envPath: string) => {
    const content = fs.readFileSync(envPath, "utf-8");
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
        if (!line.trim() || line.startsWith("#")) continue; // skip empty lines and comments
        const [key, ...rest] = line.split("=");
        const value = rest.join("=").trim().replace(/^['"]|['"]$/g, ""); // remove wrapping quotes
        if (key && value && !process.env[key]) {
            process.env[key] = value;
        }
    }
};

// Function to resolve AI secret key
// from the user's .env file or prompt for it if not found
const resolveAiSecretKey = (rl: readline.Interface, cb: () => void   ) => {
    const configDir = path.join(os.homedir(), ".blogforge");
    const envPath = path.join(configDir, ".env");

    // Create the folder if missing
    if (!fs.existsSync(configDir)) {
        console.log(`📁 .env config folder ${configDir} not found. Creating...`);
        fs.mkdirSync(configDir, { recursive: true });
    }

    // Load .env if it exists
    if (fs.existsSync(envPath)) {
        loadEnvManually(envPath);

        // Continue running script
        cb();
    }
    // Prompt your to create .env if it does not exist
    else {
        console.warn(`⚠️  No .env file found at ${envPath}`);
        console.warn("👉 Please enter your OpenRouter API key to create one.");       

        rl.question("🔑 Enter your OpenRouter API key: ", (apiKey) => {
            fs.writeFileSync(envPath, `OPENROUTER_API_KEY=${apiKey}\n`, "utf-8");
            console.log(`✅ .env file created at ${envPath}`);
            loadEnvManually(envPath);

            const key = process.env.OPENROUTER_API_KEY;
            if (!key) {
                console.error("❌ Could not load API key after saving.");
                process.exit(1);
            }
            
            console.log("✅ OpenRouter API key loaded securely.");

            // Continue running script
            cb();
        });
      
    }
    
};

export default resolveAiSecretKey;
