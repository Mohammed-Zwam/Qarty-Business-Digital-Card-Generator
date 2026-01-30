import { Modal, QRCode, Skeleton } from 'antd';
import { useSearchParams } from "react-router-dom";

import {
    WhatsAppOutlined,
    MailOutlined,
    LinkedinFilled,
    FacebookFilled,
    YoutubeFilled,
    GlobalOutlined,
    GithubFilled,
    XOutlined,
    BehanceOutlined,
    ExportOutlined,
    ShareAltOutlined,
    DownloadOutlined,
    WarningOutlined,
    QrcodeOutlined,
    PhoneOutlined,
    LinkOutlined
} from '@ant-design/icons';
import "../styles/Card.css";
import Header from '../components/Header';
import React, { useEffect, useState } from 'react';
import { getDigitalCard } from '../api/DigitalCard';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { downloadCanvasQRCode, handleShare } from '../util/QrCodeMethods';
const linksIcons = {
    whatsapp: <WhatsAppOutlined />,
    email: <MailOutlined />,
    'phone number': <PhoneOutlined />,
    linkedin: <LinkedinFilled />,
    facebook: <FacebookFilled />,
    youtube: <YoutubeFilled />,
    website: <GlobalOutlined />,
    github: <GithubFilled />,
    X: <XOutlined />,
    behance: <BehanceOutlined />,
    cv: <LinkOutlined />,
}


const Card = () => {
    const [params] = useSearchParams();
    const udc = params.get("udc");
    const username = params.get("username");
    const { user, setUser } = useContext(UserContext);

    const [isLoading, setLoading] = useState(true);
    const [digitalCard, setDigitalCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);



    useEffect(() => {
        const fetchData = async () => {
            if (!udc) {
                setLoading(false);
                return;
            }
            const res = await getDigitalCard(udc);

            if (res.ok) {
                setDigitalCard({ ...res.digitalCard });
                if (user && user?.userID && user?.userID === udc) {
                    setUser({ ...user, digitalCard: res.digitalCard });
                }
            }
            setLoading(false);

        }
        if (user && user?.userID && user?.userID === udc && user.digitalCard) {
            setDigitalCard({ ...user.digitalCard });
            setLoading(false);
        } else fetchData();
    }, [setUser, udc, user]);



    return (
        <React.Fragment>


            <div className="digital-card-container mt-5">
                {
                    user && user?.userID && user?.userID === udc &&
                    <Modal
                        title={<h1 className='fs-1 txt4 fw-bold border-btm mb-3'>Digital Card QR Code</h1>}
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        open={isModalOpen}
                        footer={
                            <div className='d-flex align-items-center justify-content-end gap-2'>
                                <button className='btn download btn-outline-primary align-self-center fs-5 py-1 border-dotted fit-content-width justify-content-center d-flex align-items-center justify-content-center gap-2'
                                    onClick={() => downloadCanvasQRCode(digitalCard.name, setIsModalOpen)}
                                >
                                    Download <DownloadOutlined />
                                </button>
                                <button className='btn btn-primary align-self-center fs-5 py-1 border-dotted fit-content-width d-flex align-items-center justify-content-center gap-2'
                                    onClick={() => { handleShare(digitalCard, username, udc, setIsModalOpen) }}
                                >
                                    Share <ShareAltOutlined />
                                </button>
                            </div>
                        }
                        onCancel={() => setIsModalOpen(false)}
                    >
                        <div id="myqrcode" className='d-flex align-items-center justify-content-center' >
                            <QRCode
                                type={"canvas"}
                                value={`${import.meta.env.VITE_CLIENT_URL}/card?username=${username}&udc=${udc}`}
                                color="#000"
                                bgColor="#ddd"
                                size={200}
                                style={{ marginBottom: 16 }}
                            />
                        </div>
                    </Modal>
                }


                <div className="digital-card overlay-bg main-border motion">
                    <Skeleton
                        avatar
                        active
                        paragraph={{ rows: 8 }}
                        loading={isLoading}
                        size={"large"}
                    />
                    {!isLoading && <DigitalCardContent digitalCard={digitalCard} setIsModalOpen={setIsModalOpen} udc={udc} />}
                </div>


            </div>
        </React.Fragment >
    );
}


const DigitalCardContent = ({ digitalCard, setIsModalOpen, udc }) => {
    const { user } = useContext(UserContext);

    const mapLink = (linkName, linkUrl) => {
        if (linkName === "whatsapp") {
            return `https://wa.me/${linkUrl}`;
        } else if (linkName === "email") {
            return `mailto:${linkUrl}`;
        } else if (linkName === "phone-number") {
            return `tel:${linkUrl}`;
        } else {
            return linkUrl;
        }
    }


    return (
        <>
            {
                digitalCard ?
                    <>
                        < div className="card-header" >
                            <div className="profile-image">
                                <img src={digitalCard.imgSrc} alt={digitalCard.name} />
                                {
                                    user && user?.userID && user?.userID === udc &&
                                    <div className="qr-code" onClick={() => { setIsModalOpen(true) }}>
                                        <QrcodeOutlined className='fs-4' />
                                    </div>
                                }
                            </div>
                            <div className="profile-info">
                                <h1 className='display-5 m-0 fw-medium'>{digitalCard.name}</h1>
                                <h3 className='fs-2 m-0 mt-2'>{digitalCard.position}</h3>
                            </div>
                        </ div>

                        <div className="card-body">
                            <p className="user-description fs-4">{digitalCard.description}</p>
                        </div>
                        {
                            digitalCard.links.length !== 0 &&
                            <div className="card-footer">
                                <div className="social-links">
                                    {digitalCard.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={mapLink(link.linkName, link.linkUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-link"
                                        >
                                            <div className='d-flex align-items-center gap-2'>
                                                {linksIcons[link.linkName]}
                                                <p className='fs-4 m-0 text-capitalize'>{link.linkName}</p>
                                            </div>
                                            <ExportOutlined className='open-lnk-icon' />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        }

                    </>
                    :
                    <h1 className='txt3 flex-row m-0 fs-1 d-flex align-items-center gap-3 not-found-message'>
                        <WarningOutlined />
                        Oops! This card doesn’t exist
                    </h1>
            }
        </>
    )
}

export default Card;





