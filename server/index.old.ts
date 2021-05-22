const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
    console.error(`Node cluster master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });

} else {
    const app = express();

    const originURL = isDev ? 'http://localhost:3000' : 'https://penshare-stage.herokuapp.com'

    const corsOptions= {
        origin: originURL,
        credentials: true
    }

    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(cookieParser());

    // const db = require('./models');
    // const utils = require('./utils');
    // db.sequelize.sync({force: true}).then(() => {
    //     utils.createDefaultRoles().then(() => {
    //         console.log("Roles created")
    //     });
    // });

    // db.sequelize.sync();

    // Priority serve any static files.
    app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

    // All remaining requests return the React app, so it can handle routing.
    app.get('*', function (request, response) {
        response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
    });

    app.listen(PORT, function () {
        console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
    });
}