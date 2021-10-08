const   express = require('express'), 
        router = express.Router(),
        log = require("../log"), 
        util = require("./util");

    router.get('/', tokenValidator, (req, res) => {
           
        res.status(200).json({ msg: "Login OK" })

    })

    router.get('/status', (req, res) => {
           
        res.status(200).json({ msg: "Service OK" })
        
    })
    
module.exports = router;
