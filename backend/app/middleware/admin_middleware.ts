import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Roles from '../Enums/roles.js'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (ctx.auth.user?.role !== Roles.ADMIN) {
      return ctx.response.json({ message: 'You are not allowed to access this route' })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
