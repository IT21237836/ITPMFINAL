import React, {useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Text, Divider, Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,ListItem,
    ListIcon,
    OrderedList,
    UnorderedList } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { useState } from "react";
import EventScheduledModel from "../components/EventScheduleModel";
import Events from "../components/event/Events";
import { Grid, GridItem } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter,Stack, Heading, Image } from '@chakra-ui/react'
import EventUpdatedModel from "../components/EventUpdateModal";


export const EventPage = () => {

    const navigate = useNavigate();
    const showToast = useShowToast();
    const logout = useLogout();

    const [user,setUser] = useState(JSON.parse(localStorage.getItem('user-backend')))
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [event, setEvent] = useState(null);

    const [events, setEvents] = useState([])

    const openEventModal = () => {
        setIsModalOpen(true);
    };

    const closeEventModal = () => {
        setIsModalOpen(false);
    };

    const openEventUpdateModal = (event) => {
        setEvent(event)
        setIsUpdateModalOpen(true);
    };

    const closeEventUpdateModal = () => {
        setEvent(null)
        setIsUpdateModalOpen(false);
    };

    useEffect(() => {
      setUser(JSON.parse(localStorage.getItem('user-backend')))
      getEventByUserId()
    }, [])

    const getEventByUserId= async () => {
        const userId = user?._id
        try {

            const res = await fetch(`/api/posts/get-events-by-user-id/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            console.log(data);

            setEvents(data);
        } catch (error) {
          showToast("Error", "Error getting events", "error");
        }
      };
    


    const deleteEvent = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete event? This action cannot be undone.")) return;

        try {
            await fetch(`/api/posts/${eventId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

        
                showToast("Success", "Your event has been deleted", "success");
                getEventByUserId()
            
        } catch (error) {
            showToast("Error", "failed to delete event", "error");
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
            <Button size={"sm"} colorScheme="red" onClick={openEventModal} mr={2}>
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
                        src={event?.img}
                        alt='Event poster'
                    />

                    <Stack>
                        <CardBody>
                        <Heading size='md'>{event?.text}</Heading>

                        <Text py='2'> 
                            Event Date : {event?.event_date}
                        </Text>
                        <Text py='2'> 
                            Ticket Count : {event?.ticket_count}
                        </Text>
                        <Text py='2'> 
                            Ticket Price : {event?.ticket_price}
                        </Text>

                        <Popover placement="top">
                        <PopoverTrigger>
                            <Button> Buyers</Button>
                        </PopoverTrigger>
                        <PopoverContent maxH="200px" overflowY="auto">
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Ticket Buyers</PopoverHeader>
                            <PopoverBody>
                                <UnorderedList>
                                    {event && event.tickets?.length > 0 && event.tickets.map((ticket, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                Buyer: {ticket?.userId?.name}
                                            </ListItem>
                                            <ListItem>
                                                Quantity: {ticket?.quantity}
                                            </ListItem>
                                            {index < event.tickets.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </UnorderedList>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>

                        </CardBody>

                        <CardFooter>
                        <Button variant='solid' colorScheme='blue' onClick={()=>openEventUpdateModal(event)}>
                            Update
                        </Button>
                        <Button variant='solid' colorScheme='red' style={{marginLeft:'10px'}} onClick={()=>deleteEvent(event._id)}>
                            Delete
                        </Button>
                        </CardFooter>
                    </Stack>
                    </Card>
                </GridItem>

            ))}
            
            </Grid>


            <EventScheduledModel isOpen={isModalOpen} onClose={closeEventModal} />
            <EventUpdatedModel isOpen={isUpdateModalOpen} onClose={closeEventUpdateModal} event={event}/>
        </>
    );
};
