import request from '../../utils/request';

import type { ResponseJsonType } from '../../../types/request';
import type { MongoIDType } from '../../../types/model';
import type { AntdIconsListType } from '../types';
import type { CategoryType } from './data';

export async function findCategories(
  options = { params: { sort: '{ "sort": 1 }' } },
) {
  return request.get<ResponseJsonType>('/api/categories', options);
}

export async function createCategory(instance: CategoryType) {
  return request.post<ResponseJsonType>('/api/categories', { data: instance });
}

export async function updateCategory(instance: CategoryType) {
  return request.put<ResponseJsonType>('/api/categories', { data: instance });
}

export async function removeCategory(id: MongoIDType) {
  return request.delete<ResponseJsonType>(`/api/categories/${id}`);
}

export async function findAntdIconsList(): Promise<AntdIconsListType[]> {
  return fetch('/static/icons-list.json').then((res) => res.json());
}
