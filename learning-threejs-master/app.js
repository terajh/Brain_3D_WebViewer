
const express = require('express');
const app = express();
const fs = require('fs');


app.use('/libs', express.static(__dirname + '/libs'));
app.use('/assets',express.static(__dirname + "/assets"));

app.listen(3000, ()=>{
    console.log('web start');
})

app.get('/',(req,res)=>{
    fs.readFile('./test.html',(error, data)=>{
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    })
})