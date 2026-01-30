import { refreshToken } from "./Auth";


export const getDigitalCard = async (udc) => {
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/api/digital-card/${udc}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return await res.json();
}

export const createDigitalCard = async (digitalCardInput, tokenState) => {
    let res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/api/digital-card`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${tokenState.accessToken}`
        },
        body: digitalCardInput
    });
    if (res.status === 403) {
        let refreshTokenRes = await refreshToken();
        if (refreshTokenRes.ok && refreshTokenRes.accessToken) {
            tokenState.setAccessToken(refreshTokenRes.accessToken);
            return await createDigitalCard(
                digitalCardInput,
                { accessToken: refreshTokenRes.accessToken, setAccessToken: tokenState.setAccessToken }
            );
        } else {
            refreshTokenRes.status = 401;
            return refreshTokenRes;
        }
    } else {
        return await formatRes(res);
    }
}

export const updateDigitalCard = async (digitalCardInput, tokenState) => {
    let res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/api/digital-card`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${tokenState.accessToken}`
        },
        body: digitalCardInput
    });

    if (res.status === 403) {
        const refreshTokenRes = await refreshToken();
        if (refreshTokenRes.ok && refreshTokenRes.accessToken) {
            tokenState.setAccessToken(refreshTokenRes.accessToken);
            return await updateDigitalCard(
                digitalCardInput,
                { accessToken: refreshTokenRes.accessToken, setAccessToken: tokenState.setAccessToken }
            );
        } else {
            refreshTokenRes.status = 401;
            return refreshTokenRes;
        }
    } else {
        return await formatRes(res);
    }
}

export const deleteDigitalCard = async (tokenState) => {
    let res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/api/digital-card`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${tokenState.accessToken}`
        }
    });

    if (res.status === 403) {
        const refreshTokenRes = await refreshToken();
        if (refreshTokenRes.ok && refreshTokenRes.accessToken) {
            tokenState.setAccessToken(refreshTokenRes.accessToken);
            return await deleteDigitalCard({ accessToken: refreshTokenRes.accessToken, setAccessToken: tokenState.setAccessToken });
        } else {
            refreshTokenRes.status = 401;
            return refreshTokenRes;
        }
    } else {
        return await formatRes(res);
    }
}

const formatRes = async (res) => {
    const status = res.status;
    res = await res.json();
    res.status = status;
    return res;
}