const express = require('express');
const app = express();
const port = 3000;
const host = '0.0.0.0';
const spawn = require('child_process').spawn;
const fs = require('fs');


app.get('/', (req, res) => {

    const fc = fs.readFileSync('Clojure - Wikipedia.pdf');

    //console.log(req)

    pdf2xml(fc)
        .then(buf => res.send(buf))
        .catch((e) => {
            console.log(e);
            res.send('errrrrrrr...');
        });


});

app.get('/err', (req, res) => {

    throw new Error ("AAAAAaaaaaa!!!!!");

});


app.get('/die', (req, res) => {

    process.exit();

});


function pdf2xml(pdfContent) {
    return new Promise((resolve, reject) => {
        const pdftoxml = spawn(
            'pdftohtml',
            ['-xml', '-nodrm', '-i', '-nomerge', '-stdout', '-', 'void_file_name_to_satisfy_parser']); //, '-f', '0', '-l', '66'

        let buf = '';
        let errors = '';

        pdftoxml.stderr.on('data', (data) => errors += data);
        pdftoxml.stdout.on('data', (chunk) => buf += chunk);

        pdftoxml.on('close', (code) => {
            if (code !== 0 && errors) {
                const message = 'could not parse PDF, error code: ' + code + ', errors: ' + errors;
                if (buf.length > 0) {
                    console.log(message);
                    resolve(buf);
                } else {
                    reject(new Error(message));
                }
            } else {
                resolve(buf);
            }
        });

        pdftoxml.stdin.write(pdfContent);
        pdftoxml.stdin.end();
    });
}

app.listen(port, host, () => console.log(`Example app listening on port ${port}!`));
