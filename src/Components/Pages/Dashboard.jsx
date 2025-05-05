import React, { useState, useEffect, useMemo , useRef } from 'react';
import Showdata from './Showdata';
import { FaDollarSign, FaCheckCircle, FaExclamationTriangle, FaCreditCard, FaLock, FaHandshake, FaPhone, FaRedo } from 'react-icons/fa';
import axios from 'axios';
import { Button } from "@/Components/ui/button";
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  Users,
  Network,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"; 
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { handleLogout } from '@/function/logout';
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};
const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.1 } }
};
const gridItemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 25 }, 
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};


const Dashboard = ({ isDarkMode, isSidebarOpen, recentActivities, filteredData, phonesearch , setIsAuthenticated }) => {
  const [paymentStats, setPaymentStats] = useState({
    cibilCleanup: 0,
    fullyPaid: 0,
    partiallyPaid: 0,
    settlement: 0,
    totalRecoverAmount: 0,
    totalOut: 0,
    pendingAmount: 0
  });


  const [promisecallback,setPromiseCallback] = useState({
       totalcallback : 0,
       totalpromisetopay : 0
  })

  const navigate = useNavigate();
  const [todo,setTodo] = useState({
         fully : 0,
         partially : 0,
         settlement : 0,
         cibilCleanUp : 0
  })


const menuItems = useMemo(() => [
  { name: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { name: "Tasks", icon: ListChecks, key: "tasks" },
  { name: "Clients", icon: Users, key: "clients" },
  { name: "Projects", icon: Network, key: "projects" },
  { name: "Analytics", icon: BarChart3, key: "analytics" },
  { name: "Settings", icon: Settings, key: "settings" },
], []);

  const memoizedTotalOut = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const totalOutValue = parseFloat(item.Total_outs);
      return acc + (isNaN(totalOutValue) ? 0 : totalOutValue);
    }, 0);
  }, [filteredData]);

  const hasFetchedToDo = useRef(false);

  const endpoints = {
    todoFully: 'https://crm-backend-msk3.onrender.com/alphaselector/api/tos/pos/gateway/fullypaid',
    todoPartially: 'https://crm-backend-msk3.onrender.com/alphaselector/api/tos/pos/gateway/partiallypaid',
    todoCibil: 'https://crm-backend-msk3.onrender.com/alphaselector/api/tos/pos/gateway/cibilcleanup',
    todoSettlement: 'https://crm-backend-msk3.onrender.com/alphaselector/api/tos/pos/gateway/settlement',
    getamount : 'https://crm-backend-msk3.onrender.com/alphaselector/api/payment/getamount/',
    callback_promisespay : 'https://crm-backend-msk3.onrender.com/searchapp/api/header/callback_promisespay'
  };



  useEffect(() => {
    const token = localStorage.getItem('token');
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
  
    const fetchPaymentData = async () => {
      try {
        const { data } = await axios.get(endpoints.getamount, { headers });
        setPaymentStats(prev => ({
          ...prev,
          cibilCleanup: data.message.Cibil_Cleanup_,
          fullyPaid: data.message.Full_Paid_,
          partiallyPaid: data.message.Partially_Paid_,
          settlement: data.message.Settlement_,
          totalRecoverAmount: data.message.totalRecoverAmount_
        }));
      } catch (error) {
        console.error("Payment data fetch error:", error.message);
      }
    };
  
  
    const fetchAllTodoList = async () => {
      try {
        const results = await Promise.allSettled([
          axios.get(endpoints.todoFully, { headers }),
          axios.get(endpoints.todoPartially, { headers }),
          axios.get(endpoints.todoSettlement, { headers }),
          axios.get(endpoints.todoCibil, { headers })
        ]);
  
        const [fullRes, partiallyRes, settlementRes, cibilRes] = results;
  
        setTodo({
          fully: fullRes.status === "fulfilled" ? fullRes.value.data?.message || 0 : 0,
          partially: partiallyRes.status === "fulfilled" ? partiallyRes.value.data?.message || 0 : 0,
          settlement: settlementRes.status === "fulfilled" ? settlementRes.value.data?.message || 0 : 0,
          cibilCleanUp: cibilRes.status === "fulfilled" ? cibilRes.value.data?.message || 0 : 0
        });
  
      } catch (err) {
        console.error("Error fetching todo list:", err);
      }
    };
  
    fetchPaymentData();
  
    if (!hasFetchedToDo.current) {
      fetchAllTodoList();
      hasFetchedToDo.current = true;
    }


    const get_callback_promisespay = async()=>{
          try{
                   const response = await axios.get(endpoints.callback_promisespay , {headers});
                   if(response.data.success===true){
                    setPromiseCallback(prev=>({
                       ...prev,
                       totalcallback : response.data.message?.Callback || 0,
                       totalpromisetopay : response.data.message?.Promises_pay || 0
                    }));
                   }
          }
          catch(err){
             console.log("Error in Fetching the call back and promisepay data");
          }
    }

    get_callback_promisespay();

  }, []);
  



  
     


  const stats = useMemo(() =>{
  const totalTos = (
    (todo.fully?.totalTos || 0) +
    (todo?.partially?.totalTos || 0) +
    (todo?.cibilCleanUp?.totalTos || 0) +
    (todo?.settlement?.totalTos || 0)
  );

  const totalPos = (
    (todo.fully?.totalPos || 0) +
    (todo?.partially?.totalPos || 0) +
    (todo?.cibilCleanUp?.totalPos || 0) +
    (todo?.settlement?.totalPos || 0)
  );

  

  return [
    {
      Logo: FaDollarSign,
      title: "TOTAL",
      value: paymentStats.totalRecoverAmount,
      color: "bg-blue-500",
      tos: totalTos,
      pos: totalPos,
    },
    {
      Logo: FaCheckCircle,
      title: "FULLY PAID",
      value: paymentStats.fullyPaid,
      color: "bg-green-500",
      tos: todo.fully?.totalTos || 0,
      pos: todo.fully?.totalPos || 0,
    },
    {
      Logo: FaExclamationTriangle,
      title: "PARTIALLY PAID",
      value: paymentStats.partiallyPaid,
      color: "bg-yellow-500",
      tos: todo?.partially?.totalTos || 0,
      pos: todo?.partially?.totalPos || 0,
    },
    {
      Logo: FaCreditCard,
      title: "CLAIMS PAID",
      value: "12",
      color: "bg-red-500",
      tos : 0,
      pos : 0
    },
    {
      Logo: FaLock,
      title: "CIBIL CLEANUP",
      value: paymentStats.cibilCleanup,
      color: "bg-teal-500",
      tos: todo?.cibilCleanUp?.totalTos || 0,
      pos: todo?.cibilCleanUp?.totalPos || 0,
    },
    {
      Logo: FaHandshake,
      title: "SETTLEMENT",
      value: paymentStats.settlement,
      color: "bg-orange-500",
      tos: todo?.settlement?.totalTos || 0,
      pos: todo?.settlement?.totalPos || 0,
    },
    {
      Logo: FaPhone,
      title: "PROMISE TO PAY",
      value: promisecallback.totalpromisetopay,
      color: "bg-purple-500",
    
    },
    {
      Logo: FaRedo,
      title: "CALL BACK",
      value: promisecallback.totalcallback,
      color: "bg-indigo-500",
      
    },
  ];}, [paymentStats,todo,promisecallback]);



 

  const currentstate = localStorage.getItem('active') || 'dashboard';
  const [activeMenu, setActiveMenu] = useState(currentstate);


  useEffect(()=>{
     localStorage.setItem('active',activeMenu);
  },[activeMenu])

  return (
    <main className={`pt-20 pb-8 transition-all duration-300 ${isSidebarOpen ? "lg:pl-42" : "lg:pl-0"}`}>
    
   
<aside
  className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 transition-transform duration-300 bg-background border-r
    ${isSidebarOpen ? "w-42" : "w-0 -translate-x-full"}
    lg:translate-x-0 lg:w-42 flex flex-col`}
>
  <nav className="flex-grow overflow-y-auto p-4 space-y-2">
    {menuItems.map((item) => {
      const Icon = item.icon;
      const isActive = activeMenu === item.key;

      return (
        <Button
          key={item.key}
          className={`w-full cursor-pointer justify-start  ${isDarkMode==true ? 'text-white bg-black' : 'bg-white text-black'}`}
          onClick={() => setActiveMenu(item.key)}
        >
          <Icon
            className={`w-4 h-4 mr-2 ${isActive ? "text-black-500" : "text-muted-foreground"}`}
          />
          {item.name}
        </Button>
      );
    })}
  </nav>

  <div className="p-4 border-t">
    <Button
      variant="destructive"
      className="w-full justify-start"
      onClick={()=>handleLogout(setIsAuthenticated,navigate)}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  </div>
</aside> 


<div className="container mx-auto h-auto p-4 sm:px-6 lg:px-8 space-y-6"> 
 

<motion.div
    className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
    variants={gridContainerVariants}
    initial="hidden"
    animate="visible" 
>
    {stats.map((stat, index) => { 
        const Icon = stat.Logo || Info; 
        const displayValue = typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value ?? 'N/A';
        const displayTos = stat.tos !== undefined ? stat.tos.toLocaleString() : 'N/A';
        const displayPos = stat.pos !== undefined ? stat.pos.toLocaleString() : 'N/A';

        return (
            <motion.div
                key={index} 
                variants={gridItemVariants}
                whileHover={{ scale: 1.04, y: -3, transition: { duration: 0.15 } }} 
            >
                <Card className="h-full  overflow-hidden"> 
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm rounded-lg font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">
                            {displayValue}
                        </div>
                        {(stat.tos !== undefined || stat.pos !== undefined) && (
                            <p className={`text-sm rounded-md  ${isDarkMode==true ? 'text-white' : 'text-black'}`}>
                                {`TOS: ${displayTos} | POS: ${displayPos}`}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        );
    })}
</motion.div>


<motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible" 
>
    <Card>
        <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                        <TrendingDown className="w-5 h-5 text-destructive" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Total Assigned Amount
                        </span>
                    </div>
                    <span className="text-base font-semibold"> 
                        {typeof memoizedTotalOut === 'number' ? `₹${memoizedTotalOut}` : Number(memoizedTotalOut)}
                    </span>
                </div>
               
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Total Recovered Amount
                        </span>
                    </div>
                    <span className="text-base font-semibold text-green-600">
                         {typeof paymentStats.totalRecoverAmount === 'number' ? `₹${paymentStats.totalRecoverAmount.toLocaleString('en-IN')}` : paymentStats.totalRecoverAmount}
                    </span>
                </div>
            </div>
        </CardContent>
    </Card>
</motion.div>


<motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible" 
>
    <Showdata
        activeMenu={activeMenu}
        isDarkMode={isDarkMode}
        recentActivities={recentActivities}
        filteredData={filteredData}
        phonesearch={phonesearch}
        // Pass only necessary props
         totalRecoverAmount={paymentStats.totalRecoverAmount}
        memoizedTotalOut={memoizedTotalOut}
        
    />
</motion.div>

</div>
    </main>
  );
};

export default Dashboard;







