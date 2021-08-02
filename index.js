const server = require("./modules/server");
const fs = require("fs");
const path = require('path');
const cmd = require('minimist')(process.argv.slice(2))
require('dotenv').config();

const deployPath = path.dirname(process.execPath);

if(cmd._ == "tokens"){

    const { v4: uuidv4 } = require('uuid');
    console.log("\nTokens Generados \n\n"+uuidv4())
    console.log(uuidv4()+"\n\n")

} else if(cmd._ == 'setup') {

    try {

        if (!fs.existsSync(path.join(deployPath, "/.env"))) {
            const { v4: uuidv4 } = require('uuid');

            let configFile = 
            `
            PORT="1802"
            CONTAINER="${path.join(deployPath, "/data/")}"
            HTOKEN="${uuidv4()}"
            HINDEX="${uuidv4()}"
            USERCMD=TRUE
            `

            if (!fs.existsSync(path.join(deployPath, "/.env"))) {
                fs.writeFileSync(path.join(deployPath, "/.env"), configFile, 'utf8');
            } 
            
            console.log("Archivo de Configuracion creado")

        } else { console.log("Ya existe un perfil") }

    } catch (err) {

        if (err.code === 'ENOENT') {
            console.log({
                code: err.code,
                msj: "El directorio o archivo no existe",
            })
        } else {
            console.log({
                code: err.code,
                msj: "El directorio o archivo no existe",
            })
        }
    }    

} else {

    if (fs.existsSync(path.join(deployPath, "/.env"))) {

        const fiStack = {
            "port": process.env.PORT,
            "container": process.env.CONTAINER,
            "hashToken": process.env.HTOKEN,
            "hashIndex": process.env.HINDEX
        }

        if(cmd._ == "nuser"){
            
            if(process.env.USERCMD === "TRUE"){ server.nuser(fiStack) } 
            else { console.log("No es posible crear usuarios") }   
        
        } else { server.run(fiStack) }

    } else {
        console.log("Hay un problema con los archivos de configuracion, porfavor verifique que se encuentren");
    }

}