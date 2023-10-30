const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const {PORT} = require('./config/server-config');
const apiRoutes = require('./routes/index');

const setupAndStartServer = () => {
    
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended : true}));
    app.use('/api',apiRoutes);
    
    //setup db sync



    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}!`);

        if(process.env.DB_SYNC){
            db.sequelize.sync({alter : true});
        }
    })
}

setupAndStartServer();
