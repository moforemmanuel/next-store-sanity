import ImageUrlBuilder from '@sanity/image-url';
import client from './sanityClient';

export default function urlForThumbnail(src, width) {
  return ImageUrlBuilder(client).image(src).width(width).url();
}
