var currentLanguage = "java";
var editor;

var javaString = "import java.util.*\nimport java.io.*;\n\npublic class Main {\n\npublic static void main (String[] args) throws IOException {\n//your code here\n}\n}";
var cppString = "#include <stdio.h>\n#include <stdlib.h>\n#include <iostream>\n#include <math.h>\n#include <string.h>\n#include <algorithm>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n\n//your code here\n\n}";
var pythonString = "//no boilerplate, your code goes here";

$(document).ready(function() {
    // ace-editor
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.setValue(javaString);
    editor.getSession().setMode("ace/mode/java");
    document.getElementById('editor').style.fontSize = '14px';

    // firebase
    var root = new Firebase('https://nextchallenge.firebaseio.com/');
    root.child('problem').on('value', function(snapshot) {
        $('#problem_statement').text(snapshot.val())
    });
});

onclickFunction = function() {
    $.getJSON('/checkprogram.json', {
        'program': editor.getSession().getValue(),
        'problem': 0,
        'extension': '.py',
        'player': 1
    });
}

switchLanguage = function(language) {
    if (currentLanguage == 'java') {
        javaString = editor.getValue();
    } else if (currentLanguage == 'cpp') {
        cppString = editor.getValue();
    } else {
        pythonString = editor.getValue();
    }
    if (language == 'java') {
        editor.setValue(javaString);
        editor.getSession().setMode("ace/mode/java");
    } else if (language == 'cpp') {
        editor.setValue(cppString);
        editor.getSession().setMode("ace/mode/c_cpp");
    } else {
        editor.setValue(pythonString);
        editor.getSession().setMode("ace/mode/python");
    }
    currentLanguage = language;
}
