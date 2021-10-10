const   solar = require("solardb-core"), 
        jwt = require('jwt-simple'), 
        generator = require('generate-password'), 
        { v4: uuidv4 } = require('uuid'), 
        path = require('path');


exports.create = () => {
    
    const config = require(
        path.join(deployPath, "/config.json")
    );

    const container = path.join(deployPath, "/system/")

    solar.dbCreateCollection ("users", container)

    const user = generator.generate({
        length: 5,
        numbers: true
    });

    const password = generator.generate({
        length: 12,
        numbers: true
    });

    const tokn = jwt.encode(uuidv4(), config.htoken)

    const data = jwt.encode({
        username: user,
        password: password,
        token: tokn.split('.')[0]+"."+tokn.split('.')[1],
        key: tokn.split('.')[2],
        admin: true,
        permits: {
            "create": true,
            "read": true,
            "update": true,
            "delete": true
        }
    }, config.utoken);

    solar.dbInsert(data, "users", container)
    
    console.log("User", {
        username: user,
        password: password,
        token: tokn.split('.')[2]
    })

}