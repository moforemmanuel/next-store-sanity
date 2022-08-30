import nc from 'next-connect';
import getClient from '../../../utils/sanityClient';
import { signToken, isAuth } from '../../../utils/auth';

const handler = nc();

handler.use(isAuth);

handler.put(async (req, res) => {
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
  const client = getClient(tokenWithWriteAccess);
  const doc = {
    _id: req.user._id,
    body: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      // password: req.body.password,
    },
  };
  try {
    await client.patch(doc._id).set(doc.body).commit();

    const user = {
      _id: req.user._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      isAdmin: req.user.isAdmin,
    };

    const token = signToken(user);
    console.log('sending : ', user);
    res.send({ ...user, token });
  } catch (err) {
    console.log('from /api/users/profile: ', err);
    res.send(err);
  }
});

export default handler;
