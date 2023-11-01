const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const {PORT , FLIGHT_SERVICE_PATH} = require('./config/server-config');
const apiRoutes = require('./routes/index');
const db = require('./models/index')

const setupAndStartServer = () => {
    
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended : true}));
    app.use('/api',apiRoutes);

    app.listen(PORT, async () => {
        console.log(`Example app listening on port ${PORT}!`);

        //setup db sync
        // if(process.env.DB_SYNC){
        //     await db.sequelize.sync({alter: true});
        // }
        
    })
}

setupAndStartServer();
