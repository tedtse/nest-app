import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Avatar, Spin, Empty } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { findSites } from '../../sites/service';
import styles from '../../../assets/index.module.scss';

import type { CategoryType } from '../../categories/data';
import type { SiteType } from '../../sites/data';

export type SitesQueueAnimProps = {
  category: CategoryType;
};

const RowRef = React.forwardRef((props, ref) => <Row {...props} ref={ref} />);

const SitesQueueAnim: React.FC<SitesQueueAnimProps> = ({ category }) => {
  const [sites, setSites] = useState<SiteType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    findSites({ params: { categoryId: category._id } })
      .then((res) => {
        setSites(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={styles.boxCenter}>
        <Spin />
      </div>
    );
  }

  return sites.length ? (
    <QueueAnim
      type="bottom"
      component={RowRef}
      componentProps={{
        gutter: 16,
      }}
    >
      {sites.map((item) => (
        <Col key={item._id} xs={24} sm={24} md={12} lg={8} xl={6}>
          <Card key={item._id}>
            <Card.Meta
              avatar={
                <a href={item.url} target="_blank">
                  <Avatar src={item.logo} />
                </a>
              }
              title={
                <a href={item.url} target="_blank">
                  {item.name}
                </a>
              }
              description={
                <span title={item.description}>{item.description}</span>
              }
            />
          </Card>
        </Col>
      ))}
    </QueueAnim>
  ) : (
    <div className={styles.boxCenter}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>
  );
};

export default SitesQueueAnim;
