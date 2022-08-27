import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';

// this is to return paypal client id
const handler = nc();

handler.use(isAuth);

handler.get(async (req, res) => {
  try {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb'); // sb for sandbox
  } catch (err) {
    res.send(err);
  }
});

export default handler;
