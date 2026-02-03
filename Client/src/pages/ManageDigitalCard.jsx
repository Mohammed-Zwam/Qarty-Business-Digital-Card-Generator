import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { UserContext } from "../context/UserContext";
import { Button, Divider, Form, Modal, QRCode } from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  Loading3QuartersOutlined,
  QrcodeOutlined,
  ScanOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { downloadCanvasQRCode, handleShare } from "../util/QrCodeMethods";
import {
  deleteDigitalCard,
  getDigitalCard,
  updateDigitalCard,
} from "../api/DigitalCard";
import { AlertContext } from "../context/AlertContext";
import { Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import DigitalCardForm from "./DigitalCardForm";

const { Paragraph } = Typography;

const sections = ["info", "update", "delete"];
const ManageDigitalCard = () => {
  const { setUser, user } = useContext(UserContext);
  const { openNotification } = useContext(AlertContext);
  const [activeSection, setActiveSection] = useState("info");

  const icons = {
    delete: <DeleteOutlined />,
    update: <EditOutlined />,
    info: <InfoCircleOutlined />,
  };
  const renderedComponents = {
    info: <InfoComponent />,
    update: <UpdateComponent />,
    delete: <DeleteComponent />,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user.userID) {
        return;
      }
      const res = await getDigitalCard(user.userID);
      if (res.ok) {
        setUser({ ...user, digitalCard: res.digitalCard });
      } else {
        openNotification("Internal Server Error", res.message, "error");
      }
    };
    if (!user.digitalCard && user.hasDigitalCard) fetchData();
  }, [openNotification, setUser, user, user.userID]);

  return (
    <div style={{ position: "relative" }}>
      <div className="manage-page d-flex mt-3 justify-content-center align-items-center">
        <div
          className="form-card overlay-bg main-border motion"
          style={{ maxWidth: "700px" }}
        >
          <div className="form-card-body p-3">
            <div className="text-center mb-4">
              <h1 className="display-4 txt4 txt-shadow fw-semibold">
                Manage Your Digital Card
              </h1>
            </div>

            <ul className="manage-card-options mt-3 mb-5">
              {sections.map((sec, index) => {
                return (
                  <li
                    key={index}
                    className={`${activeSection === sec ? "active-sec" : ""} fs-4  d-flex align-items-center gap-2`}
                    onClick={() => setActiveSection(sec)}
                  >
                    {icons[sec]}
                    {sec}
                  </li>
                );
              })}
            </ul>

            {renderedComponents[activeSection]}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoComponent = () => {
  const { user } = useContext(UserContext);
  return (
    <div id="info">
      <Divider orientation="left" dashed={true} size="large">
        <h2 className="txt3 fs-1">Digital Card Info</h2>
      </Divider>

      <div>
        <h3 className="digital-info-title fs-3 mb-3 mt-0 txt2 d-flex algin-items-center gap-2 ">
          <ScanOutlined
            className="fs-4 label-icon"
            style={{ color: "var(--bg-2)" }}
          />
          Scan the QR or copy the link below to access your card.
        </h3>
        <div
          id="myqrcode"
          className="d-flex align-items-center justify-content-center gap-3 flex-column"
        >
          <QRCode
            type={"canvas"}
            value={`${import.meta.env.VITE_CLIENT_URL}/card?username=${user.username}&udc=${user.userID}`}
            color="#000"
            bgColor="#fff"
            size={200}
          />
          <Paragraph
            copyable={{
              text: `${import.meta.env.VITE_CLIENT_URL}/card?username=${user.username}&udc=${user.userID}`,
            }}
            className="fs-6 txt1 m-0 fw-medium"
          >
            Copy & Share your Digital Card URL
          </Paragraph>
        </div>

        <h3 className="digital-info-title fs-3 mb-3 txt2 mt-5 txt2 d-flex algin-items-center gap-2">
          <QrcodeOutlined className="fs-4" style={{ color: "var(--bg-2)" }} />
          Keep your digital card handy — view, download, or share it anytime.
        </h3>
        <div className="d-flex align-items-center justify-content-center flex-row gap-3 mb-2">
          <button
            className="btn btn-primary align-self-center fs-5 py-1 border-dotted fit-content-width d-flex align-items-center justify-content-center gap-2"
            onClick={() => {
              downloadCanvasQRCode(
                user.digitalCard?.name || user.username,
                null,
              );
            }}
          >
            Download <DownloadOutlined />
          </button>
          <button
            className="btn btn-primary align-self-center fs-5 py-1 border-dotted fit-content-width d-flex align-items-center justify-content-center gap-2"
            onClick={() => {
              handleShare(user.digitalCard, user.username, user.userID, null);
            }}
          >
            Share <ShareAltOutlined />
          </button>
          <Link
            to={`${import.meta.env.VITE_CLIENT_URL}/card?username=${user.username}&udc=${user.userID}`}
            className="btn btn-primary align-self-center fs-5 py-1 border-dotted fit-content-width d-flex align-items-center justify-content-center gap-2"
          >
            View <ExportOutlined />
          </Link>
        </div>
      </div>
    </div>
  );
};

const UpdateComponent = () => {
  const { accessToken, setAccessToken, setUser, user } =
    useContext(UserContext);
  const { openMessage, openNotification } = useContext(AlertContext);
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [imageFile, setImageFile] = useState("from-server");
  const [disable, setIsDisable] = useState(true);

  const handleLinkSelect = (value) => {
    setSelectedLinks(value || []);
  };

  const onFinish = async (values) => {
    setUpdateLoading(true);
    let res;
    try {
      const formData = new FormData();
      if (imageFile !== "from-server") formData.append("image", imageFile);
      else formData.append("imgSrc", user.digitalCard?.imgSrc);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("position", values.position);

      const links = selectedLinks.map((linkName) => {
        const linkUrl = values[`link_${linkName}`];
        return { linkUrl, linkName };
      });
      formData.append("links", JSON.stringify(links));

      res = await updateDigitalCard(formData, { accessToken, setAccessToken });
      if (res.status === 200) {
        navigate("/profile");
        openMessage("Digital card updated successfully!", "success");
        console.log(res.digitalCard);
        setUser({ ...user, digitalCard: res.digitalCard });
      } else if (res.status === 401) {
        openNotification(
          "Unauthorized !!",
          "You are not authorized to create a digital card",
          "error",
        );
        setUser(null);
        setAccessToken(null);
        navigate("/login");
      } else {
        openNotification(`Failed to update digital card`, res.message, "error");
        setIsDisable(true);
      }
    } catch {
      openNotification("Internal Server Error", "", "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div id="update">
      <Divider orientation="left" dashed={true} size="large">
        <h2 className="txt3 fs-1">Update Digital Card</h2>
      </Divider>

      <div
        className="p-4"
        style={{
          background: "#09093eff",
          borderRadius: 10,
          border: "1px dashed #999",
        }}
      >
        {user.digitalCard ? (
          <DigitalCardForm
            onFinish={onFinish}
            form={form}
            imageFile={imageFile}
            setImageFile={setImageFile}
            handleLinkSelect={handleLinkSelect}
            loading={updateLoading}
            selectedLinks={selectedLinks}
            setSelectedLinks={setSelectedLinks}
            disable={disable}
            setIsDisable={setIsDisable}
            digitalCard={user.digitalCard}
          />
        ) : (
          <div className="d-flex w-100 align-items-center justify-content-center">
            <Loading3QuartersOutlined spin style={{ fontSize: 30 }} />
          </div>
        )}
      </div>
    </div>
  );
};

const DeleteComponent = () => {
  const { accessToken, setAccessToken, setUser, user } =
    useContext(UserContext);
  const { openMessage, openNotification } = useContext(AlertContext);

  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setDeleteLoading(true);
    setIsModalOpen(false);
    let res;
    try {
      res = await deleteDigitalCard({ accessToken, setAccessToken });
      if (res.status === 200) {
        openMessage("Digital card deleted successfully!", "success");
        setUser({ ...user, hasDigitalCard: false });
        navigate("/profile");
      } else if (res.status === 401) {
        openNotification(
          "Unauthorized !!",
          "You are not authorized to create a digital card",
          "error",
        );
        setUser(null);
        setAccessToken(null);
        navigate("/login");
      } else {
        openNotification(`Failed to delete digital card`, res.message, "error");
      }
    } catch {
      openNotification("Internal Server Error", "", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div id="delete">
      <Divider orientation="left" dashed={true} size="large">
        <h2 className="txt3 fs-1">Delete Digital Card</h2>
      </Divider>

      <p className="fs-3 gap-2 fw-medium text-center" style={{ color: "red" }}>
        ⚠️ Deleting your Digital Card will permanently remove all related data.
      </p>
      <Modal
        title={
          <h1 className="fs-1 fw-bold" style={{ color: "darkred" }}>
            Delete the digital card
          </h1>
        }
        okText={<p className="fs-4 m-0 p-2">Confirm</p>}
        cancelText={<p className="fs-4 m-0 p-2">Cancel</p>}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h1 className="fs-3 mb-4">Are you sure to delete this digital card?</h1>
      </Modal>

      <Button
        type="primary"
        color="danger"
        danger={true}
        loading={
          deleteLoading && {
            icon: (
              <div className="d-flex">
                <Loading3QuartersOutlined spin />
              </div>
            ),
          }
        }
        className="w-75 m-auto delete-btn mt-4 fs-4 d-flex align-items-center justify-content-center"
        size="large"
        iconPosition="end"
        disabled={deleteLoading}
        onClick={showModal}
      >
        Delete
      </Button>
    </div>
  );
};
export default ManageDigitalCard;
