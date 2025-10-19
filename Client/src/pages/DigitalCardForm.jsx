import { Form, Input, Button, Select, Space, Divider, Flex } from 'antd';

import {
    WhatsAppOutlined,
    MailOutlined,
    LinkedinFilled,
    FacebookFilled,
    YoutubeFilled,
    GlobalOutlined,
    GithubFilled,
    XOutlined,
    UserOutlined,
    InfoCircleOutlined,
    BehanceOutlined,
    LinkOutlined,
    CloudUploadOutlined,
    RedoOutlined,
    Loading3QuartersOutlined,
    PhoneOutlined
} from '@ant-design/icons';

import { useState } from 'react';
import { useEffect } from 'react';
const { TextArea } = Input;
const linkOptions = [
    { value: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppOutlined /> },
    { value: 'phone number', label: 'Phone Number', icon: <PhoneOutlined /> },
    { value: 'email', label: 'Email', icon: <MailOutlined /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <LinkedinFilled /> },
    { value: 'facebook', label: 'Facebook', icon: <FacebookFilled /> },
    { value: 'youtube', label: 'YouTube', icon: <YoutubeFilled /> },
    { value: 'website', label: 'Website', icon: <GlobalOutlined /> },
    { value: 'github', label: 'GitHub', icon: <GithubFilled /> },
    { value: 'x', label: 'X (Twitter)', icon: <XOutlined /> },
    { value: 'behance', label: 'Behance', icon: <BehanceOutlined /> },
    { value: 'cv', label: 'CV', icon: <LinkOutlined /> },
];

const DigitalCardForm = ({
    onFinish,
    form,
    setImageFile,
    imageFile,
    handleLinkSelect,
    loading,
    selectedLinks,
    setSelectedLinks,
    disable,
    setIsDisable,
    digitalCard
}) => {
    const [previewImage, setPreviewImage] = useState(digitalCard ? digitalCard.imgSrc : '');
    const handleValidate = () => {
        form
            .validateFields()
            .then(() => {
                setIsDisable(false);
            })
            .catch(() => {
                setIsDisable(true);
            });

    };

    useEffect(() => {
        if (digitalCard) {
            let links = [];
            digitalCard.links.forEach(linkInfo => {
                form.setFieldsValue({
                    [`link_${linkInfo.linkName}`]: linkInfo.linkUrl
                });
                links.push(linkInfo.linkName);
            });
            setSelectedLinks(links);
        }
    }, [digitalCard, form, setSelectedLinks]);


    return (
        <Form
            form={form}
            name="digitalCard"
            onFinish={onFinish}
            onChange={handleValidate}
            layout="vertical"
            size="large"
            initialValues={{
                name: digitalCard?.name,
                position: digitalCard?.position,
                description: digitalCard?.description
            }}
        >
            {/* Image Upload */}
            <Form.Item
                name="image"
                label={<span className="txt3 fs-4">Profile Image</span>}
                rules={[
                    {
                        required: imageFile === 'from-server' ? false : true, message: 'Please upload your profile image!'
                    },
                    {
                        validator: () => {
                            if (imageFile && imageFile !== 'from-server') {
                                const maxSize = 1024 * 1024;
                                if (imageFile.size > maxSize) {
                                    setImageFile(null);
                                    setPreviewImage(null);
                                    return Promise.reject(
                                        "Image size must be less than or equal 1MB!"
                                    );
                                }
                            }
                            return Promise.resolve();
                        }
                    }
                ]}
            >
                <div className='img-placeholder' >
                    <Input type="file" name="image" accept="image/*"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const imageUrl = reader.result;
                                    if (e.target.files[0].size <= 1024 * 1024)
                                        setPreviewImage(imageUrl);
                                };
                                reader.readAsDataURL(e.target.files[0]);
                                setImageFile(e.target.files[0]);
                            } else setPreviewImage(null);
                        }}
                    />

                    {!previewImage &&
                        <div className='d-flex align-items-center flex-column justify-content-center'>
                            <CloudUploadOutlined />
                            <p className='fs-5 txt3 m-0'>Upload</p>
                        </div>
                    }
                    {previewImage &&
                        <img
                            src={previewImage}
                        />
                    }
                    <div className={`${previewImage ? "active" : ""} img-placeholder-overlay d-flex align-items-center flex-column justify-content-center`}>
                        <RedoOutlined />
                        <p className='fs-5 txt3 m-0'>Change</p>
                    </div>

                </div>
            </Form.Item>

            {/* Name */}
            <Form.Item
                name="name"
                label={<span className="txt3 fs-4">Full Name</span>}
                rules={[{ required: true, message: 'Please input your full name!' }]}
            >
                <Input
                    prefix={<UserOutlined className="txt3" />}
                    placeholder="Enter your full name"
                    className="custom-input"
                />
            </Form.Item>

            {/* Position */}
            <Form.Item
                name="position"
                label={<span className="txt3 fs-4">Professional Position</span>}
                rules={[{ required: true, message: 'Please input your professional position!' }]}
            >
                <Input
                    prefix={<InfoCircleOutlined className="txt3" />}
                    placeholder="e.g. Software Engineer, Designer, etc."
                    className="custom-input"
                />
            </Form.Item>

            {/* Description */}
            <Form.Item
                name="description"
                label={<span className="txt3 fs-4">Description</span>}
                rules={[{ required: true, message: 'Please input your description!' }]}
            >
                <TextArea
                    rows={6}
                    showCount
                    maxLength={500}
                    placeholder="Tell us about yourself, your skills, and what you do..."
                    className="custom-input"
                    style={{ resize: "none" }}
                    aria-label="description"
                />
            </Form.Item>

            <Divider className="txt2 fs-4 mt-5">Add Your Links</Divider>

            <Select
                mode="multiple"
                className="custom-select"
                style={{ width: '100%' }}
                placeholder="Choose Links For Adding"
                onChange={(event) => {
                    handleLinkSelect(event);
                    handleValidate();
                }}
                options={linkOptions}
                value={selectedLinks}
                notFoundContent={<span className="fs-4 txt3 text-center w-100">No Data !</span>}
                optionRender={(option) => (
                    <Space className="d-flex align-items-center fs-5">
                        {option.data.icon}
                        {option.data.label}
                    </Space>
                )}
            />

            {/* Dynamic Link Inputs */}
            {selectedLinks.map(linkKey => {
                const option = linkOptions.find(opt => opt.value === linkKey);
                return (
                    <Form.Item
                        key={linkKey}
                        name={`link_${linkKey}`}
                        label={
                            <div className="d-flex align-items-center justify-content-between">
                                <span className="txt3 fs-4">
                                    <Space className='d-flex align-items-center justify-content-center'>
                                        <span className='fs-5'>{option.icon}</span>
                                        <span>{option.label}</span>
                                    </Space>
                                </span>
                            </div>
                        }
                        rules={[
                            { required: true, message: `Please input your ${option.label}!` },
                        ]}
                    >
                        <Input
                            placeholder={generatePlaceholder(option.label)}
                            className="custom-input"
                        />
                    </Form.Item>
                );
            })}


            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading && { icon: <div className='d-flex'><Loading3QuartersOutlined spin /></div> }}
                    className="w-100 login-btn mt-4 fs-4 d-flex align-items-center justify-content-center"
                    size="large"
                    iconPosition="end"
                    disabled={disable || loading}
                >
                    {digitalCard ? "Update Digital Card" : "Create Digital Card"}
                </Button>
            </Form.Item>
        </Form>
    );
}

const generatePlaceholder = (label) => {
    label = label.toLowerCase();
    switch (label) {
        case 'whatsapp':
            return 'Enter your WhatsApp number (e.g. +201115793826)';
        case 'phone number':
            return 'Enter your phone number (e.g. +201115793826)';
        case 'email':
            return 'Enter your email address (e.g. mohammed.ashraf.zwam@gmail.com)';
        default:
            return `Enter your ${label} URL`;
    }
}

export default DigitalCardForm;