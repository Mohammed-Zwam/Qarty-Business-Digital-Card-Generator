import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { refreshToken } from "../api/Auth";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../context/AlertContext";
import { useLocation } from 'react-router-dom';
import { Loading3QuartersOutlined } from "@ant-design/icons";


const Auth = () => {
    const navigate = useNavigate();
    const { openNotification } = useContext(AlertContext);
    const { user, accessToken, setUser, setAccessToken } = useContext(UserContext);
    const [isChecked, setIsChecked] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState('pending');
    const location = useLocation();



    useEffect(() => {
        const validations = (hasDigitalCard) => {
            if (hasDigitalCard && location.pathname.startsWith("/create-card")) {
                navigate("/profile");
                openNotification("Access Denied", "You have digital card already !", "info");
            } else if (!hasDigitalCard && location.pathname.startsWith("/manage-card")) {
                navigate("/profile");
                openNotification("Access Denied", "You don’t have a digital card", "error");
            }
            else {
                const notAuthorizedPages = [
                    "login",
                    "signup"
                ]
                const url = location.pathname.slice(1);
                const isExist = notAuthorizedPages.findIndex(path => (url === path || url.length === 0));
                if (isExist !== -1) {
                    navigate("/profile");
                    openNotification("Access Denied", "You Logged Already !", "info");
                }
            }
            setIsChecked(true);
        }

        const checkToken = async () => {
            const res = await refreshToken();
            if (res.ok) {
                setUser(res.user);
                setAccessToken(res.accessToken);
            }
            setIsAuthorized('checked');
        }

        const checkAuthority = async () => {
            if (isAuthorized === "pending") checkToken();
            else {
                if (!user || !accessToken) {
                    const url = location.pathname.slice(1);
                    if (!(url === "login" || url === "signup" || url === "card" || url.length === 0)) {
                        navigate("/login");
                        openNotification("Access Denied", "Unauthorize, Please log in to continue", "error");
                    }
                    else setIsChecked(true);
                } else validations(user.hasDigitalCard);
            }
        }
        setIsChecked(false);
        checkAuthority();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, navigate, location.key, openNotification, setUser, setAccessToken, isAuthorized]);

    return (
        <>
            {isChecked ?
                <Outlet />
                :
                <div className="vh-100 auth-loading d-flex align-items-center justify-content-center">
                    <Loading3QuartersOutlined spin style={{ fontSize: "50px" }} />
                </div>
            }
        </>
    );
}

export default Auth;