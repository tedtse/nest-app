import React, { useState, useEffect, useMemo } from 'react';
import { NextPage } from 'next';
import {
  Layout,
  PageHeader,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Upload,
  Row,
  Col,
  Card,
  Avatar,
} from 'antd';
import * as antdIcons from '@ant-design/icons';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import isEqual from 'lodash/isEqual';
import StaticWebHeader from '../../components/static-web-header';
import BasicLayout from '../../components/basic-layout';
import BgMenu from '../../components/basic-layout/bg-menu';
import { findCategories } from '../categories/service';
import {
  findSites,
  uploadLogo,
  createSite,
  updateSite,
  removeSite,
  sortSites,
} from './service';

import styles from '../../assets/index.module.scss';

import type { CategoryType } from '../categories/data';
import type { SiteType } from './data';
import type { FormStateType } from '../types';

const { Content } = Layout;
const PlusOutlined = antdIcons.PlusOutlined;
const LoadingOutlined = antdIcons.LoadingOutlined;
const EditOutlined = antdIcons.EditOutlined;
const DeleteOutlined = antdIcons.DeleteOutlined;

const SitePage: NextPage = () => {
  const [renderable, setRenderable] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryId, setCategoryId] = useState<string>();
  const [sites, setSites] = useState<SiteType[]>([]);
  const [sitesCache, setSitesCache] = useState<SiteType[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [sorted, setSorted] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>();
  const [logoLoading, setLogoLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormStateType>();
  const modalTitle = useMemo(() => {
    const map = {
      create: '新增网站',
      update: '编辑网站',
      read: '网站详情',
    };
    return map[formState] ?? '';
  }, [formState]);
  const [form] = Form.useForm<SiteType & { logoFile?: any }>();

  useEffect(() => {
    setRenderable(true);

    findCategories().then((res) => {
      setCategories(res.data);
      if (res.data.length) {
        const refId = String(res.data[0]._id);
        setCategoryId(refId);
        handleFindSites(refId);
      }
    });
  }, []);

  const handleFindSites = (refId: string) => {
    findSites({ params: { categoryId: refId } }).then((res) => {
      const sites = res.data;
      setSites(sites);
      setSitesCache(sites);
    });
  };
  const handleCreateSite = (site: SiteType) => {
    createSite({ ...site, categoryId: categoryId }).then(() => {
      message.success('新增成功');
      setVisible(false);
      handleFindSites(categoryId);
    });
  };
  const handleUpdateSite = (site: SiteType) => {
    updateSite(site).then(() => {
      message.success('修改成功');
      setVisible(false);
      handleFindSites(categoryId);
    });
  };
  const handleUploadLogo = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append('file', file);
    uploadLogo(formData)
      .then((res) => {
        onSuccess();
        form?.setFieldsValue({ logo: res.data });
        setLogo(res.data);
        message.success('上传成功');
      }, onError)
      .finally(() => {
        setLogoLoading(false);
      });
  };

  const SortableItem = SortableElement(({ value }) => (
    <Col span={8}>
      <Card
        key={value._id}
        actions={[
          <EditOutlined
            key="edit"
            onClick={() => {
              setFormState('update');
              setVisible(true);
              form?.resetFields();
              form?.setFieldsValue({
                ...value,
                logoFile: [value.logo],
              });
              setLogo(value.logo);
            }}
          />,
          <DeleteOutlined
            key="remove"
            onClick={() => {
              const ExclamationIcon = antdIcons.ExclamationCircleOutlined;
              Modal.confirm({
                icon: <ExclamationIcon />,
                content: '确定要删除吗?',
                onOk: () => {
                  removeSite(value._id).then(() => {
                    message.success('删除成功');
                    handleFindSites(categoryId);
                  });
                },
              });
            }}
          />,
        ]}
      >
        <Card.Meta
          avatar={
            <a href={value.url} target="_blank">
              <Avatar src={value.logo} />
            </a>
          }
          title={
            <a href={value.url} target="_blank">
              {value.name}
            </a>
          }
          description={
            <span title={value.description}>{value.description}</span>
          }
        />
      </Card>
    </Col>
  ));

  const SortableList = SortableContainer(({ items }: { items: SiteType[] }) => (
    <Row gutter={16}>
      {items.map((item, index) => (
        <SortableItem key={String(item._id)} index={index} value={item} />
      ))}
    </Row>
  ));

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  if (!renderable) {
    return null;
  }

  return (
    <>
      <StaticWebHeader />
      <BasicLayout
        menuRender={<BgMenu route="sites" />}
        headRender={
          <PageHeader
            title={
              <Select
                value={categoryId}
                onChange={(val) => {
                  setCategoryId(val);
                  handleFindSites(val);
                }}
                style={{ width: '200px' }}
              >
                {categories.map((item) => (
                  <Select.Option key={String(item._id)} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            }
            extra={[
              ...(sorted
                ? [
                    <Button
                      key="sort"
                      type="primary"
                      onClick={() => {
                        sortSites(categoryId, sites).then(() => {
                          message.success('保存成功');
                          handleFindSites(categoryId);
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
                  setLogo('');
                }}
              >
                新增
              </Button>,
            ]}
          />
        }
        contentRender={
          <Content className={styles.sitesContainer}>
            <SortableList
              axis="xy"
              distance={10}
              items={sites}
              onSortEnd={({ oldIndex, newIndex }) => {
                const result = arrayMoveImmutable(sites, oldIndex, newIndex);
                setSites(result);
                if (!isEqual(result, sitesCache)) {
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
            delete json?.logoFile;
            if (formState === 'create') {
              handleCreateSite({ ...json, logo });
            }
            if (formState === 'update') {
              handleUpdateSite({ ...json, logo });
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
            label="网站"
            name="url"
            rules={[
              { required: true, message: '请输入网址' },
              { pattern: /^https?:\/\//, message: '请输入正确的网址格式' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Logo"
            name="logoFile"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请选择logo图片' }]}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => {
                setLogoLoading(true);
              }}
              customRequest={handleUploadLogo}
              showUploadList={false}
              maxCount={1}
              accept="image/*"
            >
              {logo ? (
                <img src={logo} alt="logo" style={{ width: '100%' }} />
              ) : (
                <div>
                  {logoLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item name="logo" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SitePage;
