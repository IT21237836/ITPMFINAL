import React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState, useEffect } from "react";
import axios from "axios";
import { mainListItems } from "./listItems";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import useShowToast from "../../hooks/useShowToast";
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const columns = [
  { id: "buyer", label: "Buyer Name", minWidth: 170 },
  { id: "quantity", label: "Order Qty", minWidth: 50 },
  {
    id: "address",
    label: "Shipping Address",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "contact_number",
    label: "Buyer Contact",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "product",
    label: "Unit Price",
    minWidth: 70,
    align: "right",
  },
  {
    id: "total",
    label: "Order Total",
    minWidth: 100,
    align: "right",
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    align: "left",
  },
];

const mdTheme = createTheme();
const theme = createTheme();


function SellerOrders(seller) {

  const showToast = useShowToast();

  const [sellerDetails, setSeller] = useState(JSON.parse(localStorage.getItem('user-backend')) || seller)

  const [open, setOpen] = React.useState(true);
  const [viewOrderStatus, setViewOrderStatus] = React.useState(false);
  const [currentViewOrder, setCurrentViewOrder] = React.useState(null);
  const [orderStatus, setOrderStatus] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [isUpdating, setIsUpdating] = React.useState(false)

  const getOrdersBySellerId = async () => {

    const sellerId = sellerDetails?._id || seller?._id;

    try {
      const res = await fetch(`/api/orders/get-order-by-seller-id/${sellerId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();

      setOrders(data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrdersBySellerId();
  }, []);

  useEffect(() => {
    
    if(!sellerDetails){
      setSeller(JSON.parse(localStorage.getItem('user-backend')))
    }
  }, [sellerDetails])
  


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };


  const viewOrder = (order) => {
    setViewOrderStatus(true);
    setCurrentViewOrder(order);
    if (order.orderStatus === "Completed") {
      setOrderStatus(true);
    }
  };

  const handleChangeStatus = async(orderId, status, index) => {
    setIsUpdating(true)
    try {
      await fetch(`/api/orders/update-order-status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status}),
      });
      
      showToast("Success", "Order status updated", "success");
      setOrders((prevOrders) => {
        const updatedOrders = [...prevOrders];
        updatedOrders[index].status = status;
        return updatedOrders;
      });
      setIsUpdating(false)
    } catch (error) {
      showToast("Oops", "Failed to update order status", "error");
      setIsUpdating(false)
    }
}



  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            {/* {actor && <span>user {actor.sub} has </span>} logged in as user
            {userId} */}
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Orders
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            {/* <Divider sx={{ my: 1 }} />
            {secondaryListItems} */}
          </List>
        </Drawer>

        {/* Orders */}

        <Container sx={{ marginTop: "15vh" }}>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        <b>{column.label}</b>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders?.map((order,index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={order._id}
                        onClick={() => viewOrder(order)}
                      >
                        {columns.map((column) => {
                          var value = ""
                          if(column.id === "buyer"){
                            value = order[column.id]?.name
                          }
                          else if(column.id === "product"){
                            value = order[column.id]?.unit_price
                          }
                          else if(column.id === "status"){
                            return(
                              <FormControl size="small">
                              <TableCell key={column.id} align={column.align}>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={order[column.id]}
                                label="Status"
                                onChange={(e)=>handleChangeStatus(order._id,e.target.value,index)}
                              >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="shipped">Shipped</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                              </Select>
                              {isUpdating &&
                                <CircularProgress
                                size={24}
                                sx={{
                                  color: green[500],
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  marginTop: '-12px',
                                  marginLeft: '-12px',
                                }}
                              />
                            }
                            </TableCell>
                            </FormControl>
                            )
                          }
                          else{
                          var value = order[column.id];
                          }

                          return (
                            <TableCell key={column.id} align={column.align}>
                                {value}
                            </TableCell>
                          );

                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Container>
        {/* End of Orders */}
      </Box>
    </ThemeProvider>
  );
}

export default SellerOrders;