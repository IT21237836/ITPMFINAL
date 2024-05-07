import React, {useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Text, Divider } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { useState } from "react";
import EventScheduledModel from "../components/EventScheduleModel";
import Events from "../components/event/Events";
import { Grid, GridItem } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter,Stack, Heading, Image } from '@chakra-ui/react'


export const EventPage = () => {

    const navigate = useNavigate();
    const showToast = useShowToast();
    const logout = useLogout();

    const [user,setUser] = useState(JSON.parse(localStorage.getItem('user-backend')))
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [events, setEvent] = useState([1,2,3,4,5,6,7,8,9,10])

    const openSellingActiveModal = () => {
        setIsModalOpen(true);
    };

    const closeSellingActiveModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
      setUser(JSON.parse(localStorage.getItem('user-backend')))
    }, [])
    

    const freezeAccount = async () => {
        if (!window.confirm("Are you sure you want to freeze your account?")) return;

        try {
            const res = await fetch("/api/users/freeze", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.error) {
                return showToast("Error", data.error, "error");
            }
            if (data.success) {
                await logout();
                showToast("Success", "Your account has been frozen", "success");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const deleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        try {
            const res = await fetch("/api/users/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.error) {
                return showToast("Error", data.error, "error");
            }
            if (data.success) {
                await logout();
                showToast("Success", "Your account has been deleted", "success");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };


    return (
        <>
            <Text my={1} fontWeight={"bold"} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                Event Schedular
            </Text>
            <Text my={1}>Manage your events below</Text>

            <Divider my={4} />

            <Text my={1}>Publish event to threads:</Text>
            <Button size={"sm"} colorScheme="red" onClick={freezeAccount} mr={2}>
                Create New Event    
            </Button>

            <Divider my={4} />

            <Text my={1} fontWeight={"bold"}>
                Your Events
            </Text>

            <Divider my={4} />

            <Grid templateColumns='repeat(1, 1fr)' gap={6}>
            {events && events.length>0 && events.map((event) => (

                <GridItem w='100%' h='auto' bg='blue.500'>
                    <Card
                    direction={{ base: 'column', sm: 'row' }}
                    overflow='hidden'
                    variant='outline'
                    >
                    <Image
                        objectFit='cover'
                        maxW={{ base: '100%', sm: '200px' }}
                        src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                        alt='Caffe Latte'
                    />

                    <Stack>
                        <CardBody>
                        <Heading size='md'>The perfect latte</Heading>

                        <Text py='2'>
                            Caffè latte is a coffee beverage of Italian origin made with espresso
                            and steamed milk.
                        </Text>
                        </CardBody>

                        <CardFooter>
                        <Button variant='solid' colorScheme='blue'>
                            Buy Latte
                        </Button>
                        </CardFooter>
                    </Stack>
                    </Card>
                </GridItem>

            ))}
            
            </Grid>


            <EventScheduledModel isOpen={isModalOpen} onClose={closeSellingActiveModal} />
        </>
    );
};
