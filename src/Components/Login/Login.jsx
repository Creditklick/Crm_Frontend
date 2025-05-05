



import React, { useState } from "react";
import ck from "./../../assets/logo.png";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import axios from "axios";
import "./Login.css";
import { Button } from "@/Components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";


const Login = ({ setIsAuthenticated, setSession }) => {
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("agent"); // NEW: userType state


  const navigate = useNavigate();

  const handlePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordType(!passwordType);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingError(false);
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://172.16.0.20:8000/searchapp/login/",
        {
          employee: employeeCode,
          password: password,
          userType: userType, // NEW: include userType in request
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.token;
      setSession(token);
      localStorage.setItem("token", token);
      
         setIsAuthenticated(true);
      
      //setIsAuthenticated(true);
      toast.success(
        <div>
          <strong style={{ fontSize: '16px', color: '#0d47a1' }}>Welcome to CREDITKLICK CRM!</strong>
          <p style={{ margin: 0, color: '#1976d2' }}>Login Successful, {employeeCode}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000, // Toast will close after 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light", // Using light theme
          icon: "🎉", // Optional custom icon (you can change this to any emoji or custom icon)
          style: {
            background: '#42a5f5', // Light blue background color
            color: '#fff', // White text color
            padding: '20px', // Padding to make the toast larger
            borderRadius: '10px', // Rounded corners for a modern look
            fontWeight: 'bold', // Bold text
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Light shadow for a floating effect
          },
        }
      );

      setTimeout(()=>{
        if(userType==='agent'){
          navigate("/home", { replace: true });
        }
        else{
          // <Navigate path="/senior_dashboard"   />
          navigate('/senior_dashboard', { replace: true });
  
         // navigate('/senior_dashboard',{replace : true})
        }

      },1500)

     
   

    } catch (error) {
      setError("Invalid Employee Code or Password");
      setLoadingError(true);
      console.error("Login Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left side with branding */}
      <div className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="text-center text-white z-10 animate__animated animate__fadeIn animate__delay-1s">
          <p className="text-6xl font-extrabold tracking-wider animate__animated animate__fadeInUp">
            IMS CRM
          </p>
          <p className="mt-4 text-2xl font-medium animate__animated animate__fadeIn animate__delay-1.5s">
            Customer Relationship Management System
          </p>
        </div>
      </div>

      {/* Right side login form */}
      <div className="flex-1 flex items-center justify-center bg-white py-10 px-5">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-400 transform rotate-45 z-0"></div>
          <div className="text-center mb-10 z-10">
            <img
              src={ck}
              alt="logo"
              className="w-20 h-20 mx-auto rounded-full"
            />
            <p className="text-2xl font-semibold text-gray-800 mt-4">
              Login to Dashboard
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {/* User type radio buttons */}
            <div className="mb-6">
              <Label className="block mb-1 text-sm font-medium text-gray-700">
                Login As:
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="userType"
                    value="agent"
                    checked={userType === "agent"}
                    onChange={() => setUserType("agent")}
                  />
                  <span>Agent</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="userType"
                    value="senior"
                    checked={userType === "senior"}
                    onChange={() => setUserType("senior")}
                  />
                  <span>Senior</span>
                </label>
              </div>
            </div>

            {/* Employee Code input */}
            <div className="mb-6 space-y-1">
              <Label htmlFor="employeeCode">Emp Id</Label>
              <Input
                type="text"
                id="employeeCode"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your emp ID"
              />
            </div>

            {/* Password input with toggle */}
            <div className="mb-6 relative space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                type={passwordType ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Password"
              />
              <button
                onClick={handlePasswordVisibility}
                className="absolute right-[24px] bottom-[10px]"
              >
                {passwordType ? <GoEye /> : <GoEyeClosed />}
              </button>
            </div>

            {/* Loader */}
            {loading && !loadingError && (
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="animate-spin" size={20} />
                <span className="ml-2 text-gray-700">Loading...</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <span className="text-red-500 text-center block mb-4">
                {error}
              </span>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full cursor-pointer h-[40px]"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>

            <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
