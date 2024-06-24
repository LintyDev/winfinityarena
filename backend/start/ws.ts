import app from '@adonisjs/core/services/app'
import Ws from '#services/w_service'
import { Socket } from 'socket.io'

app.ready(() => {
  Ws.boot()

  Ws.io.on('connection', (socket: Socket) => {
    console.log('socket connected', socket.id)
  })
})
