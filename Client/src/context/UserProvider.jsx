import { useState } from "react";
import { UserContext } from "./UserContext";



const UserProvider = ({ children }) => {
    const [user, setUser] = useState('checking');
    const [accessToken, setAccessToken] = useState('checking');
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