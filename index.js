const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./src/routes');
const port = 45033;

app.use(express.json({ limit: '500mb' }));
app.use(cors());
app.use(routes);

app.listen(port, () => {
    console.log('listening at port: ' + port);
});