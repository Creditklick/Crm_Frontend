import React, { useState, useEffect } from 'react';
import Header from './Components/Pages/Header';
import Dashboard from './Components/Pages/Dashboard';
import { Routes, Route, Navigate, BrowserRouter, useLocation } from 'react-router-dom';  
import Login from './Components/Login/Login';
import axios from 'axios';
import Persona from './Components/Pages/persona';
import Signup from './Components/Login/signup';
import Senior_Header from './Components/Senior_Page/Senior_Header';
import SeniorDashboard from './Components/Senior_Page/SeniorDashboard';
import GeminiChat from './Components/Senior_Page/GeminiChat';
import Testing from './Components/Senior_Page/Testing'
function LayoutWrapper({
  isDarkMode,
  setIsDarkMode,
  isSidebarOpen,
  setIsSidebarOpen,
  isAuthenticated,
  setIsAuthenticated,
  session,
  setSession,
  inputValue,
  setInputValue,
  handleLogout,
  toggleDarkMode,
  recentActivities,
  filteredData,
  setPhoneSearch,
  phonesearch,
  setPhoneNumber,
  handleSearch,
  searchParams,     
  setSearchParams    
}) {
     
    const location = useLocation();
    useEffect(() => {
      if (location.pathname == '/') {
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      }
   }, [location.pathname]); 


  const shouldHideFooter = ['/home','/test'  , ['/persona/']].some(item => location.pathname.startsWith(item));

  return (
   
      <div
        className={`min-h-screen ${
          isDarkMode ? "dark bg-gray-900" : "bg-gray-100"
        }`}
      >
        { shouldHideFooter &&  isAuthenticated && (
          <Header
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
            session={session}
            setSession={setSession}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            setPhoneSearch={setPhoneSearch}
            filteredData={filteredData}
          />
        )}

        

        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={
                  <Dashboard
                    isDarkMode={isDarkMode}
                    isSidebarOpen={isSidebarOpen}
                    recentActivities={recentActivities}
                    filteredData={filteredData}
                    setIsAuthenticated={setIsAuthenticated}
                    isAuthenticated={isAuthenticated}
                    phonesearch={phonesearch}
                    inputValue={inputValue}
                  />
                }
              />
            }
          />




          <Route
            path="/"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setSession={setSession}
                setPhoneNumber={setPhoneNumber}
                handleSearch={handleSearch}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            }
          />
          

          <Route
            path="/persona/:stefto_id/*"
              element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={
                  <Persona
                    isDarkMode={isDarkMode}
                    setInputValue={setInputValue}
                    inputValue={inputValue}
                  />
                }
              />
            }
          />
          <Route path="/senior_dashboard"  element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={
                  <Senior_Header/> 
                }
              />} />
               

               <Route 
    path="/signuppage" 
    element={<Signup />} 
  />

  <Route 
    path="/test" 
    element={<Testing/>}
  />
  
  <Route 
    path="/chatbox" 
    element={
      <ProtectedRoute
        isAuthenticated={isAuthenticated}
        element={<GeminiChat />}
      />
    }
  />



        </Routes>
      </div>
   
  );
}

const ProtectedRoute = ({ isAuthenticated, element }) => {
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const gettingsessionstate = localStorage.getItem('token');
  const [session, setSession] = useState(gettingsessionstate);
  const [isAuthenticated, setIsAuthenticated] = useState(!!gettingsessionstate);

  // Consolidated search parameters state
  const [searchParams, setSearchParams] = useState({
    steftoId: '',
    cityName: '',
    acNumber: '',
    fullName: '',
    phoneNo: '',
    custId: '',
    Total_outs: '',
    phonesearch: '',
  });

  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = async (token) => {
    try {
      const res = await axios.get("https://crm-backend-msk3.onrender.com/searchapp/getUserData", {
        params: {
          Name_query: searchParams.fullName,
          Account_Number_query: searchParams.acNumber,
          Phone_Number_query: searchParams.phoneNo,
          City_query: searchParams.cityName,
          SteftoNo_query: searchParams.steftoId,
          CUSTID_query: searchParams.custId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      setFilteredData(res.data);
    } catch (error) {
      console.error("Error in Search:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      handleSearch(token);
    }
  }, [session, searchParams]); // Added searchParams to dependencies

  const recentActivities = [
    { id: 1, title: "New client onboarded", time: "5 min ago" },
    { id: 2, title: "Meeting with product team", time: "2 hours ago" },
    { id: 3, title: "Project deadline updated", time: "4 hours ago" },
  ];

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    //document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
   
  };

  return (
    <BrowserRouter>
          <LayoutWrapper
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
      session={session}
      setSession={setSession}
      inputValue={inputValue}
      setInputValue={setInputValue}
      handleLogout={handleLogout}
      toggleDarkMode={toggleDarkMode}
      recentActivities={recentActivities}
      filteredData={filteredData}
      setFilteredData={setFilteredData}
      setPhoneSearch={(value) => setSearchParams(prev => ({...prev, phonesearch: value}))}
      phonesearch={searchParams.phonesearch}
      setPhoneNumber={(value) => setSearchParams(prev => ({...prev, phoneNo: value}))}
      handleSearch={handleSearch}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
    />
    </BrowserRouter>
   
  );
}

export default App;




















