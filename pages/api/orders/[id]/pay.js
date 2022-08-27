import nc from 'next-connect';
import { isAuth } from '../../../../utils/auth';
import getClient from '../../../../utils/sanityClient';

const handler = nc();

handler.use(isAuth);

handler.put(async (req, res) => {
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
  const client = getClient(tokenWithWriteAccess);
  const doc = {
    _id: req.query.id,
    body: {
      isPaid: true,
      paidAt: new Date().toISOString(),
      'paymentResult.id': req.body.id,
      'paymentResult.status': 'paid',
      'paymentResult.emailAddress': req.body.emailAddress,
    },
  };
  try {
    await client.patch(doc._id).set(doc.body).commit();
    res.send({ message: 'Order Pai' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

export default handler;
