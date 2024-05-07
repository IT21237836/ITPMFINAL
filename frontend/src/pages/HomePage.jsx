import { Box, Flex, Spinner, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { FaUserPlus, FaBriefcase } from "react-icons/fa"; // Import icons
import { Link } from "react-router-dom"; // Import Link from React Router
import { Spacer } from '@chakra-ui/react';
import EventIcon from '@mui/icons-material/Event';


const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast();

    const getFeedPosts = async () => {
        setLoading(true);
        setPosts([]);
        try {
            const res = await fetch("/api/posts/feed");
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
            } else {
                setPosts(data);
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFeedPosts();
    }, [showToast, setPosts]);

    return (
        <>
            <Flex justify="space-between" align="center" mb="4">
                <Button leftIcon={<FaUserPlus />} colorScheme="teal">Join as Consultant</Button>
                <Spacer />
                <Link to="/event" >
                    <Button style={{marginRight:'10px'}} leftIcon={<EventIcon />} colorScheme="blue">Your Events</Button>
                </Link>
                
                <Link to="/jobs">
                    <Button leftIcon={<FaBriefcase />} colorScheme="blue">See Jobs</Button>
                </Link>
            </Flex>
            <Flex gap="10" alignItems="flex-start">
                <Box flex={70}>
                    {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

                    {loading && (
                        <Flex justify="center">
                            <Spinner size="xl" />
                        </Flex>
                    )}

                    {posts?.map((post) => (
                        <Post key={post._id} post={post} postedBy={post.postedBy}/>
                    ))}
                </Box>
                <Box flex={30} display={{ base: "none", md: "block" }}>
                    <SuggestedUsers />
                </Box>

				
            </Flex>
        </>
    );
};

export default HomePage;
