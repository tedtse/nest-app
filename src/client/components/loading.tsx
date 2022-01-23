import React from 'react';
import { Spin } from 'antd';
import styles from '../assets/index.module.scss';

const Loading: React.FC = () => {
  return (
    <div className={styles.fullCenter}>
      <Spin size="large" />
    </div>
  );
};

export default Loading;
