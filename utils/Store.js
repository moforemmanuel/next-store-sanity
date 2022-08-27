import Cookies from 'js-cookie';

import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
  cart: {
    cartItems: Cookies.get('userInfo')
      ? Cookies.get('cartItems')
        ? JSON.parse(Cookies.get('cartItems'))
        : []
      : [],
    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress'))
      : {},
    paymentMethod: Cookies.get('paymentMethod')
      ? Cookies.get('paymentMethod')
      : '',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existingItem = state.cart.cartItems.find(
        (item) => item._key === newItem._key
      );

      const cartItems = existingItem
        ? state.cart.cartItems.map(
            (item) => (item._key === existingItem._key ? newItem : item) //update (use new item with updated quantity) quantity if exist else use old item
          )
        : [...state.cart.cartItems, newItem]; // add new item to end of cart
      Cookies.set('cartItems', JSON.stringify(cartItems)); // save cartItems to cookies
      return { ...state, cart: { ...state.cart, cartItems } }; //update only cart Items
    }

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._key != action.payload._key
      );
      Cookies.set('cartItems', JSON.stringify(cartItems)); // save cartItems to cookies
      return { ...state, cart: { ...state.cart, cartItems } }; //update only cart Items
    }

    case 'CART_CLEAR': {
      return {
        ...state,
        cart: { ...state.cart, cartItems: [] },
      };
    }

    case 'USER_LOGIN': {
      return { ...state, userInfo: action.payload };
    }

    case 'USER_LOGOUT': {
      return {
        ...state,
        userInfo: null,
        cart: {
          // cartItems: [],
          shippingAddress: {},
        },
      };
    }

    case 'SAVE_SHIPPING_ADDRESS': {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    }

    case 'SAVE_PAYMENT_METHOD': {
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    }

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
