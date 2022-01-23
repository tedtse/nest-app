import React, { useState, useEffect } from 'react';
import { NextPage, Link } from 'next';
import { Layout, Menu, Empty } from 'antd';
import * as antdIcons from '@ant-design/icons';
import BasicLayout from '../../components/basic-layout';
import CategoriesList from './components/categories-list';
import StaticWebHeader from '../../components/static-web-header';
import Loading from '../../components/loading';
import { findCategories } from '../categories/service';
import scrollTo from '../../utils/scrollTo';
import styles from '../../assets/index.module.scss';

import type { CategoryType } from '../categories/data';

const { Content } = Layout;

const Home: NextPage = () => {
  const [renderable, setRenderable] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [workspaceContent, setWorkspaceContent] = useState<Element>();
  useEffect(() => {
    setRenderable(true);
    findCategories().then((res) => {
      setCategories(res.data);
    });
  }, []);

  if (!renderable) {
    return <Loading />;
  }

  return (
    <>
      <StaticWebHeader />
      <BasicLayout
        menuRender={
          <Menu theme="dark" mode="inline">
            {categories.map((el) => {
              const Icon = antdIcons[el.icon];
              return (
                <Menu.Item key={el._id} icon={<Icon />}>
                  <a
                    onClick={() => {
                      const handle = (content?: HTMLElement) => {
                        const target = (
                          content || workspaceContent
                        ).querySelector(`#category_${el._id}`) as HTMLElement;
                        scrollTo(
                          target,
                          content || (workspaceContent as HTMLElement),
                          { threshold: 10 },
                        );
                      };
                      if (!workspaceContent) {
                        const content = document.body.querySelector(
                          '#workspace-content',
                        ) as HTMLElement;
                        setWorkspaceContent(content);
                        handle(content);
                        return;
                      }
                      handle();
                    }}
                  >
                    {el.name}
                  </a>
                </Menu.Item>
              );
            })}
          </Menu>
        }
        contentRender={
          categories.length ? (
            <Content id="workspace-content" className={styles.sitesContainer}>
              <CategoriesList categories={categories} />
            </Content>
          ) : (
            <Content className={styles.sitesContainer}>
              <div className={styles.fullCenter}>
                <Empty
                  description={
                    <p>
                      还没有网站分类，<a href="/categories">去创建</a>
                    </p>
                  }
                />
              </div>
            </Content>
          )
        }
      />
    </>
  );
};
export default Home;
