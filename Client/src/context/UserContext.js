import { createContext } from "react";

export const UserContext = createContext({
    user: null,
    setUser: null,
    accessToken: null,
    setAccessToken: null
});

