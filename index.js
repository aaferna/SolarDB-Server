const server = require("./modules/server");
const fs = require("fs");
const path = require('path');
const cmd = require('minimist')(process.argv.slice(2))

const dirapp = path.resolve(__dirname)

if(cmd._ == "tokens"){

    const { v4: uuidv4 } = require('uuid');
    console.log("\nTokens Generados \n\n"+uuidv4())
    console.log(uuidv4()+"\n\n")

} else {

    if (fs.existsSync(dirapp + "/config/cors.json") && fs.existsSync(dirapp + "/config/stack.json")) {

        const fiCors = require(dirapp + "/config/cors.json")
        const fiStack = require(dirapp + "/config/stack.json")

        if(cmd._ == "setup"){
            server.init(fiStack)
        } else {
            server.run(fiCors, fiStack)
        }

    } else {
        console.log("Hay un problema con los archivos de configuracion, porfavor verifique que se encuentren");
    }

}