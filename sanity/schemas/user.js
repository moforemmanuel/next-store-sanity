// import client from '../../utils/sanityClient';

// const userExists = async (email) => {
//   // const {document} = context;
//   const data = await client.fetch(`*[_type == "user" && email == $email][0]`, {
//     email: email,
//   });

//   return data ? true : false;
// };
export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'firstName',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'lastName',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      // validation: (Rule) =>
      //   Rule.custom(async (email) => {
      //     const emailExists = await userExists(email);
      //     if (emailExists) return 'A user with that email already exists';
      //     return true;
      //   }),
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
    },
    {
      name: 'isAdmin',
      title: 'IsAdmin',
      type: 'boolean',
    },
  ],
};
