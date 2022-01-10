import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import StaticWebHeader from './components/static-web-header';

import styles from './index.module.scss';

const { Header, Content, Footer, Sider } = Layout;

const Home: React.FC = () => {
  const [renderable, setRenderable] = useState<boolean>(false);
  useEffect(() => {
    setRenderable(true);
  }, []);

  if (!renderable) {
    return null;
  }

  return (
    <>
      <StaticWebHeader />
      <Layout className={styles.globalLayout}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <Menu theme="dark" mode="inline">
            <Menu.Item key="1" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    </>
  );
};
export default Home;
