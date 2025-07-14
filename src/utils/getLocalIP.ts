import os from "os";

const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    const localIP = Object.values(interfaces)
        .flat()
        .find((i) => i?.family === "IPv4" && !i.internal)?.address;
    
    return localIP;    
};

export default getLocalIP;
