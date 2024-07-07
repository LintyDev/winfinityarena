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
      // console.log('User connected to server:', socket.id)

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
          this.io.to(roomId).emit('hostConnected')
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

          let sockets = await this.io.in(roomId).fetchSockets()
          let users = sockets.filter((s) => !s.data.host).map((s) => s.data)

          // max 6 players per room
          if (users.length < 6) {
            socket.join(roomId)
          }

          sockets = await this.io.in(roomId).fetchSockets()
          users = sockets.filter((s) => !s.data.host).map((s) => s.data)

          this.io.to(roomId).emit('userConnected', { users })
          socket.on('disconnect', async () => {
            sockets = await this.io.in(roomId).fetchSockets()
            users = sockets.filter((s) => !s.data.host).map((s) => s.data) ?? []
            this.io.to(roomId).emit('userDisconnected', { users })
          })
        }
      )

      socket.on('isKingInRoom', async ({ roomId }: { roomId: string }, callback: Function) => {
        console.log('isKing' + roomId)
        const sockets = await this.io.in(roomId).fetchSockets()
        const host = sockets.filter((s) => s.data.host)
        if (host.length) {
          callback(true)
        } else {
          callback(false)
        }
      })

      socket.on('canStartSession', async ({ roomId }: { roomId: string }) => {
        console.log('je lance une session')
        this.io.to(roomId).emit('canIStartSession')
      })

      socket.on('startingSession', async ({ roomId }: { roomId: string }) => {
        this.io.to(roomId).emit('startSession')
      })

      socket.on('setMobileView', ({ roomId, status }: { roomId: string; status: string }) => {
        this.io.to(roomId).emit('changeMobileView', { status })
      })

      socket.on(
        'sendCardToController',
        ({ roomId, card, username }: { roomId: string; card: any; username: string }) => {
          this.io.to(roomId).emit(`cardToDeck-${username}`, { card })
        }
      )

      socket.on('haveCards', ({ roomId, username }: { roomId: string; username: string }) => {
        this.io.to(roomId).emit('sendCardsToPlayer', { username })
      })

      socket.on('yourTurnToPlay', ({ roomId, username }: { roomId: string; username: string }) => {
        this.io.to(roomId).emit(`yourTurnToPlay-${username}`)
      })

      socket.on('skip', ({ roomId, username }: { roomId: string; username: string }) => {
        this.io.to(roomId).emit('playerWantSkip', { username })
      })

      socket.on('pick', ({ roomId, username }: { roomId: string; username: string }) => {
        this.io.to(roomId).emit('playerWantPick', { username })
      })

      socket.on(
        'put',
        ({ roomId, username, card }: { roomId: string; username: string; card: {} }) => {
          this.io.to(roomId).emit('playerPutCard', { username, card })
        }
      )

      socket.on(
        'afterAction',
        ({
          roomId,
          username,
          action,
          message,
          cards,
        }: {
          roomId: string
          username: string
          action: string
          message: string
          cards: any
        }) => {
          this.io.to(roomId).emit(`afterAction-${username}`, { action, message, cards })
        }
      )

      socket.on('UNOPOKEMON', ({ roomId, username }: { roomId: string; username: string }) => {
        this.io.to(roomId).emit('UNOPOKEMONCONTROLLER', { username })
      })

      socket.on('UNOPOKEMONTRIGGER', ({ roomId, uno }: { roomId: string; uno: boolean }) => {
        this.io.to(roomId).emit('UNOPOKEMONHOST', { uno })
      })

      socket.on('endGame', ({ roomId, username }: { roomId: string; username: string }) => {
        this.io.to(roomId).emit('endGameController', { username })
      })
    })
  }
}

export default new Ws()
