import React from "react";
import logo from "./../../assets/logo.png";
import avatar from "./../../assets/avtar.png";
import axios from "axios";
import { replace, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { ClickAwayListener } from "@mui/material";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import {
  Menu,
  Search,
  PlusCircle,
  Bell,
  Settings,
  LogOut,
  UserCircle,
  Building,
  Sun,
  Moon,
  RefreshCw,
  ListChecks,
  Users,
  Handshake,
  LayoutDashboard,
  AreaChart,
} from "lucide-react";
import avatarnew from "./../../assets/logonew.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { handleLogout } from "@/function/logout";

const Header = ({
  isDarkMode,
  toggleDarkMode,
  isSidebarOpen,
  setIsSidebarOpen,
  session,
  setSession,
  isAuthenticated,
  setIsAuthenticated,
  setPhoneSearch,
  phonesearch,
  filteredData,
  setFilteredData,
}) => {
  const navigate = useNavigate();

  const [currentsearch, setCurrentSearch] = useState("");
  const [openstate, setOpenState] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  console.log("Header calling darkmode");

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const currentSearchTerm = searchTerm.trim(); 
    if (!currentSearchTerm) return;
    console.log("Performing search for:", currentSearchTerm);

    navigate(`/home?search=${encodeURIComponent(currentSearchTerm)}`);
    setSearchTerm(""); 
  };

  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);


  const handleRefresh = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "https://crm-backend-msk3.onrender.com/searchapp/notification/api/v1/all",
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response from notification ", response.data.data);
      setNotification(response.data.data);
    } catch (error) {}

    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleInputChange = (e) => {
    e.preventDefault();

    const value = e.target.value;
    setSearchTerm(value);

    const params = new URLSearchParams(location.search);
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");  
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    console.log("Search input ", searchTerm);
  });

  return (
    <header
      className={`fixed top-0  shadow-lg shadow-gray-500/50 left-0 right-0 z-50 ${
        isDarkMode ? "dark bg-gray-800" : "bg-white"
      } shadow-sm transition-all duration-300`}
    >
      <div className="container mx-auto  ">
        <div className="flex items-center justify-between h-16">
          <div className="hidden lg:block relative">
            <div className="items-center flex space-x-3">
              <img
                src={logo}
                alt="Profile"
                className="w-12 h-12  rounded-full cursor-pointer "
                width={"40px"}
                height={"50px"}
              />

            
              <h4
                className={`scroll-m-20 text-xl font-semibold tracking-tight ${
                  isDarkMode === true ? "text-white" : "text-black"
                }`}
              >
                IMS Pvt Ltd
              </h4>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

         
          <div className="flex items-center space-x-4 justify-end">
       

            <form className="relative hidden sm:block">
              <duv className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <svg
                className="absolute hover:scale-110 left-3 px-1 top-1/2 -translate-y-1/2 w-7 h-7   text-gray-500 cursor-pointer"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
              <Input
                type="search"
                name="search"
                placeholder="Search..."
                className="h-9 pl-12 pr-2 w-36 md:w-48 lg:w-96 focus-visible:ring-primary focus-visible:ring-offset-0" // Adjusted width & focus
                value={searchTerm}
                onChange={handleInputChange} 
              />
            </form>

            <Button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                isDarkMode ? "text-yellow-400" : "text-gray-600"
              }`}
            >
              {isDarkMode ? "🌞" : "🌙"}
            </Button>

            <ClickAwayListener onClickAway={() => setIsOpen(false)}>
              <div className="relative   px-6 ">
                <button
                  className={`${
                    isDarkMode == false
                      ? "bg-blue-500 rounded-lg px-2 py-1"
                      : "bg-black rounded-lg px-2 py-1"
                  }`}
                  onClick={() => setIsOpen(!isOpen)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center space-x-2 relative">
                    <div className="">
                      <FaBell className={`h-6 w-6 text-white`} />
                      <span className="bg-red-500 text-white absolute -top-3  -right-6 text-xs font-semibold px-2 py-1 rounded-full min-w-[24px] flex items-center justify-center">
                        {notification.length >= 0 ? notification.length : "0"}
                      </span>
                    </div>

                    <span
                      className={`text-sm font-medium  ${
                        isDarkMode == true ? "text-white" : "text-white"
                      }`}
                    >
                      Notifications
                    </span>

                    <span
                      onClick={handleRefresh}
                      className=" text-black p-2 cursor-pointer"
                    >
                      <BiRefresh
                        className={`${isRefreshing ? "animate-spin" : ""}  ${
                          isDarkMode == true ? "text-white" : "text-white"
                        }`}
                      />
                    </span>
                  </div>
                </button>

                <div
                  className={`absolute w-full mt-2 ${
                    isDarkMode == true ? "bg-gray-800" : "bg-white"
                  } rounded-lg shadow-lg overflow-hidden transition-all duration-200  z-50 
       
      ${isOpen ? "block" : "hidden"}`}
                >
                  <div className="max-h-60 overflow-y-auto">
                    {notification.map((notification) => (
                      <div className="p-4 border-b border-gray-100  last:border-0">
                        <div className="flex justify-between items-start">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded ${
                              notification.isactive === true
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {notification.status}
                          </span>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded ${
                              notification.isactive === true
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {notification.custId}
                          </span>
                        </div>
                      </div>
                    ))}

                    {notification.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        No notifications found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ClickAwayListener>

            <ClickAwayListener onClickAway={() => setOpenState(false)}>
              <div className={`relative`}>
                <div
                  onClick={() => setOpenState(!openstate)}
                  className="focus:outline-none flex items-center gap-2 cursor-pointer"
                >
                  <Avatar className="border-2 border-black-500 w-10 h-10 shadow-lg">
                    <AvatarImage src={avatarnew} alt="User" />
                  </Avatar>
                </div>

                {openstate == true && (
                  <div
                    className={`ml-2 space-y-1 absolute right-[-37px] rounded-lg  ${
                      isDarkMode === true
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                    align="end"
                  >
                    <div className="cursor-pointer flex items-center px-2 py-2 hover:bg-slate-400 rounded-lg transition duration-300 ease-in-out">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </div>

                    <div
                      onClick={() => handleLogout(setIsAuthenticated, navigate)}
                      className="cursor-pointer flex items-center px-2 p-2 hover:bg-slate-400 transition duration-300 ease-in"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </ClickAwayListener>
          </div>
        </div>
      </div>

      
    </header>
  );
};

export default Header;
