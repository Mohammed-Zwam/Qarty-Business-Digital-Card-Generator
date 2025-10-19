export const login = async (userInput) => {
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInput)
    });
    const data = await res.json();
    return data;
}

export const refreshToken = async () => {
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
    });
    const data = await res.json();
    return data;
}

export const logout = async () => {
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
    });
    const data = await res.json();
    return data;
}

export const signup = async (userInput) => {
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInput)
    });
    const data = await res.json();
    return data;
}