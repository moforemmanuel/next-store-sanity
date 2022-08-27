import nc from 'next-connect';
import { isAuth } from '../../../../utils/auth';
import getClient from '../../../../utils/sanityClient';

const handler = nc();

handler.use(isAuth);

handler.get(async (req, res) => {
  const client = getClient();
  try {
    console.log('in try..: id: ', req.query.id);
    console.log('in try..: query: ', req.query);
    const order = await client.fetch(`*[_type == "order" && _id == $id][0]`, {
      id: req.query.order,
      // id: req.query.id,
    });
    console.log(order);
    res.send(order);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export default handler;
