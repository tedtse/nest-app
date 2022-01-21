import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Card, Form, Button, Input, Space, message } from 'antd';
import StaticWebHeader from '../../components/static-web-header';
import { login } from './service';

import styles from '../../assets/index.module.scss';

const LoginPage: NextPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  return (
    <div className={styles.loginContainer}>
      <StaticWebHeader />
      <header>
        <Button
          type="text"
          onClick={() => {
            router.push('/');
          }}
        >
          进入主页
        </Button>
      </header>
      <div className={styles.loginBox}>
        <Card>
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={async (data) => {
              login(data).then((res) => {
                message.success('登录成功');
                router.push('/categories');
              });
            }}
          >
            <Form.Item
              label="用户名"
              name="search"
              rules={[
                {
                  required: true,
                  message: '请输入用户名或邮箱',
                },
              ]}
            >
              <Input placeholder="用户名或邮箱" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input.Password
                placeholder="密码"
                onPressEnter={() => {
                  form.submit();
                }}
              />
            </Form.Item>
            <div className={styles.submitter}>
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    form.submit();
                  }}
                >
                  提交
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  重置
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
