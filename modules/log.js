const solar = require("solardb-core")
const { DateTime } = require("luxon");
const path = require('path');

exports.reg = (root, data) => {
    let app = "log"
    let directory = path.join(root, "/system/")
    
    let idLog = 0
    let now = DateTime.local().c
    
    let postSave = {
        date: now,
        data: data
    }

    let id = parseInt(solar.dbGetLatestFile(app, directory))
    
    if(id != 0){
        let r = solar.dbGetData(id, app, directory).pop()
        if(r.code !== "ENOENT" && now.day == r.date.day){ idLog = id }
    }
        
    if(idLog != 0){ 
        solar.dbUpdate(postSave, idLog, app, directory) 
    } else {
        idLog = solar.dbInsert(postSave, app, directory).id
    }
}
