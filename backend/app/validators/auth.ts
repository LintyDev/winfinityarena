import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .maxLength(100)
      .trim()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('username', value).first()
        return !match
      }),
    password: vine.string().minLength(8),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string().maxLength(100).trim(),
    password: vine.string().minLength(8),
  })
)

export const editUserValidator = vine.compile(
  vine.object({
    id: vine.number(),
    username: vine
      .string()
      .maxLength(100)
      .trim()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('username', value).first()
        return !match
      })
      .optional(),
    password: vine.string().minLength(8).optional(),
    avatar: vine.string().optional(),
    oldPassword: vine.string().optional(),
  })
)
