var express = require('express');
var request = require('request');
require('dotenv').load();

var configureServer = function() {
    var server = express.createServer(    );

    server.configure(
        function() {
            //any static file from the static directory, just return it to user if requested
            server.use(express.static(__dirname + '/public/'));

        }
    );
    return server;
};

var port = process.env.PORT || 9999;
var server = configureServer();

server.get('/world.json', function(req,res){
  res.setHeader('Content-Type', 'application/json');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(JSON.stringify({
    "owner": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyXkBJWKEVxxn5Iyr3kJF\nwCwLTRqDllvSdgAVnvDHbLDxGJWvX5ApPOdzACR8fqwawQirVv6/IEGhy/M06f85\nG24iU3/o1cO8rNEn0GUjIHTajGZ412ZTrvXBUzBZMD+c/nHxBWaAuQih6hrETfqU\nXRlCy2YK6dI4urtFzJnz3jh9g8FpQ8jMjWzKxn4BgWnUNNy9IVJwGws1yX0ra91X\nLjjRM7gorR9fpJNB0ySJuLv9S35ANRgLADgbBv0CUIfFPceiob7dx/ihKvE4U3tX\nJ7efTjjgVJup+AV+228oYF8DQ6hQ+X87n1red7GbMreBqbGxNX4M3nn/gjaYDXtE\nJwIDAQAB\n-----END PUBLIC KEY-----",
    "tokenURL": "http://shvdow.herokuapp.com/token",
    "room": "default"
  }));
})

server.get('/token', function (req, res) {
  request({
    url: "https://service.xirsys.com/signal/token",
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: {
        domain : process.env.XIRSYS_DOMAIN,
        application : 'default',
        room : 'default',
        ident : process.env.XIRSYS_IDENT,
        secret : process.env.XIRSYS_SECRET
    }
  },function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    res.send(body.d.token);
	  }
	});
});

server.listen(port);
console.log("listening on port "+port);
