

module.exports = (io) => {

    io.on('connection', socket => {
        socket.on('user-enters', (userId) => {
            socket.userId = userId;
            console.log('Hi userId:', socket.userId);
        });
        console.log('Hi there socket ID:', socket.id);
        io.emit('joinChat', 'Hi there!');

        socket.on('disconnect', () => {
            console.log('Bye user with socket:', socket.id);
            socket.broadcast.emit('user-disconnected', 'HE IS GONE');
        })

        socket.on('chat-msg-send', msg => {
            console.log('got', {...msg, userId: socket.userId})
            io.emit('chat-msg-receive', {...msg, userId: socket.userId})
        })

    });

}