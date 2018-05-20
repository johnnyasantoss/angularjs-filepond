module.exports = {
    start: function start() {

        const fileServer = require('express')();

        fileServer.use((err, req, res) => {
            console.log(err, req, res);
        });
        fileServer.listen(9000, 'localhost', (err) => {
            console.log('FileServer: Running @ :9000');
        });
    }
}
