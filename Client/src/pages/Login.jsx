import { useContext, useState } from "react";
import { Form, Input, Button, Divider } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  Loading3QuartersOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../styles/Form.css";
import { login, signup } from "../api/Auth";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../context/AlertContext";
import { UserContext } from "../context/UserContext";
import { auth, googleProvider } from "../util/firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  const { openMessage, openNotification } = useContext(AlertContext);
  const { setUser, setAccessToken } = useContext(UserContext);
  const [disable, setIsDisable] = useState(true);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await login(values);
      if (res.ok && res.user && res.accessToken) {
        openMessage("Login successful", "success");
        setAccessToken(res.accessToken);
        setUser(res.user);
        navigate("/profile");
      } else {
        openNotification("Login failed", res.message, "error");
        setIsDisable(true);
      }
    } catch {
      openMessage("Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const creationTime = user.metadata.creationTime;
      const lastSignInTime = user.metadata.lastSignInTime;
      const username = user.displayName.replace(" ", "-");
      const email = user.email;
      const password = user.uid + import.meta.env.VITE_FIREBASE_PASSWORD_SALT;
      const isNewUser = creationTime === lastSignInTime;
      setGoogleAuthLoading(true);

      if (isNewUser) {
        const res = await signup({ username, email, password });
        if (!res.ok) {
          openNotification("Account creation failed", res.message, "error");
        }
      }

      const res = await login({ email, password });
      if (res.ok && res.user && res.accessToken) {
        openMessage("Login successful", "success");
        setAccessToken(res.accessToken);
        setUser(res.user);
        navigate("/profile");
      } else {
        openNotification("Login failed", res.message, "error");
      }
      setGoogleAuthLoading(false);
    } catch (error) {
      console.error("Error logging in with Google:", error);
      setGoogleAuthLoading(false);
    }
  };

  return (
    <div>
      {googleAuthLoading && (
        <div className="google-auth-loading">
          <Loading3QuartersOutlined spin />
        </div>
      )}
      <div className="d-flex justify-content-center">
        <div className="form-card overlay-bg main-border motion">
          <div className="form-card-body p-4">
            <div className="text-center mb-4">
              <h1 className="txt4 txt-shadow fw-semibold">
                Sign in to your account
              </h1>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              onFieldsChange={() => {
                const hasErrors = form
                  .getFieldsError()
                  .some(({ errors }) => errors.length > 0);

                setIsDisable(hasErrors);
              }}
              validateTrigger="onBlur"
              size="large"
            >
              <Form.Item
                name="email"
                label={<span className="txt3 fs-4">Email</span>}
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="txt3" />}
                  placeholder="Enter your Email"
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="txt3 fs-4">Password</span>}
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="txt3" />}
                  placeholder="Enter your password"
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={
                    loading && {
                      icon: (
                        <div className="d-flex">
                          <Loading3QuartersOutlined spin />
                        </div>
                      ),
                    }
                  }
                  className="w-100 login-btn mt-4 fs-4 d-flex align-items-center justify-content-center"
                  size="large"
                  iconPosition="end"
                  disabled={disable || loading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>

            <div className="sign-up text-center mt-4 fs-4">
              <span className="txt2">Don't have an account? </span>
              <Link type="link" className="p-0 " to="/signup">
                <span className="fw-semibold">Create Account</span>
              </Link>
            </div>

            <Divider className="txt2 fs-4">Or continue with</Divider>

            <Button
              className="d-flex align-items-center justify-content-center oauth-btn google-btn fs-4 w-100"
              onClick={handleGoogleLogin}
              size="large"
            >
              <GoogleOutlined />
              Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
