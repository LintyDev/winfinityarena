import env from '#start/env'
import server from '@adonisjs/core/services/server'
import { instrument } from '@socket.io/admin-ui'
import { Server, Socket } from 'socket.io'

class Ws {
  io: Server
  private booted = false

  boot() {
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: [env.get('ORIGIN') ?? '', 'https://admin.socket.io'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
      },
    })

    console.log('Websocket server started')

    instrument(this.io, {
      auth: false,
      namespaceName: '/',
      mode: 'development',
    })

    this.io.on('connection', (socket: Socket) => {
      console.log('User connected to server:', socket.id)

      socket.on(
        'joinRoomFromHost',
        async (
          {
            roomId,
            username,
            userId,
            host,
          }: {
            roomId: string
            username: string
            userId: number
            host: boolean
          },
          callback: Function
        ) => {
          socket.data.userId = userId
          socket.data.username = username
          socket.data.host = host

          socket.join(roomId)
          console.log(`User ${socket.data.username} joined room ${roomId}`)

          let sockets = await this.io.in(roomId).fetchSockets()
          let users = sockets.filter((s) => !s.data.host).map((s) => s.data)
          callback({ users })
          socket.on('disconnect', async () => {
            sockets = await this.io.in(roomId).fetchSockets()
            const userHost = sockets.filter((s) => s.data.host)
            if (!userHost.length) {
              this.io.to(roomId).emit('hostDisconnected', { session: false })
            }
          })
        }
      )

      socket.on(
        'joinRoomFromMobile',
        async ({
          roomId,
          username,
          userId,
          avatar,
        }: {
          roomId: string
          username: string
          userId: number
          avatar: string
        }) => {
          socket.data.userId = userId
          socket.data.username = username
          socket.data.avatar = avatar
          socket.data.host = false

          socket.join(roomId)
          let sockets = await this.io.in(roomId).fetchSockets()
          let users = sockets.filter((s) => !s.data.host).map((s) => s.data)
          this.io.to(roomId).emit('userConnected', { users })
          socket.on('disconnect', async () => {
            sockets = await this.io.in(roomId).fetchSockets()
            users = sockets.filter((s) => !s.data.host).map((s) => s.data) ?? []
            this.io.to(roomId).emit('userDisconnected', { users })
          })
        }
      )
    })
  }
}

export default new Ws()
