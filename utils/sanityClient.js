import client from '@sanity/client';
import config from '../config';

export default function getClient(token = null) {
  return client({
    projectId: config.SANITY_PROJECT_ID,
    dataset: config.NODE_ENV,
    apiVersion: config.SANITY_API_VERSION,
    token: token,
    useCdn: true,
  });
}
