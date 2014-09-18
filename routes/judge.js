// Functions to test file and update clients

var fs = require('fs');
var exec = require('child_process').exec;
var Firebase = require('firebase');

var root = new Firebase('https://kyc.firebaseIO.com/nextchallenge');
var problemID = -1;
var fileID = -1;

root.child('started').on('value', function(snapshot) {
    if (snapshot.val() != 'false') {
        if (snapshot.val() == 'true') {
            problemID++;
        } else {
            problemID = snapshot.val();
        }
        root.child('started').set('false');
        root.child('p1').set('running');
        root.child('p2').set('running');
        console.log("starting problem " + problemID);
        exec('cat problems/prob' + problemID,
            function(error, stdout, stderr) {
                root.child('problem').set(stdout);
            }
            );
    }
});

exports.checkProgram = function checkProgram(req, res) {
    var child = req.query.player != 2 ? 'p1' : 'p2';

    // Run program.
    var extension = req.query.extension;
    fileID++;
    var program = "tmp/prob" + fileID + extension;
    var input = "inputs/prob" + problemID;
    var output = "tmp/out" + fileID;
    var expected = "expected/out" + problemID;
    console.log('writing ' + fileID);
    fs.writeFileSync(program, req.query.program);
    console.log(program + " " + input + " " + output + " " + expected);
    exec('./tester ' + program + ' ' + input + ' ' + output + ' ' + expected,
            {timeout: 1000},
            function(error, stdout, stderr) {
                console.log('diff: ' + stdout);
                if (error || stdout) {
                    root.child(child).set('error');
                    res.json({'result': 'fail: ' + stdout});
                } else {
                    root.child(child).set('done');
                    res.json({'result': 'pass'});
                }
            }
        );
}
