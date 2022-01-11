import React from 'react';
import { NextPage } from 'next';
import { Card, Form, Button, Input, Space, message } from 'antd';
import StaticWebHeader from '../../components/static-web-header';
import { login } from './service';

import styles from '../index.module.scss';

const LoginPage: NextPage = () => {
  const [form] = Form.useForm();
  return (
    <>
      <StaticWebHeader />
      <div className={styles.loginContainer}>
        <Card>
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={async (data) => {
              login(data).then((res) => {
                console.log(res);
                message.success('登录成功');
                // location.href = '/';
              });
            }}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
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
    </>
  );
};

export default LoginPage;
