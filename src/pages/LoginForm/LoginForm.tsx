import React from "react";
import "./loginForm.css";
import { useLoginMutation } from "../../store/api/authApi";
import { useDispatch } from "react-redux";
import { setToken } from "../../store/slices/authSlice";

import { Button, Form, Input, Typography, Card } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    username: string;
    password: string;
    subdomain: string;
  }) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setToken(result.token)); // сохраняем токен
      navigate("/main-page");
    } catch (err) {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <div className="login-wrapper">
      <Card
        title={<Title level={3}>Вход в систему</Title>}
        bordered={false}
        style={{ maxWidth: 400, width: "100%" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            username: "user_task",
            password: "user_task",
            subdomain: "toko",
          }}
        >
          <Form.Item
            label="Имя пользователя"
            name="username"
            rules={[{ required: true, message: "Введите имя пользователя" }]}
          >
            <Input
              size="large"
              placeholder="user_task"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password
              size="large"
              placeholder="user_task"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label="Subdomain"
            name="subdomain"
            rules={[{ required: true, message: "Введите поддомен" }]}
          >
            <Input
              size="large"
              placeholder="toko"
              prefix={<GlobalOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
            >
              {isLoading ? "Входим..." : "Войти"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
