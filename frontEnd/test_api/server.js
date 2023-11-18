const fs = require("fs");
const http = require('http');
const url = require('url');

const data = fs.readFileSync(`${__dirname}/data.json`,"utf-8");
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {

    const pathName = req.url;
    if(req.method == 'GET' && pathName == "/"){
        res.writeHead(200,{'Content-type' : 'application/json'}); //200 success code application/json is type of content
        res.end(data);
    }else{
        res.writeHead(404,{
            'content-type' : 'text/html',
            'my-own-header' : "Hello world",
        });
        res.end("<h1>Page is not found</h1>");
    }
});
server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening to request on port 8000");
});