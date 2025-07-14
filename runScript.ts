import fs from "fs";
import { ChildProcess, spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target file or folder
const targetFile = path.join(__dirname, "./src/server.ts");
const watchPath = path.join(__dirname, "./src");

// Reference to child process
let scriptProcess: ChildProcess | null = null;

const runScript = (targetFile: string) => {
    if (!targetFile) console.error("❌ File path not provieded!");

    const script = path.resolve(targetFile);

    if (!fs.existsSync(script)) {
        console.error("❌ File path not found: " + script);
        process.exit(1);
    }

    if (!scriptProcess) console.log("🔁 Starting script....");

    const tsx = path.resolve("node_modules/.bin/tsx");

    scriptProcess = spawn(`"${tsx}" "${script}"`, {
        stdio: "inherit",
        shell: true,
        env: process.env
    });

    scriptProcess.on("exit", (code) => {
        if (code !== 0) {
            console.log(`❌ Script exited with code ${code}`);
        }
    });

};

const reRunScript = (targetFile: string) => {
    if (scriptProcess) {
        console.log("🔁 Restarting script...");       
        scriptProcess.kill();
    }

    runScript(targetFile);
};

const watchScriptForChanges = ({ targetFile, watchPath }: { watchPath: string, targetFile: string }) => {
    if (!watchPath) console.error("❌ Watch path not provieded!");

    console.log("👀 Watching: " + watchPath);

    fs.watch(path.resolve(watchPath), (eventType, filename) => {
        console.log(`📈 [File Watcher]: ${eventType.toUpperCase()} Detected: → ${filename}`);

        const clear = setTimeout(() => {
            reRunScript(targetFile);
            clearTimeout(clear);
        }, 200);

    });
};

watchScriptForChanges({ watchPath, targetFile });
runScript(targetFile);
