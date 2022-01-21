import { extend, ResponseError } from 'umi-request';
import merge from 'lodash/merge';
import { message } from 'antd';

import type { ResponseJsonType } from '../../types/request';

class ResError extends Error {
  response: Response;
  type: string;
  data: any;
  status: string | number;

  constructor(
    response: Response,
    text: string,
    status: number | string,
    data: string,
    type = 'ResponseError',
  ) {
    super(text || response.statusText);
    this.name = 'ResponseError';
    this.response = response;
    this.status = status;
    this.type = type;
    this.data = data;
  }
}

const extendRequest = extend({
  errorHandler(
    error: ResponseError & {
      response: Response & ResponseJsonType;
      status?: number;
    },
  ) {
    message.error(error.response.message);
    if (error.status === 401) {
      location.href = '/auth/login';
    }
    throw new ResError(
      error.response,
      error.response.message,
      error.response.status,
      null,
    );
  },
});

extendRequest.interceptors.request.use((url, options) => {
  return {
    url,
    options: merge(
      {},
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: window.localStorage.getItem('token'),
        },
      },
      options,
    ),
  };
});

extendRequest.interceptors.response.use(async (response: Response) => {
  let finalRes: any;
  try {
    finalRes = await response.clone().json();
  } catch (err) {
    throw new ResError(
      finalRes,
      `接口${response.url}返回数据不对`,
      response.status,
      null,
    );
  }
  if (finalRes?.code !== 0) {
    throw new ResError(finalRes, finalRes?.message, response.status, null);
  }
  return response;
});

export default extendRequest;
