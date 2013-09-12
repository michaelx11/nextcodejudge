// Functions to test file and update clients

var fs = require('fs');
var exec = require('child_process').exec;
var Firebase = require('firebase');

var root = new Firebase('https://nextchallenge.firebaseIO.com');
var problemID = 0;
var fileID = 0;

exports.startGame = function startGame(req, res) {
    root.child('p1').set('running');
    root.child('p2').set('running');
    exec('cat problems/prob' + problemID++,
            function(error, stdout, stderr) {
                root.child('problem').set(stdout);
            }
        );
}

exports.checkProgram = function checkProgram(req, res) {
    var child = req.query.player == 1 ? 'p1' : 'p2';

    // Run program.
    var extension = req.query.extension;
    var program = "tmp/prob" + fileID + extension;
    var input = "inputs/prob" + req.query.problem;
    var output = "tmp/out" + fileID;
    var expected = "expected/out" + req.query.problem;
    fileID++;
    fs.writeFile(program, req.query.program);
    exec('./tester ' + program + ' ' + input + ' ' + output + ' ' + expected,
            {timeout: 1000},
            function(error, stdout, stderr) {
                console.log('diff: ' + stdout);
                if (error || stdout) {
                    root.child(child).set('error');
                } else {
                    root.child(child).set('done');
                }
            }
        );
}
