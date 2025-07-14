import os from "os";

const systemInfo = () => {
    console.log("📟 System Info:");
    console.log("--------------------------");
    
    
    console.log("🖥️  Hostname:", os.hostname());
    console.log("👤 Username:", os.userInfo().username);
    console.log("💿 OS Version:", os.version());
    console.log("📂 Home Dir:", os.homedir());
    console.log("🧠 Free Memory:", os.freemem() / 1024 / 1024, "MB");
    console.log("🧠 Total Memory:", os.totalmem() / 1024 / 1024, "MB");
    console.log("🔌 CPU Cores:", os.cpus().length);
    console.log("📦 Platform:", os.platform());
    console.log("🧠 OS Type:", os.type());  
    console.log("🕹️  Architecture:", os.arch()); 
    console.log("🕓 Uptime:", Math.round(os.uptime() / 60), "minutes");      
};

export default systemInfo;