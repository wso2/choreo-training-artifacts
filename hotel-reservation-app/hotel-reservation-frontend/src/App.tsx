import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoomListing from "./pages/room_listing";
import Header from "./layout/AppBar";
import ReservationAddingPage from "./pages/reservations_adding";
import ReservationListing from "./pages/reservation_listing";
import { UserContext } from "./contexts/user";
import { User } from "./types/generated";
import ReservationUpdatingPage from "./pages/reservations_updating";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material/styles";
import NotFound from "./pages/not_found";
import LandingPage from "./pages/landing_page";
import theme from "./theme";
import ErrorPage from "./pages/error";
import Cookies from "js-cookie";


export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<User>({
  email: "",
  id: "",
  name: "",
  mobileNumber: "",
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  function getMappedUser(userInfo: any): User {
  return {
  email: userInfo?.email || "",
  id: userInfo?.sub || "",
  name: userInfo?.first_name + " " + userInfo?.last_name,
  mobileNumber: userInfo?.mobile_number || "",
  };
  }
  useEffect(() => {
  setIsAuthLoading(true);
  if (Cookies.get("userinfo")) {
  // We are here after a login
  const userInfoCookie = Cookies.get("userinfo");
  sessionStorage.setItem("userInfo", userInfoCookie || "");
  Cookies.remove("userinfo");
  var userInfo = userInfoCookie ? JSON.parse(atob(userInfoCookie)) : {};
  setSignedIn(true);
  setUser(getMappedUser(userInfo));
  } else if (sessionStorage.getItem("userInfo")) {
  // We have already logged in
  var userInfo = JSON.parse(atob(sessionStorage.getItem("userInfo")!));
  setSignedIn(true);
  setUser(getMappedUser(userInfo));
} else {
  console.log("User is not signed in");
  if (
  window.location.pathname !== "/auth/login" &&
  window.location.pathname !== "/"
  ) {
  window.location.pathname = "/auth/login";
  }
  }
  setIsAuthLoading(false);
  }, []);
  if (isAuthLoading) {
    return <div>User authenticating...</div>;
    }
      
