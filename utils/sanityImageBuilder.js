import ImageUrlBuilder from '@sanity/image-url';
import client from './sanityClient';

export default function urlForThumbnail(src) {
  return ImageUrlBuilder(client).image(src).url();
}
