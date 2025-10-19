import { useContext, useState } from 'react';
import { Form } from 'antd';

import { UserContext } from "../context/UserContext";


import '../styles/Form.css';
import Header from '../components/Header';
import { createDigitalCard } from '../api/DigitalCard';
import { AlertContext } from '../context/AlertContext';
import { useNavigate } from 'react-router-dom';
import DigitalCardForm from './DigitalCardForm';


const CreateDigitalCard = ({ setViewAnimationCongrats }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedLinks, setSelectedLinks] = useState([]);
    const [imageFile, setImageFile] = useState('');
    const { accessToken, setAccessToken, setUser, user } = useContext(UserContext);
    const { openMessage, openNotification } = useContext(AlertContext);
    const navigate = useNavigate();
    const [disable, setIsDisable] = useState(true);



    const handleLinkSelect = (value) => {
        setSelectedLinks(value || []);
    };


    const onFinish = async (values) => {
        setLoading(true);
        let res;
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('position', values.position);

            const links = selectedLinks.map(linkName => {
                const linkUrl = values[`link_${linkName}`];
                return { linkUrl, linkName };
            });
            formData.append('links', JSON.stringify(links));

            res = await createDigitalCard(formData, { accessToken, setAccessToken });
            if (res.status === 201) {
                setUser({ ...user, hasDigitalCard: true, digitalCard: res.digitalCard });
                navigate("/profile");
                openMessage('Digital card created successfully!', 'success');
                setViewAnimationCongrats(true);
            } else if (res.status === 401) {
                openNotification('Unauthorized !!', "You are not authorized to create a digital card", 'error');
                setUser(null);
                setAccessToken(null);
                navigate("/login");
            } else {
                openNotification("Failed to create digital card", res.message, 'error');
                setIsDisable(true);
            }
        } catch {
            openNotification("Internal Server Error", res?.message, 'error');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="form-card overlay-bg main-border motion" style={{ maxWidth: "650px" }}>
                    <div className="form-card-body p-4">
                        <div className="text-center mb-4">
                            <h1 className="txt4 display-4 txt-shadow fw-semibold">Create Your Digital Card</h1>
                        </div>
                        <DigitalCardForm
                            onFinish={onFinish}
                            form={form}
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                            handleLinkSelect={handleLinkSelect}
                            loading={loading}
                            selectedLinks={selectedLinks}
                            disable={disable}
                            setIsDisable={setIsDisable}
                        />
                    </div>
                </div>
            </div>
        </div >
    );
};


export default CreateDigitalCard;
