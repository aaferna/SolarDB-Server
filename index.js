const server = require("./modules/server");
const fs = require("fs");
const path = require('path');
const cmd = require('minimist')(process.argv.slice(2))
const deployPath = path.dirname(process.execPath);

if(cmd._ == "tokens"){

    const { v4: uuidv4 } = require('uuid');
    console.log("\nTokens Generados \n\n"+uuidv4())
    console.log(uuidv4()+"\n\n")

} else {

    if (fs.existsSync(path.join(deployPath, "/config/cors.json")) && fs.existsSync(path.join(deployPath, "/config/stack.json"))) {

        const fiCors = require(path.join(deployPath,  "/config/cors.json"))
        const fiStack = require(path.join(deployPath, "/config/stack.json"))

        if(cmd._ == "setup"){
            server.init(fiStack)
        } else {
            server.run(fiCors, fiStack)
        }

    } else {
        console.log("Hay un problema con los archivos de configuracion, porfavor verifique que se encuentren");
    }

}