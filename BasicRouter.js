'use strict';
const http = require('http');
const url = require('url');


let routes = {
  'GET':{
   '/': (req,res) => {
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end('GET SUCCESS!');
  },
  '/about':(req, res) => {
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end('GET ABOUT SUCCESS!');
  },
  '/about/getinfo': (req, res) => {
    res.writeHead(200, {'Content-type': 'application/json'});
    res.end(JSON.stringify(req.queryParams));
  }  
  },
  'POST': {
    '/api/login': (req, res) => {
      let body = '';
      req.on('data', data => {
        body += data;
        if(body.length > 2097152) {
          res.writeHead(413, {'Content-type': 'text/html'});
          res.end('<h3>Error: The file being uploaded exceeds the 2MB limit!</h3>', () => req.connection.destroy());
        }
      });

      req.on('end', () => {
        let params = qs.parse(body);
        console.log('Username: ', params['username']);
        console.log('Password: ', params['password']);
        console.log(body);
        res.end();
      })
    }
  },
  'NA': (req,res) => {
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end('Content not found!');
  }
}

function router(req,res) {
  let baseURI = url.parse(req.url, true);
  let resolveRoute = routes[req.method][baseURI.pathname];
  if(resolveRoute != undefined){
    req.queryParams = baseURI.query;
    resolveRoute(req, res);
  } else {
    routes['NA'](req, res);
  }
}

http.createServer(router).listen(3000, () =>{
  console.log('Server running on port 3000');
})
