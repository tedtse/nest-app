import React from 'react';
import Head from 'next/head';

export type HeaderProps = {
  title?: string;
  description?: string;
};

const StaticWebHeader: React.FC<HeaderProps> = (props) => {
  return (
    <Head>
      <title>{props.title ?? 'Nest App'}</title>
      <meta
        name="description"
        content={props.description ?? 'description of Nest App'}
      />
      <link rel="shortcut icon" href="/static/favicon.ico" />
    </Head>
  );
};

export default StaticWebHeader;
