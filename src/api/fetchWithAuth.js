import { getAccessToken, getRefreshToken, getUser, storeTokens, removeTokens, decodeBase64 } from '../utils/storage.js';
import Config from '../config.js';

const isTokenExpired = (token) => {
    const payload = JSON.parse(decodeBase64(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
};

const getNewTokens = async (refreshToken) => {
    const user = await getUser();
    const response = await fetch(`${Config.API_BASE_URL}/reissue`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'refresh': refreshToken,
        },
        body: JSON.stringify({ username: user }),
    });

    const data = await response.json();

    if (response.ok) {
        await storeTokens(data.accessToken, data.refreshToken);
        return data.accessToken;
    } else {
        await removeTokens();
        throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
};

const fetchWithAuth = async (url, options = {}) => {
    let accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    if (isTokenExpired(accessToken)) {
        accessToken = await getNewTokens(refreshToken);
    }

    const headers = {
        ...options.headers,
        'access': accessToken,
    };

    return fetch(`${Config.API_BASE_URL}${url}`, {
        ...options,
        headers,
    });
};

export default fetchWithAuth;
