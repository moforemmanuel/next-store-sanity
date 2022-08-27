import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';
import getClient from '../../../utils/sanityClient';

const handler = nc();

handler.use(isAuth);

handler.post(async (req, res) => {
  // console.log('hitting /api/orders');
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
  const client = getClient(tokenWithWriteAccess);
  // console.log(client);
  // console.log('b4 docs');
  // console.log(req.user);
  const doc = {
    _type: 'order',
    createdAt: new Date().toISOString(),
    ...req.body,
    userName: `${req.user.firstName} ${req.user.lastName}`,
    user: {
      _type: 'reference',
      _ref: req.user._id,
    },
  };
  // console.log('af docs');

  try {
    // console.log('\n In try .... \n');
    const data = await client.create(doc);
    console.log('from /api/orders :', data);
    console.log('from /api/orders id :', data._id);
    res.status(201).send(data._id);
  } catch (err) {
    console.log('from /api/users/register/ :', err);
    res.status(500).send(err);
  }
});

export default handler;
