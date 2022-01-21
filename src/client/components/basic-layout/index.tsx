import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Layout, Space, Button, message } from 'antd';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import { logout, getCurrentUser } from '../../common/auth/service';
import { RouteWhiteList } from '../../common/auth/helper';
import styles from '../../assets/index.module.scss';

const { Header, Footer, Sider } = Layout;
const cx = classNames.bind(styles);

export type BasicLayoutProps = {
  menuRender?: React.ReactNode;
  headRender?: React.ReactNode;
  contentRender?: React.ReactNode;
};

const BasicLayout: React.FC<BasicLayoutProps> = ({
  menuRender,
  headRender,
  contentRender,
}) => {
  const [renderable, setRenderable] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [logined, setLogined] = useState<boolean>(false);
  const isHome = useMemo(() => {
    return window.location.pathname === '/';
  }, []);
  const router = useRouter();
  useEffect(() => {
    if (RouteWhiteList.includes(window.location.pathname)) {
      setRenderable(true);
      getCurrentUser().then((res) => {
        if (res.code === 0 && res.data) {
          setLogined(true);
        }
      });
    } else {
      getCurrentUser().then((res) => {
        if (res.code === 0 && res.data) {
          setLogined(true);
          setRenderable(true);
        } else {
          message.error('请先登录');
          router.push('/auth/login');
        }
      });
    }
  }, []);

  if (!renderable) {
    return null;
  }

  return (
    <Layout className={cx({ globalLayout: true, collapsed })}>
      <Sider
        breakpoint="lg"
        collapsible
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        onCollapse={setCollapsed}
      >
        <div className={styles.siderHeader}>
          <img src="/logo.svg" />
          <h3>Navigator</h3>
        </div>
        {menuRender}
      </Sider>
      <Layout className={styles.workspaceLayout}>
        <Header>
          <div className="title"></div>
          <Space>
            {logined && isHome ? (
              <Button
                type="text"
                onClick={() => {
                  router.push('/categories');
                }}
              >
                进入后台
              </Button>
            ) : null}
            {logined ? (
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={() => {
                  logout().then((res) => {
                    if (res.code === 0) {
                      window.localStorage.removeItem('token');
                      router.push('/auth/login');
                    }
                  });
                }}
              >
                登出
              </Button>
            ) : (
              <Button
                type="text"
                icon={<LoginOutlined />}
                onClick={() => {
                  router.push('/auth/login');
                }}
              >
                登录
              </Button>
            )}
          </Space>
        </Header>
        {headRender}
        {contentRender}
        <Footer>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
