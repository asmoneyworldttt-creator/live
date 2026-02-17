import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export const initSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket: Socket) => {
        const userId = socket.handshake.query.userId as string;

        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} connected to socket`);

            // Broadcast online status
            socket.broadcast.emit('user_online', { userId });
        }

        socket.on('typing', (data: { conversationId: string, receiverId: string, isTyping: boolean }) => {
            const { conversationId, receiverId, isTyping } = data;
            io.to(receiverId).emit('user_typing', { conversationId, isTyping });
        });

        socket.on('disconnect', () => {
            if (userId) {
                console.log(`User ${userId} disconnected from socket`);
                socket.broadcast.emit('user_offline', { userId });
            }
        });
    });

    return io;
};
