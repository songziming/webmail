class UnknownUser extends Error
  constructor: (@message = "Unknown user.") ->
    @name = 'UnknownUser'
    Error.captureStackTrace(this, UnknownUser)

class LoginError extends Error
  constructor: (@message = "Wrong password or username.") ->
    @name = 'LoginError'
    Error.captureStackTrace(this, LoginError)

class InvalidAccess extends Error
  constructor: (@message = "Invalid access.") ->
    @name = 'InvalidAccess'
    Error.captureStackTrace(this, InvalidAccess)

class UnknownMail extends Error
  constructor: (@message = "Unknown mail.") ->
    @name = 'UnknownMail'
    Error.captureStackTrace(this, UnknownMail)


module.exports = {
  UnknownUser : UnknownUser
  LoginError : LoginError
  InvalidAccess : InvalidAccess
  UnknownMail : UnknownMail
}
