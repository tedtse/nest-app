import request from '../../utils/request';

import type { ResponseJsonType } from '../../../types/request';
import type { LoginBodyType } from './data';

export async function login(data: LoginBodyType) {
  return request
    .post<ResponseJsonType>('/api/users/login', { data })
    .then((res) => {
      if (res.code === 0) {
        localStorage.setItem('token', res.data.token);
      }
      return res;
    });
}
