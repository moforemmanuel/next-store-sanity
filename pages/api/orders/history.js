import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';
import getClient from '../../../utils/sanityClient';

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  // const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
  const client = getClient();

  try {
    const orders = await client.fetch(
      `*[_type == "order" && user._ref == $userId]`,
      {
        userId: req.user._id,
      }
    );
    res.send(orders);
  } catch (err) {
    console.log('/api/orders/history/ : ', err);
    res.send(err);
  }
});

export default handler;
