import React, {useState, useEffect} from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

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

export default function Deposits() {

  const userBackendString = localStorage.getItem('user-backend');
  const initialSellerDetails = userBackendString ? JSON.parse(userBackendString) : null;
  const [sellerDetails, setSeller] = useState<any>(initialSellerDetails);
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenue, setRevenue] = useState(0)

  const getOrdersBySellerId = async () => {

    const sellerId = initialSellerDetails ? initialSellerDetails._id : null;

    try {
      const res = await fetch(`/api/orders/get-order-by-seller-id/${sellerId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();

      setOrders(data);
      setRevenue(orders.reduce((acc, order) => acc + order.total, 0))

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrdersBySellerId()
  }, [])

  return (


    <React.Fragment>
      <Title>Recent Revenue</Title>
      <Typography component="p" variant="h4">
        ${revenue}.00
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </Typography>
    </React.Fragment>
  );
}