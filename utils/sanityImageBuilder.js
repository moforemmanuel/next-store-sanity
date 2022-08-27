import ImageUrlBuilder from '@sanity/image-url';
import getClient from './sanityClient';

export default function urlForThumbnail(src, width) {
  const client = getClient();
  return ImageUrlBuilder(client).image(src).width(width).url();
}
