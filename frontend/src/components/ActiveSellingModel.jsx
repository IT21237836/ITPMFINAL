import React, {useEffect} from 'react';
import { createTheme, ThemeProvider } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: '#ffffff', // Change to your desired background color
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const themeRtl = createTheme({
  });

export default function ActiveSellingModel({isOpen, onClose}) {

  const [user,setUser] = React.useState(JSON.parse(localStorage.getItem('user-backend')))

  useEffect(() => {
    if(!user){
      setUser(JSON.parse(localStorage.getItem('user-backend')))
    }
  }, [user])
  

  const [shop_name, setShopName] = React.useState('')
  const [shop_address, setShopAddress] = React.useState('')
  const [nic, setNic] = React.useState('')

  const activeSellerAccount = async () => {
    if (!window.confirm("Are you sure you want to active selling account?")) return;

    if(!shop_name){
      alert("Shop name is required")
      return
    }
    else if(!shop_address){
      alert("Shop address is required")
      return
    }
    else if(!nic){
      alert("Seller NIC is required")
      return
    }
    else{

      const sellerDetails = {
        "shop_name": shop_name,
        "shop_address":shop_address,
        "nic":nic
      }

      const id = user?._id

      try {
        const res = await fetch(`/api/users/active-seller/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sellerDetails),
        });
        const data = await res.json();

        if (data.error) {
            return showToast("Error", data.error, "error");
        }
        if (data.success && data.user) {
            localStorage.setItem("user-backend", JSON.stringify(data?.user));
            setUser(data?.user)
            onClose()
            showToast("Success", "Selling account activated", "success");
        }
    } catch (error) {
        showToast("Error", error.message, "error");
    }

    }

};

  return (
    <div>
      <ThemeProvider theme={themeRtl} >
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="text.primary" sx={{display:'flex', alignItems:'center', justifyContent:'center'}} >
            Active Selling Account
          </Typography>
          <TextField onChange={(e)=>setShopName(e.target.value)} id="filled-basic" label="Shop Name" variant="outlined" sx={{width:'100%', mt:'20px'}} size="small"/>
          {/* <TextField id="filled-basic" label="Shop Address" variant="outlined" sx={{width:'100%', mt:'20px'}}/> */}
          <TextField
          id="standard-multiline-static"
          label="Shop Address"
          multiline
          rows={4}
          variant="outlined"
          sx={{width:'100%', mt:'20px'}}
          size="small"
          onChange={(e)=>setShopAddress(e.target.value)}
        />

          <TextField onChange={(e)=>setNic(e.target.value)} id="filled-basic" label="NIC" variant="outlined" sx={{width:'100%', mt:'20px'}} size="small"/>

          <div style={{display:'flex',justifyContent:'end', marginTop:'30px'}}>
            <Button onClick={activeSellerAccount} variant='contained' color='success' sx={{mr:'10px'}}>Active</Button>
            <Button onClick={onClose} variant='contained'>Close</Button>
          </div>

        </Box>
      </Modal>
      </ThemeProvider>
    </div>
  );
}
