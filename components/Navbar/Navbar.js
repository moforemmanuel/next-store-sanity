// import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Switch,
  Badge,
  Text,
  // Circle,
  InputGroup,
  Input,
  InputRightElement,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
  Search2Icon,
} from '@chakra-ui/icons';
import { TiShoppingCart } from 'react-icons/ti';
import NextLink from 'next/link';
import { Store } from '../../utils/Store';
import React from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from 'axios';

const Links = ['Index', 'Projects', 'Team'];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
  >
    {children}
  </Link>
);

export default function Simple() {
  const router = useRouter();
  // const { route } = router;
  const { state, dispatch } = React.useContext(Store);
  const { cart, userInfo } = state;
  // console.log('layout data: ', userInfo);

  const [
    // categories,
    setCategories,
  ] = React.useState([]);
  const [query, setQuery] = React.useState(''); // update query with state hook

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchCategories();
  }, [setCategories]);

  const { colorMode, toggleColorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutClickHandler = () => {
    try {
      console.log('navbar router: ', router);
      console.log('navbar router route: ', router.route);
      console.log('navbar router pathname: ', router.pathname);

      dispatch({ type: 'USER_LOGOUT' });
      Cookies.remove('userInfo');
      // Cookies.remove('cartItems');
      // Cookies.remove('shippingAddress');
      // Cookies.remove('paymentMethod');
      // console.log('navbar redirect: ', re);

      // router.push(route === '/' ? `/login?redirect=${route}` : '/'); //each page will redirect

      if (router === '/') {
        router.push('/');
      }

      toast.success('Successfully Logged out');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const linkTextBorderColor = useColorModeValue(
    'blackAlpha.400',
    'whiteAlpha.500'
  );

  const linkBgColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <>
      <Box
        bg={useColorModeValue('gray.100', 'gray.900')}
        px={4}
        position="fixed"
        w="100%"
        zIndex="1000"
        top={0}
        // backdropFilter="saturate(180%) blur(5px)"
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            border={'thin solid gray'}
            // _hover={{
            //   color: 'red',
            // }}
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>Logo</Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NextLink key={link} href={'/'} passHref>
                  <Link
                    px={2}
                    py={1}
                    rounded={'md'}
                    _hover={{
                      textDecoration: 'none',
                      bg: linkBgColor,
                    }}
                  >
                    {link}
                  </Link>
                </NextLink>
              ))}
            </HStack>
          </HStack>

          <Flex
            // border={'thin solid red'}
            alignItems={'center'}
            justify="space-between"
            // w="fit-content"
          >
            <form onSubmit={submitHandler}>
              <InputGroup
                alignSelf={'flex-start'}
                justifySelf={'flex-start'}
                ml={0}
                display={{ base: 'none', md: 'inline' }}
                size="md"
              >
                <Input
                  type="search"
                  placeholder="Search a product"
                  onChange={queryChangeHandler}
                />
                <InputRightElement>
                  <IconButton icon={<Search2Icon />} type="submit"></IconButton>
                </InputRightElement>
              </InputGroup>
            </form>

            <Switch
              m={3}
              mr={0}
              onChange={toggleColorMode}
              isChecked={colorMode === 'light' ? false : true}
              colorScheme="green"
              size="lg"
              display="flex"
              alignItems="center"
              transitionDuration={4}
            >
              {colorMode === 'light' ? (
                <SunIcon
                  size="2xl"
                  position={'absolute'}
                  top="1.5"
                  left="50%"
                  color="inherit"
                />
              ) : (
                <MoonIcon
                  size="lg"
                  position={'absolute'}
                  top="1.5"
                  left="1.5"
                  color="gray.800"
                />
              )}
            </Switch>
            {!userInfo ? (
              <NextLink href="/login" passHref>
                <Link>
                  <Text
                    as={Button}
                    borderColor={linkTextBorderColor}
                    borderStyle="solid"
                    borderWidth="thin"
                    fontSize="md"
                  >
                    Login
                  </Text>
                </Link>
              </NextLink>
            ) : (
              <Flex>
                <Flex
                  direction="row"
                  justify="center"
                  gap={5}
                  position="relative"
                  // border={'thin solid blue'}
                >
                  <NextLink href="/cart" passHref>
                    <Link>
                      <Box mr={3}>
                        <TiShoppingCart p={0} fontSize="2rem" />
                        <Badge
                          width="1.2rem"
                          height="1.2rem"
                          rounded="2rem"
                          mr={2}
                          colorScheme="teal"
                          // border={'thin solid blue'}
                          position="absolute"
                          left={5}
                          top={-2}
                          display="inline"
                        >
                          <Text
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            align="center"
                            fontWeight="extrabold"
                          >
                            {cart.cartItems.length > 0
                              ? cart.cartItems.length
                              : 0}
                          </Text>
                        </Badge>
                      </Box>
                    </Link>
                  </NextLink>
                </Flex>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                  >
                    <Avatar
                      size={'sm'}
                      // src={
                      //   'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                      // }
                      name={`${userInfo.firstName} ${userInfo.lastName}`}
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <NextLink href="/profile" passHref>
                        <Link>Profile</Link>
                      </NextLink>
                    </MenuItem>
                    <MenuItem>
                      <NextLink href="/order-history" passHref>
                        <Link>Order History</Link>
                      </NextLink>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem as={Box}>
                      <Button onClick={logoutClickHandler}>Logout</Button>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link} borderBottom={'thin solid gray'}>
                  {link}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      {/* <Box p={4}>Hello Marie</Box> */}
    </>
  );
}
