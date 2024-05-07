import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Title from "../selling/Title";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import AddBoxIcon from "@mui/icons-material/AddBox";

import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import Divider from "@mui/material/Divider";
import SettingsIcon from "@mui/icons-material/Settings";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import ClearIcon from "@mui/icons-material/Clear";
import Paper from "@mui/material/Paper";
import { Avatar } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import {Input} from "@chakra-ui/react";
import usePreviewImg from "../../hooks/usePreviewImg";


export default function Events({seller}) {

    const theme = createTheme();
    const navigate = useNavigate();
    const showToast = useShowToast();
    const fileInput = React.useRef();

    const {handleImageChange, imgUrl, setImgUrl} = usePreviewImg()

    const [text, setText] = React.useState(null)
    const [img, setImg] = React.useState(imgUrl)
    const [imgChanged, setImgChanged] = useState(false)
    const [quantity, setQuantity] = React.useState(null)
    const [unit_price, setUnit_price] = React.useState(null)

    const [addProductState, setAddProductState] = useState(false);
    const [productUpdateState, setProductUpdateState] = useState(false);
    const [currentUpdate, setCurrentUpdate] = useState(null);
    const [sellerDetails, setSeller] = useState(JSON.parse(localStorage.getItem('user-backend')) || seller)

    const [open, setOpen] = React.useState(false);
    const [errorOpen, setErrorOpen] = React.useState(false);
    const [progress, setProgress] = React.useState("none");
    const [updateOpen, setUpdateOpen] = React.useState(false);
    const [updateFailOpen, setUpdateFailOpen] = React.useState(false);
    const [updateProgress, setUpdateProgress] = React.useState("none");
    const [updateBtnOpacity, setUpdateBtnOpacity] = React.useState(1);
    const [products, setProducts] = React.useState([]);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });


    const changeState = () => {
        setAddProductState(false);
    };
    const changeUpdateState = () => {
        setCurrentUpdate(null);
        setProductUpdateState(false);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
    
        setOpen(false);
        setErrorOpen(false);
        setUpdateFailOpen(false);
        setUpdateOpen(false);
    };

    const editProduct = (product) => {
        setCurrentUpdate(product);
        setText(product.text);
        setQuantity(product.quantity);
        setUnit_price(product.unit_price);
        setImgUrl(product.img);
        setProductUpdateState(true);
      };

    const getProductsBySellerId = async () => {
        const sellerId = sellerDetails?._id || seller?._id;
        try {

            const res = await fetch(`/api/posts/get-products-cy-seller-id/${sellerId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            setProducts(data);
        } catch (error) {
          showToast("Error", "Error getting products", "error");
        }
      };
    
    useEffect(() => {
        if(seller){
            getProductsBySellerId();
        }
        else{
            showToast("Error", "Invalid Seller", "error");
            navigate('/selling-dashboard');
        }
        
    }, []);

    const publish = async (event) => {
        setImg(imgUrl)
        setUpdateProgress("block");
        setUpdateBtnOpacity(0.5);
        var isSuccess = true;
        if (!text || !quantity || !unit_price || !imgUrl) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill all the fields",
            footer: '<a href="">Why do I have this issue?</a>',
          });
          isSuccess = false;
          setUpdateBtnOpacity(1);
          setUpdateProgress("none");
        }
    
        if (isSuccess) {
    
          try {
            const res = await fetch("/api/posts/create-seller-post", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ postedBy: seller._id, text: text, img: imgUrl, quantity:quantity, unit_price:unit_price }),
			});

			const data = await res.json();
            Swal.fire({
              icon: "success",
              title: "Published",
              text: "Product published successfully",
            });
            console.log(data);
            setProducts([...products, data])
            setUpdateProgress("none");
            setImgUrl("")
            setUpdateOpen(true);
            setUpdateBtnOpacity(1);
            setAddProductState(false);
          } catch (error) {
            setUpdateProgress("none");
            setUpdateFailOpen(true);
            setUpdateBtnOpacity(1);
            console.log(error.response.data.error);
    
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.response.data.error,
            });
          }
        }
    };

    const update = async (product) => {

        var productId = product._id;
        
    
        setUpdateProgress("block");
        setUpdateBtnOpacity(0.5);
        var isSuccess = true;
        
        if (
          !text ||
          !imgUrl ||
          !quantity ||
          !unit_price
        ) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill all the fields",
            footer: '<a href="">Why do I have this issue?</a>',
          });
          isSuccess = false;
          setUpdateBtnOpacity(1);
          setUpdateProgress("none");
        }
    
        if (isSuccess) {

            if(imgUrl !== currentUpdate.img){
                setImgChanged(true)
            }
          
    
          try {
            const res = await fetch(`/api/posts/update-seller-post/${productId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: text, img: imgUrl, quantity:quantity, unit_price:unit_price, imgChanged: imgChanged }),
			});

			const data = await res.json();
            Swal.fire({
              icon: "success",
              title: "Updated",
              text: "Product updated successfully",
            });
            console.log(data);
            setUpdateProgress("none");
            setUpdateOpen(true);
            setImgUrl("")
            setUpdateBtnOpacity(1);
            setAddProductState(false);
            setProductUpdateState(false);
            setCurrentUpdate(null);
            getProductsBySellerId();
          } catch (error) {
            setUpdateProgress("none");
            setUpdateFailOpen(true);
            setUpdateBtnOpacity(1);
            console.log(error.response.data.error);
    
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.response.data.error,
            });
          }
        }
    };

    const deleteProduct = async (id) => {

        if(!id){
          alert("Id is null");
        }
        else{
        Swal.fire({
          title: "Are you sure to delete product?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Delete it!",
        }).then(async(result) => {
          if (result.isConfirmed) {
            try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Product deleted", "success");
            console.log(data);
            setUpdateProgress("none");
            setUpdateBtnOpacity(1);
            setAddProductState(false);
            setProductUpdateState(false);
            setCurrentUpdate(null);
            getProductsBySellerId();
          } catch (error) {
            setUpdateProgress("none");
            setUpdateFailOpen(true);
            setUpdateBtnOpacity(1);
            console.log(error.response.data.error);
    
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.response.data.error,
            });
          }
          }
        });
      }
       
    };

    if (addProductState && !productUpdateState) {
        return (
            <ThemeProvider theme={theme}>
            <div className="edit_form">
                <Input type='file' hidden ref={fileInput} onChange={handleImageChange} />

                <Box sx={{ maxWidth: "50%", marginTop: "50px", marginLeft: "200px" }}>
                <Tooltip title="Close" placement="top-end">
                    <IconButton sx={{ marginLeft: "35vw" }} onClick={changeState}>
                    <ClearIcon sx={{ display: "flex" }} />
                    </IconButton>
                </Tooltip>
                <Typography variant="h6" gutterBottom sx={{marginLeft: "220px"}}>
                    Add Product
                </Typography>
                <Avatar
                    src={imgUrl ? imgUrl : null}
                    sx={{ width: "300px", height: "300px", marginLeft: "140px" }}
                    variant="square"
                >
                    Add product image
                </Avatar>

                <Tooltip title="Change or add profile image">
                    <Button color="success" onClick={() => fileInput.current.click()} sx={{marginLeft: "220px"}}>
                    Upload Image
                    </Button>
                </Tooltip>
                <Box sx={{ width: "100%", display: progress }}>
                    <LinearProgress />
                </Box>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert
                    severity="success"
                    sx={{ width: "100%" }}
                    onClose={handleClose}
                    >
                    Image uploaded!
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={errorOpen}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                    severity="error"
                    sx={{ width: "100%" }}
                    onClose={handleClose}
                    >
                    Image not uploaded!
                    </Alert>
                </Snackbar>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        id="text"
                        name="text"
                        label="Product Text"
                        fullWidth
                        autoComplete="given-name"
                        variant="standard"
                        onChange={(e) => setText(e.target.value)}
                    />
                    </Grid>

                    {/* <Grid item xs={12} sm={12}>
                    <Autocomplete
                        id="clear-on-escape"
                        options={categories}
                        clearOnEscape
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Category"
                            variant="standard"
                        />
                        )}
                        onChange={(event, newValue) => {
                        setCategory(newValue);
                        }}
                    />
                    </Grid> */}
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="quantity"
                        label="Product Quantity"
                        name="quantity"
                        variant="standard"
                        type="number"
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="unit_price"
                        label="Unit Price"
                        name="unit_price"
                        variant="standard"
                        type="number"
                        onChange={(e) => setUnit_price(e.target.value)}
                    />
                    </Grid>
                </Grid>
                <Box sx={{ width: "100%", display: updateProgress }}>
                    <LinearProgress />
                </Box>
                <Grid item xs={12} sx={{ marginTop: "50px", marginBottom: "50px" }}>
                    <Snackbar
                    open={updateOpen}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    >
                    <Alert
                        severity="success"
                        sx={{ width: "100%" }}
                        onClose={handleClose}
                    >
                        Product Published
                    </Alert>
                    </Snackbar>

                    <Snackbar
                    open={updateFailOpen}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    >
                    <Alert
                        severity="error"
                        sx={{ width: "100%" }}
                        onClose={handleClose}
                    >
                        Failed to publish
                    </Alert>
                    </Snackbar>

                    <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Tooltip
                        title="Publish your product to customers"
                        placement="top-end"
                        >
                        <Button
                            variant="contained"
                            color="success"
                            onClick={publish}
                            sx={{ opacity: updateBtnOpacity, marginLeft: "220px" }}
                        >
                            Publish Product
                        </Button>
                        </Tooltip>
                    </Grid>
                    </Grid>
                </Grid>
                </Box>
      </div>
      </ThemeProvider>
        )
    }
    else if (!products) {
        <ThemeProvider theme={theme}>
    <div>
        <h4>Loading...</h4>
    </div>
    </ThemeProvider>
    } else if (productUpdateState && !addProductState) {
        return(
            <ThemeProvider theme={theme}>
            <div className="edit_form">
                <Input type='file' hidden ref={fileInput} onChange={handleImageChange} />

                <Box sx={{ maxWidth: "50%", marginTop: "50px", marginLeft: "200px" }}>
                <Tooltip title="Close" placement="top-end">
                    <IconButton sx={{ marginLeft: "35vw" }} onClick={changeUpdateState}>
                    <ClearIcon sx={{ display: "flex" }} />
                    </IconButton>
                </Tooltip>
                <Typography variant="h6" gutterBottom sx={{marginLeft: "220px"}}>
                    Update Product
                </Typography>
                <Avatar
                    src={imgUrl ? imgUrl : null}
                    sx={{ width: "300px", height: "300px", marginLeft: "140px" }}
                    variant="square"
                >
                    Add product image
                </Avatar>

                <Tooltip title="Change or add profile image">
                    <Button color="success" onClick={() =>{setImgChanged(true); fileInput.current.click()}} sx={{marginLeft: "220px"}}>
                    Upload Image
                    </Button>
                </Tooltip>
                <Box sx={{ width: "100%", display: progress }}>
                    <LinearProgress />
                </Box>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert
                    severity="success"
                    sx={{ width: "100%" }}
                    onClose={handleClose}
                    >
                    Image uploaded!
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={errorOpen}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                    severity="error"
                    sx={{ width: "100%" }}
                    onClose={handleClose}
                    >
                    Image not uploaded!
                    </Alert>
                </Snackbar>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        id="text"
                        name="text"
                        label="Product Text"
                        fullWidth
                        defaultValue={text}
                        autoComplete="given-name"
                        variant="standard"
                        onChange={(e) => setText(e.target.value)}
                    />
                    </Grid>

                    {/* <Grid item xs={12} sm={12}>
                    <Autocomplete
                        id="clear-on-escape"
                        options={categories}
                        clearOnEscape
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label={currentUpdate.categoryName}
                            defaultValue={currentUpdate.categoryName}
                            variant="standard"
                        />
                        )}
                        onChange={(event, newValue) => {
                        setCategory(newValue.code);
                        }}
                    />
                    </Grid> */}
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="quantity"
                        label="Item Qunatity"
                        defaultValue={quantity}
                        name="quantity"
                        variant="standard"
                        type="number"
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="unit_price"
                        label="Unit Price"
                        defaultValue={unit_price}
                        name="unit_price"
                        variant="standard"
                        onChange={(e) => setUnit_price(e.target.value)}
                    />
                    </Grid>
                    
                </Grid>
                <Box sx={{ width: "100%", display: updateProgress }}>
                    <LinearProgress />
                </Box>
                <Grid item xs={12} sx={{ marginTop: "50px", marginBottom: "50px" }}>
                    <Snackbar
                    open={updateOpen}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    >
                    <Alert
                        severity="success"
                        sx={{ width: "100%" }}
                        onClose={handleClose}
                    >
                        Product Updated
                    </Alert>
                    </Snackbar>

                    <Snackbar
                    open={updateFailOpen}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    >
                    <Alert
                        severity="error"
                        sx={{ width: "100%" }}
                        onClose={handleClose}
                    >
                        Failed to update
                    </Alert>
                    </Snackbar>

                    <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Tooltip
                        title="Publish your product to customers"
                        placement="top-end"
                        >
                        <Button
                            variant="contained"
                            color="success"
                            sx={{ opacity: updateBtnOpacity, marginLeft: "40px" }}
                            onClick={() => update(currentUpdate)}
                        >
                            Update Product
                        </Button>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={6}>
                        <Tooltip title="Delete product" placement="top-end">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={()=>deleteProduct(currentUpdate._id)}
                            sx={{ opacity: updateBtnOpacity, marginLeft: "40px" }}
                        >
                            Delete Product
                        </Button>
                        </Tooltip>
                    </Grid>
                    </Grid>
                </Grid>
                </Box>
            </div>
            </ThemeProvider>
        )
    }
    else {
        return (
            <ThemeProvider theme={theme}>
            <React.Fragment>
            <Title>Products</Title>
            <Tooltip title="Add product to your store" placement="top-end">
                <Button
                variant="outlined"
                startIcon={<AddBoxIcon />}
                sx={{ width: "200px" }}
                onClick={(e) => setAddProductState(true)}
                >
                Add Product
                </Button>
            </Tooltip>
    
            <Grid container spacing={4} sx={{ marginTop: "10px" }}>
                {products && products.length>0 && products.map((product) => (
                <Grid item xs={12} md={4} key={product?._id}>
                    <Card sx={{ maxWidth: 345, minHeight: 350 }}>
                    
                    <CardMedia
                        component="img"
                        height="194"
                        image={product.img}
                        alt="Paella dish"
                    />
                    
                    <CardContent>
                        <Typography
                        variant="p"
                        color="text.primary"
                        sx={{ textAlign: "left", display: "flex" }}
                        >
                        {product.text.length <= 35
                            ? product.text
                            : product.text.substr(0, 35) + "..."}
                        </Typography>
                        <br></br>
                        <Typography
                        variant="p"
                        color="text.secondary"
                        sx={{ textAlign: "left", display: "flex" }}
                        >
                        Unit Price : {product.unit_price}
                        </Typography>
    
                        <Typography
                        variant="p"
                        color="text.secondary"
                        sx={{ textAlign: "match-parent", display: "flex" }}
                        >
                        Available Stock : {product.quantity}
                        </Typography>
                    </CardContent>
    
                    <CardActions disableSpacing>
                        <Tooltip title="Update/Delete product" placement="top-end">
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            sx={{
                            width: "100%",
                            bottom: 0,
                            }}
                            onClick={(e) => editProduct(product)}
                        >
                            Update
                        </Button>
                        </Tooltip>
                    </CardActions>
                    </Card>
                </Grid>
                ))}
            </Grid>
            </React.Fragment>
            </ThemeProvider>
        );
    }
}