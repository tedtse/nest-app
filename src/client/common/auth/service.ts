import request from '../../utils/request';

import type { ResponseJsonType } from '../../../types/request';
import type { LoginBodyType } from './data';

export async function logout() {
  return request.post<ResponseJsonType>('/api/auth/logout').then((res) => {
    if (res.code === 0) {
      window.localStorage.removeItem('token');
    }
    return res;
  });
}

export async function login(data: LoginBodyType) {
  return request
    .post<ResponseJsonType>('/api/auth/login', { data })
    .then((res) => {
      if (res.code === 0) {
        window.localStorage.setItem('token', res.data.token);
      }
      return res;
    });
}

export async function getCurrentUser() {
  return request.get<ResponseJsonType>('/api/users/current');
}
