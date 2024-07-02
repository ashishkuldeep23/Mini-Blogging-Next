// const express = require('express');
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const next = require('next');

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//     const server = express();
//     const httpServer = createServer(server);
//     const io = new Server(httpServer, {
//         cors: {
//             origin: '*',
//         },
//     });

//     // Store users and their socket IDs
//     const users = {};

//     io.on('connection', (socket) => {
//         console.log('New client connected');

//         // Save user connection

//         socket.on('register', (userData) => {
//             // console.log("Register ------------>")
//             // console.log(userData)
//             let userId = userData._id
//             users[userId] = socket.id;
//             console.log(` ${userData.username} registered with socket ID ${socket.id}`);
//         });

//         // Handle private messages
//         socket.on('hello', (data) => {
//             console.log(data)

//             socket.emit("word", "ok")

//         });


//         // Handle private messages
//         socket.on('privateMessage', ({ senderId, recipientId, message }) => {
//             const recipientSocketId = users[recipientId];
//             if (recipientSocketId) {
//                 io.to(recipientSocketId).emit('privateMessage', { senderId, message });
//             }
//         });


//         socket.on('disconnect', () => {
//             // Remove user from the users object
//             for (const userId in users) {
//                 if (users[userId] === socket.id) {
//                     delete users[userId];
//                     break;
//                 }
//             }
//             console.log('Client disconnected');
//         });
//     });

//     server.all('*', (req, res) => {
//         return handle(req, res);
//     });

//     const PORT = process.env.PORT || 3000;
//     httpServer.listen(PORT, (err) => {
//         if (err) throw err;
//         console.log(`> Ready on http://localhost:${PORT}`);
//     });
// });
