import React, {useEffect, useState} from 'react';
import { createTheme, ThemeProvider } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './event.css'
import { Avatar } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import usePreviewImg from ".././hooks/usePreviewImg";
import Swal from "sweetalert2";
import {Input} from "@chakra-ui/react";


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

export default function EventUpdatedModel({isOpen, onClose, event}) {

    const fileInput = React.useRef();

    const [user,setUser] = React.useState(JSON.parse(localStorage.getItem('user-backend')))
    

    const {handleImageChange, imgUrl, setImgUrl} = usePreviewImg()
    const [text, setText] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [ticket_price, setTicket_price] = useState(0)
    const [ticket_count, setTicket_count] = useState(0)
    const [imgChanged, setImgChanged] = useState(false)

    useEffect(() => {
        if(!user){
        setUser(JSON.parse(localStorage.getItem('user-backend')))
        }
        if(event){
            setImgUrl(event?.img)
            setText(event?.text)
            setSelectedDate(new Date(event?.event_date))
            setTicket_price(event?.ticket_price)
            setTicket_count(event?.ticket_count)
        }
    }, [user,event])

    const updateEvent = async () => {
        if (!window.confirm("Are you sure you want to update event?")) return;

        if(!selectedDate){
        alert("Date is required")
        return
        }
        else if(!ticket_price){
        alert("Ticket price is required")
        return
        }
        else if(!ticket_count){
        alert("Ticket count is required")
        return
        }
        else if(!text){
            alert("Event title is required")
            return
        }
        else if(!imgUrl){
            alert("Event Image is required")
            return
        }
        else{

            if(imgUrl !== event.img){
                setImgChanged(true)
            }

        try {
            const res = await fetch(`/api/posts/update-event/${event?._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: text, img: imgUrl, ticket_count:ticket_count, ticket_price:ticket_price, event_date:selectedDate, imgChanged:imgChanged }),
            });

            const data = await res.json();
            setImgUrl(null)
            setText('')
            setSelectedDate(new Date())
            setTicket_price(0)
            setTicket_count(0)
            onClose()
            Swal.fire({
            icon: "success",
            title: "Updated",
            text: "Event updated successfully",
            });
            
        } catch (error) {
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error while updating event",
            });
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
            Event Scheduler
          </Typography>
          <Input type='file' hidden ref={fileInput} onChange={handleImageChange} />

          <Avatar
            src={imgUrl ? imgUrl : null}
            sx={{ width: "300px", height: "300px", marginLeft: "100px" }}
            variant="square"
        >
            Add product image
        </Avatar>

        <Tooltip title="Change or add profile image">
            <Button color="success" onClick={() => fileInput.current.click()} sx={{marginLeft: "180px"}}>
            Upload Image
            </Button>
        </Tooltip>

        <TextField value={text} onChange={(e)=>setText(e.target.value)} id="filled-basic" label="Event Title" variant="outlined" sx={{width:'100%', mt:'20px'}} size="small"/>


          <div style={{ marginTop: '20px', width: '100%' }}>
              <label style={{ color: '#000' }}>Event Date and Time : </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                wrapperClassName="date-picker-wrapper"
              />
            </div>
          <TextField
          id="filled-basic"
          label="Number Of Tickets"
          variant="outlined"
          type='number'
          value={ticket_count}
          sx={{width:'100%', mt:'20px'}}
          size="small"
          onChange={(e)=>setTicket_count(e.target.value)}
        />

          <TextField value={ticket_price} type='number' onChange={(e)=>setTicket_price(e.target.value)} id="filled-basic" label="Ticket Price" variant="outlined" sx={{width:'100%', mt:'20px'}} size="small"/>

          <div style={{display:'flex',justifyContent:'end', marginTop:'30px'}}>
            <Button onClick={updateEvent} variant='contained' color='success' sx={{mr:'10px'}}>Update</Button>
            <Button onClick={onClose} variant='contained'>Close</Button>
          </div>

        </Box>
      </Modal>
      </ThemeProvider>
    </div>
  );
}
