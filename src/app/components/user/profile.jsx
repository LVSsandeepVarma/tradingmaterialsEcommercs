import React,{useState, useEffect} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import MailIcon from '@mui/icons-material/Mail';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader } from '../../../features/loader/loaderSlice';
import { updateUsers } from '../../../features/users/userSlice';
import { updateCart } from '../../../features/cartItems/cartSlice';
import { updateCartCount } from '../../../features/cartWish/focusedCount';
import { updateNotifications } from '../../../features/notifications/notificationSlice';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BusinessIcon from '@mui/icons-material/Business';
import axios from 'axios';
import { Button } from '@mui/material';
import ShippingAddressModal from '../modals/address';
import Header from '../header/header';
import SecondarySidenav from './temp';

const drawerWidth = 240;



const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
//   overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function SideBar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [showModal, setShowModal] = useState(false)
  const userData = useSelector( state => state?.user?.value)
  const tabs = ["Profile", "Address", "Cart", "Wishlist"]

  const dispatch = useDispatch()

  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        "https://admin.tradingmaterials.com/api/lead/get-user-info",
        {
          headers: {
            "access-token": localStorage.getItem("client_token"),
            Accept: "application/json",
          },
        }
      );
      if (response?.data?.status) {
        console.log(response?.data);
        dispatch(updateUsers(response?.data?.data));
        dispatch(updateCart(response?.data?.data?.client?.cart));
        dispatch(updateCartCount(response?.data?.data?.client?.cart_count))
      } else {
        console.log(response?.data);
        dispatch(
          updateNotifications({
            type: "warning",
            message: response?.data?.message,
          })
        );
        // navigate("/login")
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoader());
    }
  };


    useEffect(()=>{
        getUserInfo()
    },[])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleActiveTab =(index)=>{
    setActiveIndex(index)

  }

  return (
    <>
 
    <ShippingAddressModal
        show={showModal}
        onHide={() => setShowModal(false)}
        type="add"
        data ={[]}
      />
<div className="" style={{display:"flex", flexDirection:"column"}} >
      <Header/>
      

      {/* <div className="container " style={{flex:"3", paddingTop: "80px"}}>
      <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='relative'  open={open} style={{height:"fit-content"}}>
        
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon  />
          </IconButton>
          
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
            <p className='font-bold !text-left w-full ml-3'>{userData?.client?.first_name}</p>
          <IconButton onClick={handleDrawerClose}>

            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["Profile", "Address", "Cart", "Wishlist"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton

                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor : activeIndex === index ? "skyblue": ""
                }}
                color={`${activeIndex === index ? "blue" : ""} `}
                onClick={()=>handleActiveTab(index)}
              >
                {text === "Cart" && <ShoppingCartRoundedIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <MailIcon />
                </ShoppingCartRoundedIcon>}
                {text === "Profile" && <PersonOutlineIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <MailIcon />
                </PersonOutlineIcon>}
                {text === "Address" && <BusinessIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <MailIcon />
                </BusinessIcon>}
                {text === "Wishlist" && <FavoriteBorderIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <MailIcon />
                </FavoriteBorderIcon>}
                
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {activeIndex === 0 && <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
          Convallis convallis tellus id interdum velit laoreet id donec ultrices.
          Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
          nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
          leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
          feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
          sapien faucibus et molestie ac.
        </Typography>}
        {activeIndex === 1 && 
            <>
            <div>
                <h4>Billing address</h4>
                <div>
                    <small className='w-full !text-left'>Showing All Billing address available</small>
                    {userData?.client?.primary_address?.map((address,ind)=>(
                        <div className='w-fit border border-1 p-3 text-left !min-w-[45%]  sm:!min-w-[15%] ml-5'>
                            <CardActionArea>
                            <h3 className='font-bold'>Address - {ind+1}</h3>
                            <p>{address?.add_1}</p>
                            <p>{address?.add_2}</p>
                            <p>{address?.city}</p>
                            <p>{address?.zip}</p>
                            <p>{address?.state}</p>
                            <p>{address?.country}</p>
                            </CardActionArea>
                        </div>
                    ))}
                    <Divider/>
                </div>
                <h4>Shippping address</h4>
                <div>
                <small className='w-full !text-left'>Showing All Shipping address available</small>
                <div className='flex overflow-x-auto '>
                    {userData?.client?.address?.map((address,ind)=>(
                        <div className='w-fit border border-1 p-3 text-left !min-w-[45%]  sm:!min-w-[15%] ml-5 gap-5'>
                        <CardActionArea >
                        
                            <h3 className='font-bold'>Address - {ind+1}</h3>
                            <p>{address?.add_1},</p>
                            <p>{address?.add_2},</p>
                            <p>{address?.city},</p>
                            <p>{address?.zip},</p>
                            <p>{address?.state},</p>
                            <p>{address?.country}.</p>
                        
                        </CardActionArea>
                        </div>
                    ))}
                    <Button className='!ml-2' onClick={()=>setShowModal(true)}>+ Add new Address</Button>
                    </div>
                    <Divider/>
                </div>
            </div>
            </>
        }
        {activeIndex === 2 && <>
        <div>
            <h4>Your cart</h4>
            <Divider/>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {userData?.client?.cart?.map((product, ind)=>(
                <Card className='mt-5 ' sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product?.product?.img_1}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        <div className='flex items-center'>
                      <p className='max-w-[100%] md:max-w-[75%]'>{product?.product?.name}</p>
                      <small className='font-bold'>Qty : {product?.qty} </small>
                      </div>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                       <p dangerouslySetInnerHTML={{__html: product?.product?.description}}/>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
            </div>
        </div>
        </>
        }
        {activeIndex === 3 && 
            <>
            <div>
                <h4>Your Wishlist</h4>
                <Divider/>
                {userData?.client?.wishlist?.length === 0 && <p>Your Wishlist is empty</p>}
                {userData?.client?.wishlist?.length > 0 && <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {userData?.client?.wishlist?.map((product, ind)=>(
                <Card className='mt-5 ' sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product?.product?.img_1}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product?.product?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with over 6,000
                      species, ranging across all continents except Antarctica
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
            </div>}
            </div>
            </>
        }
      </Box>
    </Box>
      </div> */}
      </div>
    </>
  );
}
