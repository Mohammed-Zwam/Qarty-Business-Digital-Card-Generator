import { useState } from "react";
import { UserContext } from "./UserContext";



const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                accessToken,
                setAccessToken
            }}
        >
            {children}
        </UserContext.Provider>
    );
}



export default UserProvider;