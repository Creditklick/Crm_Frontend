import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { FaUserTie } from "react-icons/fa";
import { useEffect , useState , useCallback } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { AlternateEmail } from "@mui/icons-material";
import { motion } from "framer-motion";
import { DollarSign, CalendarDays, BadgeCheck } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls , Html  } from '@react-three/drei'



import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Brush,
  Label
} from 'recharts';
const GraphComponent = ({ data }) => {
   console.log("data of agent",data);
  const getBarColor = (status) => {
    switch(status) {
      case 'Partially': return '#f59e0b'; // Amber
      case 'Settlement Amount': return '#10b981'; // Emerald
      default: return '#3b82f6'; // Blue
    }
  };

  return data.map((item, index) => {
    const height = Number(item.amount) * 0.1;
    const xPos = index * 2.5 - (data.length * 2.5) / 2;
    
    return (
      <group key={index}>
        <mesh
          position={[xPos, height / 2, 0]}
          scale={[1, height, 1]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color={getBarColor(item.status)}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
        
        <Html
          position={[xPos, -1, 0]}
          distanceFactor={8}
          center
        >
          <div className="bg-white px-2 py-1 rounded-md shadow-sm text-xs text-center">
            <p className="font-semibold">₹{item.amount}</p>
            <p className="text-gray-500">
              {new Date(item.date).toLocaleDateString('en-IN')}
            </p>
            <p className="text-xs mt-1">{item.status}</p>
          </div>
        </Html>
      </group>
    );
  })
};


function SeniorDashboard() {
   

  const [eachagentdetail,setAgentdetail] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [errorsecond,setErrorsecond] = useState('');
  const [opensection,setOpenSection] = useState(false);
  const [agentpaymenthistory , getAgentPaymentHistory] = useState([]);
  const [opengraph,setOpenGraph] = useState(false);
  const [loadinggraph,setLoadingGraph] = useState(false);
  const [grapherror,setGraphError] = useState('');
 
    const fetchAgentDetail = async()=>{
      setLoading(true);
      const token = localStorage.getItem("token");
      try{
                const response = await axios.get('https://crm-backend-msk3.onrender.com/alphaselector/senior/getAgentsReportedTo/',{
                    headers : {
                         'Content-Type' : 'application/json',
                         'Authorization' : `Bearer ${token}`
                    }
                });
                setAgentdetail(response.data);
                console.log(response.data);
                
      }
      catch(err){
          setError("Api not call please re-login else call developer")
      }finally{
        setLoading(false);
      }

    }
    useEffect(()=>{
      fetchAgentDetail();
    },[])

    useEffect(()=>{
      console.log("Agent value is ",agentpaymenthistory);
    },[]);



    const handleUserDetails = async (employee_id)=>{
      setOpenSection(true);
      setLoading(true);
       const token = localStorage.getItem('token');
      try{
        const response = await axios.get('https://crm-backend-msk3.onrender.com/alphaselector/senior/api/v1/notification/', {
          params: {
            employee_code: employee_id
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
            console.log("each agent segment ",response.data);
            
            console.log("Employee Id i get in section ",employee_id);
            getAgentPaymentHistory(response.data);
          
            

      }
      catch(error){
        setErrorsecond(error.message);
          console.log("Error in geteachagentpayment_histroy",error.message);
      }
      finally{
         setLoading(false);
      }

    }


    const handleClose = async()=>{
       setOpenSection(false);
       getAgentPaymentHistory([]);
    }



    const handleGraph = async (employee_id)=>{
          console.log("this is for graph id ",employee_id);
          setLoadingGraph(true);
          setOpenGraph(true);
          
           


          const token = localStorage.getItem('token');
          try{
            const response = await axios.get('https://crm-backend-msk3.onrender.com/alphaselector/senior/api/v1/notification/', {
              params: {
                employee_code: employee_id
              },
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            
                console.log("each agent segment ",response.data);
                
                console.log("Employee Id i get in section ",employee_id);
                getAgentPaymentHistory(response.data);
              
                
    
          }
          catch(error){
              setGraphError(error.message);
              console.log("Error in geteachagentpayment_histroy",error.message);
          }
          finally{
            setLoadingGraph(false);
          }





    }

   

     
    const handleGraphClose = ()=>{
         setOpenGraph(false);
         getAgentPaymentHistory([]);
    }

 

  return (
     <div 
     style={{
      background: `linear-gradient(135deg, #fca5a5 0%, #fde68a 30%, #d97706 70%, #d97706 40%)`,      }}
      className="mt-20  p-4"
     >
      
         <h1 className="text-2xl py-2 px-2">List of Users</h1>
    
    <div
    
   
    className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
 
    ">
      

{    loading===true ? "Please Wait...." :
     eachagentdetail.length===0 ? "No Data Found" : 
     eachagentdetail.map((item, index) => (
        <Card
          key={index}
          className="w-full bg-muted-black transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1"
        >
          <CardHeader>
            <CardDescription className="text-black">
              Analytics and insights for your current user
            </CardDescription>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <FaUserTie />
                <CardTitle>{item?.username}</CardTitle>
              </div>
              <div>
                <span className="font-bold">Id : </span>
                <span>{item?.employee_code}</span>
              </div>
            </div>

            <div className="flex relative group justify-between py-5">
              <div>
                <Button onClick={()=>handleUserDetails(item?.employee_code)} className="cursor-pointer bg-black">User History</Button>
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                  bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300 z-50 whitespace-nowrap">
                  {`Detail for Current User ${item?.employee_code}`} 
                </span>
              </div>
              <div className="flex">
                <span className="font-medium">Is Active : </span>
                <span>{item?.is_active==='1' ? "Yes" : "No"}</span>
              </div>
            </div>
            <div>
            <div> <span className="font-medium">Register Date :</span>
            <span>{new Date(item?.registration_date).toISOString().split('T')[0]}</span>

</div>
              </div>
          </CardHeader>

        

          <CardFooter className="">
          <div className="flex justify-between items-center gap-4">
  <div>
    <span className="font-medium">Last Login:</span>{' '}
    <span>{item?.last_login || 'N/A'}</span>
  </div>
  <div>
    <Button
      onClick={() => handleGraph(item?.employee_code)}
      className="cursor-pointer"
    >
      Graph
    </Button>
  </div>
</div>

          </CardFooter>
        </Card>
     )) 
   
}



    </div>

         
    {opensection && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={() => setOpenSection(false)}
  >
    <motion.div
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-orange-200 rounded-xl shadow-xl max-w-lg w-full p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-1 cursor-pointer text-gray-500 hover:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Modal Content */}
      

<div className="space-y-6 p-4 h-96 overflow-auto">
  <h3 className="text-3xl font-semibold text-indigo-700 tracking-wide ">
    💳 Payment History
  </h3>
  
  {loading ? (
  <div className="text-indigo-500 font-semibold text-sm">Please wait...</div>
) : agentpaymenthistory.length > 0 ? (
  agentpaymenthistory.map((item, index) => (
    <div
      key={index}
      className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-indigo-500 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <CalendarDays className="text-indigo-600 w-5 h-5" />
          <span className="text-gray-600 font-medium">
            {new Date(item.date).toDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <BadgeCheck className="text-green-500 w-5 h-5" />
          <span className="text-sm text-green-700 font-semibold">{item.status}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <DollarSign className="text-yellow-500 w-5 h-5" />
        <p className="text-xl font-bold text-gray-800">₹ {item.amount}</p>
      </div>
    </div>
  ))
) : (
  <div className="text-gray-500 text-sm">No payment history available.</div>
)}

</div>
    </motion.div>
  </motion.div>
     )}




 
{opengraph && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={() => setOpenGraph(false)}
  >
    <motion.div
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-orange-200 rounded-xl shadow-xl w-full max-w-6xl p-6 relative"
      onClick={(e) => e.stopPropagation()}
      style={{ height: '36rem' }}
    >
      <button
        onClick={handleGraphClose}
        className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700 z-10"
      >
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="h-full w-full flex flex-col">
        <h3 className="text-3xl font-semibold text-indigo-700 tracking-wide mb-6">
          📊 Payment Analytics
        </h3>

        {
              loading===true ? (
                   <div>
                     please wait ...
                  </div>
              ) :  agentpaymenthistory.length>0 ? (
                
                     <div className="flex-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={agentpaymenthistory}
              margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
              barSize={40}
            >
              <defs>
                <linearGradient id="colorPartially" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorSettlement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#fff"
                vertical={false}
              />
              
              <XAxis
                dataKey="date"
                tick={{ fill: '#4f46e5', fontSize: 12 }}
                tickFormatter={(str) => new Date(str).toLocaleDateString('en-IN')}
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              
              <YAxis
                domain={[0, 100000]} // 0 से 1 लाख तक
                tick={{ fill: '#4f46e5' }}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                ticks={Array.from({length: 21}, (_, i) => i * 5000)} // 0,5k,10k...100k
              >
                <Label 
                  value="Amount (₹)" 
                  angle={-90} 
                  position="left" 
                  offset={-30}
                  style={{ fill: '#4f46e5', fontSize: 14 }}
                />
              </YAxis>

              {agentpaymenthistory.map((entry, index) => (
                <ReferenceLine
                  key={`ref-${index}`}
                  x={entry.date}
                  stroke="#6366f1"
                  strokeWidth={0.5}
                  strokeDasharray="3 3"
                />
              ))}

              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #6366f1',
                  borderRadius: '8px',
                  backdropFilter: 'blur(4px)'
                }}
                formatter={(value) => [`₹${new Intl.NumberFormat('en-IN').format(value)}`, 'Amount']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              />
              
              <Bar
                dataKey="amount"
                animationDuration={800}
                animationEasing="ease-in-out"
              >
                {agentpaymenthistory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.status === 'Partially' ? "url(#colorPartially)" : "url(#colorSettlement)"}
                    stroke="#4f46e5"
                    strokeWidth={1}
                    radius={[8, 8, 0, 0]}
                  />
                ))}
              </Bar>

              <Brush
                dataKey="date"
                height={30}
                stroke="#6366f1"
                travellerWidth={10}
                y={380}
                tickFormatter={(str) => new Date(str).toLocaleDateString('en-IN')}
                fill="#e0e7ff"
              />

              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  bottom: -10,
                }}
                formatter={(value) => (
                  <span className="text-indigo-700 font-medium">
                    {value === 'amount' ? 'Payment Amount' : value}
                  </span>
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </div> 
                
                 
              ) : 'No Data Found'
        }
        
         




      </div>
    </motion.div>
  </motion.div>
)}



    </div>
  );
}

export default SeniorDashboard;







