//@ts-check

const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const cors = require('cors');
const request = require('request');

module.exports = {
    start: function start() {
        const app = express();
        app.use("/api/files", this.getFileServer());

        app.listen(9000, 'localhost', (err) => {
            console.log('FileServer: Running @ :9000');
        });
    },
    getFileServer: function getFileServer(corsOptions) {
        const fileServer = express();
        const fileStorage = multer({ storage: multer.memoryStorage() });
        const fileDb = [];

        if (!corsOptions) {
            corsOptions = {};
        }
        corsOptions.methods = ['GET', 'POST', 'DELETE'];
        fileServer.use(cors(corsOptions));

        function notImplemented(res) {
            res.status(500);
            return res.json({ error: 'Not implemented' });
        }

        function load(req, res) {
            return notImplemented(res);
        };
        function restore(req, res) {
            return notImplemented(res);
        };

        function fetch(req, res) {
            let url = req.param('fetch');

            request(url, (err, response, body) => {
                if (response.statusCode !== 200) {
                    res.status(response.statusCode)
                        .send();
                } else {
                    res.status(200)
                        .json({
                            code: response.statusCode,
                            content: response.body,
                            type: response.headers['content-type'],
                            length: response.headers['content-length'],
                            success: true
                        });
                }
            });
        };

        fileServer.get("/", (req, res) => {
            if (req.originalUrl.indexOf("fetch=") !== -1) {
                fetch(req, res);
            } else if (req.originalUrl.indexOf("restore=") !== -1) {
                return restore(req, res);
            } else if (req.originalUrl.indexOf("load=") !== -1) {
                return load(req, res);
            } else {
                return res.status(405)
                    .header('Allow', 'GET, POST, DELETE')
                    .json({ error: 'Method not allowed' });
            }
        });

        //revert
        fileServer.delete("/", require('body-parser').text(), (req, res) => {
            let hash = req.body;
            let index = fileDb.findIndex(val => !!val && val.hash === hash);

            fileDb[index] = null;

            return res.status(200)
                .send();
        });
        //process
        fileServer.post("/", fileStorage.any(), (req, res) => {
            let hash = crypto.createHash('sha256');
            hash.update(req.files[0].buffer);

            let file = { hash: hash.digest('hex'), file: req.files[0] };

            fileDb.push(file);

            return res.status(200)
                .send(file.hash);
        });

        return fileServer;
    }
}
