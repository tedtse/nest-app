import React from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import * as antdIcons from '@ant-design/icons';

export type BgRoute = 'categories' | 'sites';

export type Route = {
  title: string;
  key: BgRoute;
  icon: string;
  path: string;
};

export const Routes: Route[] = [
  {
    title: '分类管理',
    key: 'categories',
    icon: 'UnorderedListOutlined',
    path: '/categories',
  },
  { title: '网站管理', key: 'sites', icon: 'GlobalOutlined', path: '/sites' },
];

const BgMenu: React.FC<{ route: BgRoute }> = ({ route }) => {
  return (
    <Menu theme="dark" mode="inline" selectedKeys={[route]}>
      {Routes.map((el) => {
        const Icon = antdIcons[el.icon];
        return (
          <Menu.Item key={el.key} icon={<Icon />}>
            <Link href={el.path}>{el.title}</Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default BgMenu;
