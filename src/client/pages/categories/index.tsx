import React, { useState, useEffect, useMemo } from 'react';
import { NextPage } from 'next';
import {
  Layout,
  List,
  PageHeader,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
} from 'antd';
import * as antdIcons from '@ant-design/icons';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import isEqual from 'lodash/isEqual';
import StaticWebHeader from '../../components/static-web-header';
import BasicLayout from '../../components/basic-layout';
import BgMenu from '../../components/basic-layout/bg-menu';
import {
  findCategories,
  findAntdIconsList,
  createCategory,
  updateCategory,
  removeCategory,
  sortCategories,
} from './service';

import styles from '../../assets/index.module.scss';

import type { CategoryType } from './data';
import type { FormStateType, AntdIconsListType } from '../types';

const { Content } = Layout;
const { Option, OptGroup } = Select;

const CategoriesPage: NextPage = () => {
  const [renderable, setRenderable] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoriesCache, setCategoriesCache] = useState<CategoryType[]>([]);
  const [antdIconsList, setAntdIconsList] = useState<AntdIconsListType[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [sorted, setSorted] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormStateType>();
  const modalTitle = useMemo(() => {
    const map = {
      create: '新增分类',
      update: '编辑分类',
      read: '分类详情',
    };
    return map[formState] ?? '';
  }, [formState]);
  const [form] = Form.useForm<CategoryType>();

  useEffect(() => {
    setRenderable(true);
    findCategories().then((res) => {
      setCategories(res.data);
      setCategoriesCache(res.data);
    });
    findAntdIconsList().then((res) => {
      setAntdIconsList(res);
    });
  }, []);

  const handleCreateCategory = async (json: CategoryType) => {
    createCategory(json)
      .then(() => {
        message.success('新增成功');
        setVisible(false);
        return findCategories();
      })
      .then((res) => {
        setCategories(res.data);
        setCategoriesCache(res.data);
      });
  };
  const handleUpdateCategory = async (json: CategoryType) => {
    updateCategory(json)
      .then(() => {
        message.success('修改成功');
        setVisible(false);
        return findCategories();
      })
      .then((res) => {
        setCategories(res.data);
        setCategoriesCache(res.data);
      });
  };

  const SortableItem = SortableElement(({ value }) => {
    const Icon = antdIcons[value.icon];
    return (
      <List.Item
        key={String(value._id)}
        actions={[
          <a
            key="edit"
            onClick={() => {
              setFormState('update');
              setVisible(true);
              form?.resetFields();
              form?.setFieldsValue(value);
            }}
          >
            编辑
          </a>,
          <a
            key="remove"
            onClick={() => {
              const ExclamationIcon = antdIcons.ExclamationCircleOutlined;
              Modal.confirm({
                icon: <ExclamationIcon />,
                content: '确定要删除吗?',
                onOk: () => {
                  removeCategory(value._id)
                    .then(() => {
                      message.success('删除成功');
                      return findCategories();
                    })
                    .then((res) => {
                      setCategories(res.data);
                      setCategoriesCache(res.data);
                    });
                },
              });
            }}
          >
            删除
          </a>,
        ]}
      >
        <List.Item.Meta
          avatar={<Icon />}
          title={value.name}
          description={value.description}
        />
      </List.Item>
    );
  });

  const SortableList = SortableContainer(
    ({ items }: { items: CategoryType[] }) => {
      return (
        <List
          className={styles.listRegular}
          dataSource={items}
          renderItem={(item, index) => {
            return (
              <SortableItem key={String(item._id)} index={index} value={item} />
            );
          }}
        />
      );
    },
  );

  if (!renderable) {
    return null;
  }

  return (
    <>
      <StaticWebHeader />
      <BasicLayout
        menuRender={<BgMenu route="categories" />}
        headRender={
          <PageHeader
            extra={[
              ...(sorted
                ? [
                    <Button
                      key="sort"
                      type="primary"
                      onClick={() => {
                        sortCategories(categories)
                          .then(() => {
                            message.success('保存成功');
                            return findCategories();
                          })
                          .then((res) => {
                            setCategories(res.data);
                            setCategoriesCache(res.data);
                          });
                      }}
                    >
                      保存排序
                    </Button>,
                  ]
                : []),
              <Button
                key="new"
                type="primary"
                onClick={() => {
                  setFormState('create');
                  setVisible(true);
                  form?.resetFields();
                }}
              >
                新增
              </Button>,
            ]}
          />
        }
        contentRender={
          <Content>
            <SortableList
              distance={10}
              items={categories}
              onSortEnd={({ oldIndex, newIndex }) => {
                const result = arrayMoveImmutable(
                  categories,
                  oldIndex,
                  newIndex,
                );
                setCategories(result);
                if (!isEqual(result, categoriesCache)) {
                  setSorted(true);
                } else {
                  setSorted(false);
                }
              }}
            />
          </Content>
        }
      />
      <Modal
        title={modalTitle}
        visible={visible}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={(json) => {
            if (formState === 'create') {
              handleCreateCategory(json);
            }
            if (formState == 'update') {
              handleUpdateCategory(json);
            }
          }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="图标"
            name="icon"
            rules={[{ required: true, message: '请选择图标' }]}
          >
            <Select showSearch>
              {antdIconsList.map((group, index) => (
                <OptGroup key={index} label={group.title}>
                  {group.icons.map((icon) => {
                    const Icon = antdIcons[icon];
                    return (
                      <Option key={icon} value={icon}>
                        <Icon /> {icon}
                      </Option>
                    );
                  })}
                </OptGroup>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CategoriesPage;
