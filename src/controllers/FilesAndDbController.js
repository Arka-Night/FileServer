const connection = require('../../database/connection');
const increm = require("./incrementsVariable.json");
const newIncrem = `{
    "increments": ${increm.increments+1}
}`
const path = require('path');
const fs = require('fs');

module.exports = {
    async create(req, res, next) {
        if(req.body.fileSize < 104857600) {
            try {
                const clientName = req.body.clientName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
                const count = await connection('ClientId').count('clientId', {as: 'counter'}).first();
                const fileClientId = parseInt(count.counter) + 1;
                const clientId = parseInt(count.counter) + 1 + increm.increments;

                const data = req.body.binary.replace(/^data:([A-Za-z-+\/]+);base64,/, "");
                const fileName = fileClientId + '-' + clientName + '.' + req.body.fileType;
                const newPath = path.join(__dirname, '../../docs/' + fileName);

                fs.writeFile(newPath, data, 'base64', async (err) => {
                    if(err) {   
                        return res.json({ error: 'error in creation of arquive', err });
                    }

                    try {
                        await connection('ClientId').insert({ 
                            clientName: clientName,
                            arquive: fileName,
                        });        
                        await connection('ClientId').where('clientId', clientId).first().update('clientId', fileClientId);

                        const client = await connection('ClientId').where('clientId', fileClientId).select('*').first();
                        
                        return res.json(client);
                        
                    } catch(err) {
                        fs.unlinkSync(newPath);
                        return res.json({ error: 'error adding in database' });
                    }
                });

            } catch(err) {    
                return res.json({ error: 'Something goes wrong' });
            }
        } else {
            return res.json({ error: 'File is too big' });
        }
    },

    async removeATable(req, res, next) {
        const clientId = req.body.clientID;
        
        try {
            const data = await connection('ClientID').where('clientId', clientId).select('*').first();
            const dataAll = await connection('ClientID');

            console.log(data);

            fs.unlinkSync(path.join(__dirname + "/../../docs/" + data.arquive));
            await connection('ClientID').where('clientId', clientId).first().del();
            for(i in dataAll) {
                if(parseInt(i)+1 > clientId) {
                    await connection('ClientID').where('clientId', parseInt(i)+1).first().update('clientId', parseInt(i));

                }

            }

            fs.writeFileSync(path.join(__dirname + '/incrementsVariable.json'), newIncrem);

        } catch(err) {
            console.log(err);
            return res.json({ error: 'error in database' });
        }
        

    },

    async get(req, res, next) {
        const type = req.body.requestType;
        const post = type === 'id' ? req.body.id : req.body.clientName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

        try { 
            const arquive = await connection('ClientId').where(type === 'id' ? 'clientId' : 'clientName', post).first();

            res.json(arquive);

        } catch(err) {
            res.json({ error: err });
        }

    },

    async count(req, res, next) {
        try {
            const count = await connection('ClientId').count('clientId', {as: 'counter'}).first();

            res.json(count);

        } catch(err) {
            res.json({ error: err });

        }

    }
}