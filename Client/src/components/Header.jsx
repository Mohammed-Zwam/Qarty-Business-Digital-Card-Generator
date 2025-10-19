import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Modal } from 'antd';
import { logout } from '../api/Auth';
import { AlertContext } from '../context/AlertContext';
import { useLocation } from 'react-router-dom';
import PoweredByComponent from './PowerdByComponent';

const Header = () => {
    const { user } = useContext(UserContext);
    const [option, setOption] = useState('');
    const location = useLocation();
    const renderOptions = {
        home: <Registration />,
        protected: <ProtectedHeader />
    }

    useEffect(() => {
        if (!user) {
            if (location.pathname.startsWith('/card')) {
                setOption('powered-by-header');
            } else {
                setOption('home');
            }
        } else {
            setOption('protected');
        }
    }, [location.pathname, user]);

    {/* <PoweredByComponent /> */ }
    return (
        <div className='container'>
            {
                option === 'powered-by-header' ?
                    <PoweredByComponent />
                    :
                    <header className='txt-shadow py-2 d-flex justify-content-between align-items-center'>
                        <Link to={option === "protected" ? '/profile' : '/'} className='text-decoration-none' >
                            <h1 className='platform-logo display-4 fw-semibold'>Qarty</h1>
                        </Link>
                        {option && renderOptions[option]}
                    </header>
            }
        </div>

    );
}


const Registration = () => {
    return (
        <div>
            <Link to="/signup" className='btn btn-outline-primary btn-lg  py-0 rounded-pill px-4 me-2 fs-4'>Signup</Link>
            <Link to="/login" className='btn btn-primary btn-lg py-0 rounded-pill px-4 fs-4'>Login</Link>
        </div>
    );
};

const ProtectedHeader = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { openMessage } = useContext(AlertContext);
    const { setUser, setAccessToken } = useContext(UserContext);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        const res = await logout();
        if (res.ok) {
            setUser(null);
            setAccessToken(null);
            navigate("/");
            openMessage(res.message, "success");
        } else {
            openMessage(res.message, "error");
        }
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <button
                onClick={showModal}
                className='btn btn-outline-danger btn-lg py-0 rounded-pill px-4 fs-4'>
                Logout
            </button>
            <Modal
                title={<h2 className='fs-1 txt4 fw-bold'>Logout Confirmation</h2>}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={<p className='fs-4 m-0'>Confirm</p>}
                cancelText={<p className='fs-4 m-0'>Cancel</p>}
            >
                <p className='fs-3'>Are you sure To Logout ?</p>
            </Modal>
        </>

    )
}

export default Header;