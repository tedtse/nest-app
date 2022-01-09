import axios from 'axios';
import { message } from 'antd';

const instance = axios.create();

instance.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json; charset=utf-8';
  return config;
});

instance.interceptors.response.use(
  (response) => {
    if (response.data.code !== 0) {
      message.error(response.data.message);
      throw new Error(response.data.message ?? '接口错误');
    }
  },
  (err) => {
    message.error(err.response.data.message);
    throw err;
  },
);

export default instance;
