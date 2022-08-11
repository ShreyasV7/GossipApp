const express = require("express")  ;
const path = require("path")  ;
const { isObject } = require("util");
const app = express()  ; 
const server = require("http").createServer(app) ;


const io = require("socket.io")(server)  ;

app.use(express.static(path.join(__dirname+"/public"))) ;

io.on("connection",(socket)=>{
    socket.on("newuser",(username)=>{
        socket.broadcast.emit("update",username + " joined the chat")  ;
    }) ; 

    socket.on("exituser",(username)=>{
        socket.broadcast.emit(`update`,username + " left the chat")  ;
    }) ; 

    socket.on("chat",(message)=>{
        socket.broadcast.emit("chat",message)  ;
    }) ; 

    
});
server.listen(5000) ;