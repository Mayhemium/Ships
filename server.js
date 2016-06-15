var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = 3000;

app.use(express.static(__dirname));

http.listen(port, function () {
    console.log('starting on port ' + port);
});

var socketio = require("socket.io")
var io = socketio.listen(http)
var users = [];
var names = [];
var ready = [];
var yourturn = [];

io.sockets.on("connection", function (client) {
    client.on("login", function (data) {
        users.push(client.id);
        if (data.name == "") {
            client.emit("login", {
                login: false,
                reason: "name is empty"
            })
            return;
        }
        if (names.indexOf(data.name) == -1) {
            if (users.indexOf(client.id) % 2 == 0)
                client.yourturn = true;
            else
                client.yourturn = false;
            names[users.indexOf(client.id)] = data.name
            ready[users.indexOf(client.id)] = false;
            client.emit("login", {
                login: true,
                yourturn: client.yourturn,
                name: data.name
            })
        } else {
            client.emit("login", {
                login: false,
                reason: "same name exist"
            })
        }
    })

    //if (users.indexOf(client.id) % 2 == 1) {
    //    io.to(users[users.indexOf(client.id) - 1]).emit('start', 'for your eyes only');
    //    io.to(users[users.indexOf(client.id)]).emit('start', 'for your eyes only');
    //}

    client.on("disconnect", function () {
        if (users.indexOf(client.id) >= 0) {
            users.splice(users.indexOf(client.id), 1);
            names.splice(users.indexOf(client.id), 1);
            ready.splice(users.indexOf(client.id), 1);
        }
    })

    client.on("ready", function () {
        ready[users.indexOf(client.id)] = true;
        console.log(ready)
    })

    client.on("attack", function (data) {
        console.log("position:" + data.x + ", " + data.y)
        console.log(users.length,names.length,ready.length)
        if (users.indexOf(client.id) % 2 == 1)
            io.to(users[users.indexOf(client.id) - 1]).emit('eattack', {
                x: data.x,
                y: data.y
            });
        else
            io.to(users[users.indexOf(client.id) + 1]).emit('eattack', {
                x: data.x,
                y: data.y
            });
    })

    client.on("move", function (data) {
        //console.log("position:" + data.x + ", " + data.y)
        if(users.indexOf(client.id) % 2 == 1)
            io.to(users[users.indexOf(client.id) - 1]).emit('emove', {
                x: data.x,
                y: data.y
            });
        else
            io.to(users[users.indexOf(client.id) + 1]).emit('emove', {
                x: data.x,
                y: data.y
            });
    })

    client.on("hit", function (data) {
        if (users.indexOf(client.id) % 2 == 1)
            io.to(users[users.indexOf(client.id) - 1]).emit('ehit', {
                hit: data.hit,
                x: data.x,
                y: data.y
            });
        else
            io.to(users[users.indexOf(client.id) + 1]).emit('ehit', {
                hit: data.hit,
                x: data.x,
                y: data.y
            });
    })

})
