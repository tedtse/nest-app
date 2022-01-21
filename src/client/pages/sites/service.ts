import merge from 'lodash/merge';
import request from '../../utils/request';

import type { ResponseJsonType } from '../../../types/request';
import type { SiteType } from './data';

export async function findSites(query = {}) {
  return request.get<ResponseJsonType<SiteType[]>>(
    '/api/sites',
    merge({}, { params: { options: '{ "sort": { "sort": 1 } }' } }, query),
  );
}

export async function createSite(instance: SiteType) {
  return request.post<ResponseJsonType<SiteType>>('/api/sites', {
    data: instance,
  });
}

export async function updateSite(instance: SiteType) {
  return request.put<ResponseJsonType<SiteType>>('/api/sites', {
    data: instance,
  });
}

export async function removeSite(id: string) {
  return request.delete<ResponseJsonType>(`/api/sites/${id}`);
}

export async function sortSites(categoryId: string, targets: SiteType[]) {
  return request.put<ResponseJsonType<SiteType[]>>('/api/sites/sort', {
    data: { categoryId, targets },
  });
}

export async function uploadLogo(formData: FormData) {
  return request.post<ResponseJsonType>('/api/files/upload', {
    data: formData,
    headers: {},
  });
}
