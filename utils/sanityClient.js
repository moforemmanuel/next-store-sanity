import client from '@sanity/client';
import config from '../config';

export default client({
  projectId: config.SANITY_PROJECT_ID,
  dataset: config.NODE_ENV,
  apiVersion: config.SANITY_API_VERSION,
  token: config.SANITY_AUTH_TOKEN,
  useCdn: true,
});
