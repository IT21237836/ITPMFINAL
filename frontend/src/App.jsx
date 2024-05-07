import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import SellingDashboard from "./pages/SellingDashboard";
import SellerProducts from "./components/selling/SellerProducts";
import SellerOrders from "./components/selling/SellerOrders";
import { EventPage } from "./pages/EventPage";
function App() {
	const user = useRecoilValue(userAtom);
	const { pathname } = useLocation();
	return (
		<Box position={"relative"} w='full'>
			<Routes>
			<Route path='/selling-dashboard' element={JSON.parse(localStorage.getItem('user-backend'))?.user_type === "seller" ? <SellingDashboard /> :  <Navigate to={"/"} />} exact/>
			<Route path='/selling-products' element={JSON.parse(localStorage.getItem('user-backend'))?.user_type === "seller" ? <SellerProducts /> :  <Navigate to={"/"} />} exact/>
			<Route path='/selling-orders' element={JSON.parse(localStorage.getItem('user-backend'))?.user_type === "seller" ? <SellerOrders /> :  <Navigate to={"/"} />} exact />
			</Routes>
			<Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
				<Header />
				<Routes>
					<Route path='/' element={user ? <HomePage /> : <Navigate to='/auth' />} />
					<Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
					<Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />

					<Route
						path='/:username'
						element={
							user ? (
								<>
									<UserPage />
									<CreatePost />
								</>
							) : (
								<UserPage />
							)
						}
					/>
					<Route path='/:username/post/:pid' element={<PostPage />} />
					<Route path='/chat' element={user ? <ChatPage /> : <Navigate to={"/auth"} /> } />
					<Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
					<Route path='/event' element={<EventPage />} />
				</Routes>
			</Container>
		</Box>
	);
}

export default App;
