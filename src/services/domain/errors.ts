const UserNotExists = new Error('User not exists')
const UserAlreadyExists = new Error('User already exists')
const InvalidPassword = (message: string) => new Error('Invalid password, ' + message)
const InvalidToken = new Error('Invalid token')
const InternalServerError = new Error('Internal server error')
const AccountIsLocked = new Error('Account has been locked in 5 minutes')
const InvalidParameter = new Error('Invalid parameter')
const PasswordTooShort = new Error('Password too short')

export default {
    InvalidParameter,
    PasswordTooShort,
    UserAlreadyExists,
    UserNotExists,
    InvalidPassword,
    InvalidToken,
    AccountIsLocked,
    InternalServerError
}
