const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let activeUsers = new Set();
let currentScriptDelta = null; 
let globalTimeline = [];

io.on('connection', (socket) => {
    if (activeUsers.size >= 2) {
        socket.emit('error-msg', 'Accès refusé : Le studio a atteint sa limite stricte de 2 créateurs.');
        socket.disconnect();
        return;
    }
    activeUsers.add(socket.id);
    socket.emit('init-data', { script: currentScriptDelta, timeline: globalTimeline });

    socket.on('edit-script', (delta) => {
        currentScriptDelta = delta;
        socket.broadcast.emit('update-script', delta);
    });

    socket.on('update-timeline', (timelineData) => {
        globalTimeline = timelineData;
        socket.broadcast.emit('update-timeline', timelineData);
    });

    socket.on('disconnect', () => {
        activeUsers.delete(socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Nova Creators Studio Pro lancé sur le port ${PORT}`));
