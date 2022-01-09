import request from '../../utils/request';

import type { ResponseJsonType, MongoIDType } from '../../../types/request';
import type { AntdIconsListType } from '../types';
import type { CategoryType } from './data';

export async function findCategories() {
  return request.get<ResponseJsonType>('/api/categories');
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
