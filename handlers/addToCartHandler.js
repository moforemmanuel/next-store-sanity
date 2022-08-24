import axios from 'axios';
import { toast } from 'react-toastify';

export const addToCartHandler = async (cart, product, dispatch) => {
  const existingItem = cart.cartItems.find((item) => item._id === product._id);
  const quantity = existingItem ? existingItem.quantity + 1 : 1;

  let data;
  try {
    const result = await axios.get(`/api/products/${product._id}`);
    data = await result.data;
    // } catch (err) {
    //   console.log(err.message);
    // }

    if (data.countInStock < quantity) {
      toast('Sorry, the product is out of stock', {
        type: 'error',
      });
      return;
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: product._id,
        name: product.name,
        countInStock: product.countInStock,
        slug: product.slug.current,
        price: product.price,
        image: urlForThumbnail(product.image),
        quantity,
      },
    });

    toast(`${product.name} added to the cart`, {
      type: 'success',
    });
  } catch (err) {
    console.log(err);
    toast(`${err.message}`, {
      type: 'error',
    });
  }
};
