
const   fs = require("fs"), 
        path = require('path'), 
        cmd = require('minimist')(process.argv.slice(2))

const   setup = require("./modules/setup"), 
        log = require("./modules/log"), 
        nuser = require("./modules/nuser"), 
        token = require("./modules/token");

global.deployPath


if(cmd.dev === true){

    deployPath = path.dirname(__filename);
    
} else {

    deployPath = path.dirname(process.execPath);
    
}

if(cmd.tokens === true){

    token.create()

} else if(cmd.setup === true) {

    setup.create()

} else {

    if (fs.existsSync(path.join(deployPath, "/config.json"))) {
        global.config = require(path.join(deployPath, "/config.json"));

        if(cmd.user === true){

            if(config.usercmd === true){ 
                
                nuser.create()
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