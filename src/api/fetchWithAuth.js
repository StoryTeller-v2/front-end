import { getAccessToken, getRefreshToken, getUser, storeTokens, removeTokens } from '../utils/storage.js';
import Config from '../config.js';
import { decode as atob } from 'base-64';

const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Date.now() / 1000;
    } catch (error) {
        console.error('토큰 검증 중 에러:', error);
        return true;
    }
};

const getNewTokens = async (refreshToken) => {
    try {
        const user = await getUser();
        console.log("토큰 재발급 시도. 유저:", user);
        console.log("현재 refresh 토큰:", refreshToken);

        const response = await fetch(`${Config.API_BASE_URL}/reissue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'refresh': refreshToken,
            },
            body: JSON.stringify({
                username: user,
            }),
        });

        console.log('토큰 재발급 응답 상태:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('토큰 재발급 실패 응답:', errorData);
            throw new Error(errorData.message || '토큰 재발급에 실패했습니다');
        }

        const newAccessToken = response.headers.get('access');
        const newRefreshToken = response.headers.get('refresh');

        if (!newAccessToken || !newRefreshToken) {
            console.error('새로운 토큰이 없음:', response.headers);
            throw new Error('새로운 토큰을 받지 못했습니다');
        }

        await storeTokens(newAccessToken, newRefreshToken);
        console.log('새 토큰 저장 완료');

        return newAccessToken;
    } catch (error) {
        console.error('토큰 재발급 프로세스 에러:', error);
        await removeTokens();
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
};

const fetchWithAuth = async (url, options = {}) => {
    try {
        let accessToken = await getAccessToken();
        let refreshToken = await getRefreshToken();

        if (!accessToken || !refreshToken) {
            console.error('토큰이 없음');
            throw new Error('로그인이 필요합니다');
        }

        // 토큰 만료 체크
        if (isTokenExpired(accessToken)) {
            console.log('액세스 토큰 만료됨, 재발급 시도');
            try {
                accessToken = await getNewTokens(refreshToken);
            } catch (error) {
                console.error('토큰 재발급 실패:', error);
                throw error;
            }
        }

        // API 요청 실행
        const response = await fetch(`${Config.API_BASE_URL}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                'access': accessToken,
            },
        });

        // 401 에러 처리
        if (response.status === 401) {
            console.log(`401 에러 발생. URL: ${url}`);
            try {
                accessToken = await getNewTokens(refreshToken);
                return fetch(`${Config.API_BASE_URL}${url}`, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'access': accessToken,
                    },
                });
            } catch (error) {
                console.error('토큰 재발급 및 재요청 실패:', error);
                throw error;
            }
        }

        return response;
    } catch (error) {
        console.error('API 요청 실패:', error);
        throw error;
    }
};

export default fetchWithAuth;
