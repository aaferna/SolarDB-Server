const server = require("./modules/server");
const fs = require("fs");
const path = require('path');
const cmd = require('minimist')(process.argv.slice(2))

// const deployPath = path.dirname(process.execPath);

const deployPath = "C:\\Users\\agust\\github\\SolarDB-Server\\"
console.log(path.join(deployPath, "/config/"))


if(cmd._ == "tokens"){

    const { v4: uuidv4 } = require('uuid');
    console.log("\nTokens Generados \n\n"+uuidv4())
    console.log(uuidv4()+"\n\n")

} else if(cmd._ == 'setup') {
    console.log(path.join(deployPath, "/config/"))

    try {

        const { v4: uuidv4 } = require('uuid');

        let configFile = {
            "port": "1802",
            "container": path.join(deployPath, "/data/"),
            "hashToken": uuidv4(),
            "hashIndex": uuidv4()
        }

        if (!fs.existsSync(path.join(deployPath, "/config/"))) {
            fs.mkdirSync(path.join(deployPath, "/config/"))
            fs.writeFileSync(path.join(deployPath, "/config/stack.json"), JSON.stringify(configFile), 'utf8');
        } 
        
        // console.log("Archivo de Configuracion creado")
            
    } catch (err) {

        if (err.code === 'ENOENT') {
            console.log({
                code: err.code,
                msj: "El directorio o archivo no existe2",
            })
        } else {
            console.log({
                code: err.code,
                msj: "El directorio o archivo no existe2",
            })
        }
    }    

} else {

    if (fs.existsSync(path.join(deployPath, "/config/stack.json"))) {

        const fiStack = require(path.join(deployPath, "/config/stack.json"))

        if(cmd._ == "nuser"){
            server.init(fiStack)
        } else {
            server.run(fiStack)
        }

    } else {

        console.log("Hay un problema con los archivos de configuracion, porfavor verifique que se encuentren");

    }

}