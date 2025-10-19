import { message, notification } from "antd";
import { AlertContext } from "./AlertContext";


const AlertProvider = ({ children }) => {
    const [api, notificationHolder] = notification.useNotification();
    const [messageApi, messageHolder] = message.useMessage();

    const openNotification = (message, description, type /* 'success' | 'info' | 'warning' | 'error' */) => {
        api[type]({
            message: message,
            description: description,
            duration: 3,
            showProgress: true,
        });
    };

    const openMessage = (content, type) => {
        messageApi
            .open({
                type,
                content,
                duration: 2,
            })
    };


    return (
        <AlertContext.Provider value={{ openNotification, openMessage }}>
            {notificationHolder}
            {messageHolder}
            {children}
        </AlertContext.Provider>
    );
}

export default AlertProvider;

