import React, { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import SitesList from './sites-queue-anim';

import type { CategoryType } from '../../categories/data';

export type CategoriesListProps = {
  categories: CategoryType[];
};

const { Panel } = Collapse;

const CategoriesList: React.FC<CategoriesListProps> = ({ categories }) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);
  useEffect(() => {
    setActiveKey(categories.map((category) => category._id));
  }, [categories]);

  return (
    <Collapse
      activeKey={activeKey}
      // onChange={(keys: string[]) => {
      //   setActiveKey(keys);
      // }}
    >
      {categories.map((category) => (
        <Panel
          id={`category_${category._id}`}
          key={category._id}
          header={category.name}
          showArrow={false}
        >
          {<SitesList category={category} />}
        </Panel>
      ))}
    </Collapse>
  );
};

export default CategoriesList;
