import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import config from '../../../config';
import { signToken } from '../../../utils/auth';
import client from '../../../utils/sanityClient';

const handler = nc();

handler.post(async (req, res) => {
  const projectId = config.SANITY_PROJECT_ID;
  const dataset = config.NODE_ENV;
  const apiVersion = config.SANITY_API_VERSION;

  // to update data in sanity, we need to use a token with write access
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;

  //to update data in sanity, we use a mutation array, containing list of mutations to update sanityDB
  // const mutations = [
  //   {
  //     create: {
  //       _type: 'user',
  //       firstName: req.body.firstName,
  //       lastName: req.body.lastName,
  //       email: req.body.email,
  //       password: bcrypt.hashSync(req.body.password),
  //       isAdmin: false,
  //     },
  //   },
  // ];

  // try {
  //   const { data } = await axios.post(
  //     `https://${projectId}.api.sanity.io/${apiVersion}/data/mutate/${dataset}?returnIds=true`,

  //     {
  //       headers: {
  //         'Content-type': 'application/json',
  //         Authorization: `Bearer ${tokenWithWriteAccess}`,
  //       },
  //       body: JSON.stringify({ mutations }),
  //     }
  //   ); // return id of created records after create

  //   const userId = data.results[0].id;
  //   const user = {
  //     _id: userId,
  //     firstName: req.body.firstName,
  //     lastName: req.body.lastName,
  //     email: req.body.email,
  //     isAdmin: false,
  //   };

  const doc = {
    _type: 'user',
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  };

  try {
    const data = await client.create(doc);
    console.log(data);

    const user = data;

    const token = signToken(user);
    res.status(200).send({ ...user, token });
  } catch (err) {
    console.error(err);
    console.error(err.data);
    console.error(err.data.message);
    res.status(500).send({ message: err.message });
  }
});

export default handler;
