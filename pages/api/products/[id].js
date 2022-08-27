import nc from 'next-connect';
import getClient from '../../../utils/sanityClient';

const handler = nc();

handler.get(async (req, res) => {
  try {
    const client = getClient(process.env.SANITY_AUTH_TOKEN);
    console.log('query: ', req.query);
    const product = await client.fetch(
      `*[_type == "product" && _id == $id][0]`,
      {
        id: req.query.id,
      }
    );

    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

export default handler;
