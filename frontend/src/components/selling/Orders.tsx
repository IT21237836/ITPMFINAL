import React, {useState, useEffect} from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Chip from '@mui/material/Chip';


// Generate Order Data

interface Order {
  _id: string;
  buyer: {
    name:string
  };
  quantity: number;
  address: string;
  contact_number: number;
  total: number;
  status:string;
}

interface Seller {
  _id: string;
  name: string;
  email: number;
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Orders() {

  const userBackendString = localStorage.getItem('user-backend');
  const initialSellerDetails = userBackendString ? JSON.parse(userBackendString) : null;
  const [sellerDetails, setSeller] = useState<any>(initialSellerDetails);
  const [orders, setOrders] = useState<Order[]>([]);

  const getOrdersBySellerId = async () => {

    const sellerId = initialSellerDetails ? initialSellerDetails._id : null;

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
    getOrdersBySellerId()
  }, [])
  
  

  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Buyer</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Shipping Address</TableCell>
            <TableCell>Buyer Contact</TableCell>
            <TableCell>Total</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.slice(0, 5).map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.buyer?.name}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.contact_number}</TableCell>
              <TableCell>{row.total}</TableCell>
              <TableCell align="right">
                {
                  row.status === "pending"?(
                  <Chip label="Pending" color="warning" />
                  ):(
                    row.status === "shipped"?(
                      <Chip label="Shipped" color="info" />
                    ):(
                      <Chip label="Delivered" color="success" />
                    )
                  )
                }
                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="/selling-orders" sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}