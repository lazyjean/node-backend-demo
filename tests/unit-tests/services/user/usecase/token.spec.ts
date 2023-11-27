import token from '../../../../../src/services/user/usecase/token'
test('Generated token should be verified succeed', async () => {
    const tk = token.generate('root', '1h')
    const decodeed = token.verify(tk)
    expect(decodeed).toEqual({
        username: 'root',
        iat: expect.any(Number),
        exp: expect.any(Number)
    })
})
