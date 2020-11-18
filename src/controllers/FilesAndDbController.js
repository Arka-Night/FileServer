const connection = require('../../database/connection');
const path = require('path');
const fs = require('fs');

module.exports = {
    async create(req, res, next) {
        if(req.body.fileSize < 104857600) {
            try {
                const clientName = req.body.clientName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
                const count = await connection('ClientId').count('clientId', {as: 'counter'}).first();
                const clientId = parseInt(count.counter) + 1;

                const data = req.body.binary.replace(/^data:([A-Za-z-+\/]+);base64,/, "");
                const fileName = clientId + '-' + clientName + '.' + req.body.fileType;
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

                        const client = await connection('ClientId').where('clientId', clientId).select('*').first();
                        
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