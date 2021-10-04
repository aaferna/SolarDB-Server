
const fs = require("fs");
const path = require('path');
const cmd = require('minimist')(process.argv.slice(2))

const setup = require("./modules/setup");
const log = require("./modules/log");
const nuser = require("./modules/nuser");
const token = require("./modules/token");

global.deployPath


if(cmd.dev === true){

    deployPath = path.dirname(__filename);

} else {

    deployPath = path.dirname(process.execPath);
    
}


if(cmd.tokens === true){

    token.create()

} else if(cmd.setup === true) {

    setup.setupConfig(deployPath)

} else {

    if (fs.existsSync(path.join(deployPath, "/config.json"))) {
        const config = require(path.join(deployPath, "/config.json"));

        if(cmd.user === true){

            if(config.usercmd === true){ 
                
                nuser.create(deployPath)
                log.reg(deployPath, "Se creo un usuario por medio de CMD")

            } else { 

                log.reg(deployPath, "Se intento crear un usuario nuevo por CMD y no esta habilitado")
                console.log("No es posible crear usuarios") 

            }   
            
        } else { 
            
            require("./modules/server")
        
        }

    } else { 

        log.reg(deployPath, "Hay un problema con los archivos de configuracion, porfavor verifique que se encuentren")
        console.log("Hay un problema con los archivos de configuracion, porfavor verifique que se encuentren"); 

    }

}