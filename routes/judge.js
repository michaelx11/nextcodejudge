// Functions to test file and update clients

var exec = require('child_process').exec;

exports.checkProgram = function checkProgram(req, res) {
    var name = req.query.name;
    var problem = req.query.problem;
    var language = req.query.language;

    exec('echo hi',
            function(error, stdout, stderr) {
                console.log('stdout: ' + stdout);
            }
        );
}
