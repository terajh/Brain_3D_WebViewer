const express = require('express');
const app = express();
const fs = require('fs');


app.use('/statics', express.static(__dirname + '/statics'));
app.use('/dist',express.static(__dirname + "/dist"));

app.listen(3000, ()=>{
    console.log('web start');
})

app.get('/',(req,res)=>{
    fs.readFile('./index.html',(error, data)=>{
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    })
})