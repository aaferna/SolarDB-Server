const   { v4: uuidv4 } = require('uuid'), 
        fs = require("fs"), 
        path = require('path'),
        log = require("./log");

exports.create = () => {

    try {
        
        if (!fs.existsSync(path.join(deployPath, "/config.json"))) {

            const config = new Object();
                  config.port = "1802"
                  config.container = path.join(deployPath, "/data/")
                  config.deployPath = deployPath
                  config.htoken = uuidv4()
                  config.hindex = uuidv4()
                  config.usercmd = true
                  config.encrypt = "bson" // jwt
            
            fs.writeFileSync(path.join(deployPath, "/config.json"), JSON.stringify(config), 'utf8');
            log.reg(deployPath, "Archivo de Configuracion creado")
            console.log("Archivo de Configuracion creado")

        } else { 

            console.log("Ya existe un perfil") 
            log.reg(deployPath, "Ya existe un perfil")

        }

    } catch (err) {

        log.reg(deployPath, "Se intento crear un perfil nuevo: El directorio o archivo no existe, "+ JSON.stringify(err.code))

        if (err.code === 'ENOENT') {
            console.log({
                code: JSON.stringify(err.code),
                msj: "El directorio o archivo no existe",
            })
        } else {
            console.log({
                code: JSON.stringify(err.code),
                msj: "El directorio o archivo no existes",
            })
        }
        
    }  

}