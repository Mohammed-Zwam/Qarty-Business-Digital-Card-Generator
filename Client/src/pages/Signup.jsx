import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  Loading3QuartersOutlined,
} from "@ant-design/icons";
import "../styles/Form.css";
import { useContext } from "react";
import { AlertContext } from "../context/AlertContext";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/Auth";
import validator from "validator";

const Signup = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [disable, setIsDisable] = useState(true);
  const { openMessage, openNotification } = useContext(AlertContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      delete values.confirmPassword;
      const res = await signup(values);
      if (res.ok) {
        openMessage("Account Created Successfully", "success");
        navigate("/login");
      } else {
        openNotification("Account creation failed", res.message, "error");
        setIsDisable(true);
      }
    } catch {
      openMessage("Account creation failed", "error");
      setIsDisable(true);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="d-flex justify-content-center align-items-center">
        <div className="form-card overlay-bg main-border motion">
          <div className="form-card-body p-4">
            <div className="text-center mb-4">
              <h1 className="txt4 txt-shadow fw-semibold">
                Create your account
              </h1>
            </div>

            <Form
              form={form}
              name="signup"
              onFinish={onFinish}
              onFieldsChange={() => {
                const hasErrors = form
                  .getFieldsError()
                  .some(({ errors }) => errors.length > 0);

                setIsDisable(hasErrors);
              }}
              validateTrigger="onBlur"
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="username"
                label={<span className="txt3 fs-4">Username</span>}
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                  {
                    type: "string",
                    message: "Please enter a valid username!",
                  },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();

                      const regex = /^[A-Za-z_][A-Za-z0-9_-]{2,19}$/;

                      if (!regex.test(value)) {
                        return Promise.reject(
                          "Username must be 3–20 characters long, start with a letter or '_', and contain only letters, numbers, '_' or '-'",
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="txt3" />}
                  placeholder="Enter your username"
                  className="custom-input"
                />
              </Form.Item>

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
                  prefix={<MailOutlined className="txt3" />}
                  placeholder="Enter your email"
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
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();

                      if (!validator.isStrongPassword(value)) {
                        return Promise.reject(
                          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="txt3" />}
                  placeholder="Enter your password"
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span className="txt3 fs-4">Confirm Password</span>}
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="txt3" />}
                  placeholder="Confirm your password"
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
                  Create Account
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
