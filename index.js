const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./src/routes');
const port = 45033;
const corsConfig = {
	origin: ['http://168.228.219.200:45033', 'http://172.16.3.30:45033']
};

app.use(express.json({ limit: '500mb' }));
app.use(cors(corsConfig));
app.use(routes);

app.listen(port, () => {
    console.log('listening at port: ' + port);
});