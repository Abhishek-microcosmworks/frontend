import { authenticationToken } from '../../../../db/model/index.js';

export async function saveToken(token, email, userId) {
    const expirationTime = Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60;

    try {
        const authToken = await authenticationToken.create({
            token,
            tokenExp: expirationTime,
            email,
            userId
        });

        return { error: false, data: authToken };
    } catch (error) {
        console.log(error.message);
        return { error: true, message: error.message };
    }
}