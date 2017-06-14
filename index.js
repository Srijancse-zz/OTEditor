
// This acts like OTEditor server, based on socket.io and a basic OT algorithm. Do a 'node .' and go to http://localhost:5555/

var express = require('express');
var app = express();
var sleep = require('sleep');
var ot = require('./ot');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var options = {root: __dirname};
app.get('/', function(req, res){
    res.sendFile('index.html', options);
});

app.get('/ot.js', function(req, res){
    res.sendFile('ot.js', options);
});

var docState = new ot.DocState();

var rev = 0;
function broadcast() {
    if (rev < docState.ops.length) {
        //sleep.sleep(1);  // Enable it to simulate lag
        io.emit('update', docState.ops.slice(rev));
        rev = docState.ops.length;
    }
}

io.on('connection', function(socket){
    var peer = new ot.Peer();
    console.log('Client has been connected');
    socket.on('update', function(ops) {
        for (var i = 0; i < ops.length; i++) {
            peer.merge_op(docState, ops[i]);
        }
        broadcast();
        console.log('update: ' + JSON.stringify(ops) + ": " + docState.get_str());
    });
    socket.emit('update', docState.ops);
});

http.listen(5555, function(){
  console.log('Connect your client to http://localhost:5555/');
});
