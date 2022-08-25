import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import config from '../../../config';
import { signToken } from '../../../utils/auth';
import client from '../../../utils/sanityClient';

const handler = nc();

handler.post(async (req, res) => {
  try {
    const data = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      {
        email: req.body.email,
      }
    );

    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      const user = {
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        isAdmin: data.isAdmin,
      };

      const token = signToken(user);
      res.status(200).send({ ...user, token });
    } else {
      res.status(401).send({ message: 'Invalid Email or Password' });
    }
  } catch (err) {
    console.log('from /api/users/login/ :', err);
    res.status(500).send({ message: err.message });
  }
});

export default handler;
