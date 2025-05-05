


// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import { motion } from "framer-motion";
// import axios from "axios";
// import Senior_Header from "./Senior_Header";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Senior_Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [agentReport, setAgentReport] = useState([]);
//   const [paymentHistory, setPaymentHistory] = useState({});
//   const [loadingHistory, setLoadingHistory] = useState(false);
//   const [errorHistory, setErrorHistory] = useState(null);
//   const [activeSteftoNo, setActiveSteftoNo] = useState(null);
//   const [expandedCard, setExpandedCard] = useState(null);
//   const [graphData, setGraphData] = useState(null); // State to store graph data
//   const [showGraph, setShowGraph] = useState(false); // Track whether the graph is visible
//   const [dateFilter, setDateFilter] = useState("lastWeek"); // Default filter is "Last Week"
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   // Fetch Agents reported to the Senior
//   const fetchAgents = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `https://crm-backend-msk3.onrender.com/alphaselector/senior/getAgentsReportedTo/`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setAgentReport(response.data);
//     } catch (error) {
//       setError("Error fetching agents");
//       toast.error("Error fetching agents");
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     if (token) {
//       fetchAgents();
//     }
//   }, [token, fetchAgents]);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     toast.success("Logged out successfully!");
//     navigate("/login");
//   };

//   const handleGetPaymentHistory = async (steftoNo) => {
//     setActiveSteftoNo(steftoNo);
//     setLoadingHistory(true);
//     setErrorHistory(null);
//     setExpandedCard(steftoNo);

//     if (!steftoNo) {
//       toast.error("Agent's SteftoNo is missing.");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `https://crm-backend-msk3.onrender.com/alphaselector/api/payment/${steftoNo}/GetPayment_History`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setPaymentHistory((prev) => ({
//         ...prev,
//         [steftoNo]: response.data.data,
//       }));
//     } catch (error) {
//       setErrorHistory(`Failed to load history for ${steftoNo}`);
//       toast.error("Error fetching payment history");
//     } finally {
//       setLoadingHistory(false);
//     }
//   };

//   const handleShowGraph = () => {
//     const currentAgentData = paymentHistory[activeSteftoNo];
//     if (!currentAgentData || currentAgentData.length === 0) {
//       toast.error("No payment history data available for this agent.");
//       return; // Don't show the graph if there's no data
//     }

//     // Toggle between showing the table and the graph
//     setShowGraph(!showGraph);

//     if (!showGraph && currentAgentData) {
//       const filteredData = filterPaymentHistory(currentAgentData);

//       // Prepare data for the graph
//       const labels = filteredData.map((item) =>
//         new Date(item.date).toLocaleDateString()
//       );
//       const amounts = filteredData.map((item) => item.amount);

//       setGraphData({
//         labels,
//         datasets: [
//           {
//             label: "Payment Amount",
//             data: amounts,
//             fill: false, // No fill under the line
//             borderColor: "rgba(75,192,192,1)",
//             tension: 0.4, // Smooth curve
//             borderWidth: 2,
//           },
//         ],
//       });
//     }
//   };

//   const filterPaymentHistory = (data) => {
//     // Filter by date based on the selected filter
//     const currentDate = new Date();
//     return data.filter((item) => {
//       const date = new Date(item.date);
//       if (dateFilter === "lastWeek") {
//         const lastWeek = new Date();
//         lastWeek.setDate(currentDate.getDate() - 7);
//         return date >= lastWeek;
//       } else if (dateFilter === "current") {
//         return date <= currentDate; // Show all data until current time
//       }
//       return true;
//     });
//   };

//   const handleFilterChange = (filter) => {
//     setDateFilter(filter);
//     if (paymentHistory[activeSteftoNo]) {
//       const filteredData = filterPaymentHistory(paymentHistory[activeSteftoNo]);

//       // Prepare data for the graph
//       const labels = filteredData.map((item) =>
//         new Date(item.date).toLocaleDateString()
//       );
//       const amounts = filteredData.map((item) => item.amount);

//       setGraphData({
//         labels,
//         datasets: [
//           {
//             label: "Payment Amount",
//             data: amounts,
//             fill: false, // No fill under the line
//             borderColor: "rgba(75,192,192,1)",
//             tension: 0.4, // Smooth curve
//             borderWidth: 2,
//           },
//         ],
//       });
//     }
//   };

//   return (
//     <div
//       className="h-auto py-2"
//       style={{
//         background: `linear-gradient(135deg, #fca5a5 0%, #fde68a 30%, #d97706 70%, #d97706 100%)`,
//       }}
//     >
//       <Senior_Header />

//       <div className="flex-1 flex flex-col items-center justify-center px-4">
//         <motion.div
//           className="w-full"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1 }}
//         >
//           <h2 className="text-3xl font-semibold mb-4 text-gray-800">
//             Welcome, {user?.full_name || "Senior User"}
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Stats Cards */}
//             <motion.div
//               className="p-6 bg-blue-100 rounded-lg shadow-xl hover:scale-105 transition-all duration-300"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h4 className="text-xl font-semibold">Total Projects</h4>
//               <p className="text-4xl font-bold">35</p>
//             </motion.div>
//             <motion.div
//               className="p-6 bg-green-100 rounded-lg shadow-xl hover:scale-105 transition-all duration-300"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h4 className="text-xl font-semibold">Tasks Completed</h4>
//               <p className="text-4xl font-bold">128</p>
//             </motion.div>
//             <motion.div
//               className="p-6 bg-yellow-100 rounded-lg shadow-xl hover:scale-105 transition-all duration-300"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h4 className="text-xl font-semibold">Pending Tasks</h4>
//               <p className="text-4xl font-bold">5</p>
//             </motion.div>
//           </div>

//           <div className="mt-8">
//             <h3 className="text-xl font-semibold mb-4">
//               Agents Reported to You
//             </h3>
//             {loading && <p>Loading agents...</p>}
//             {error && <p className="text-red-500">{error}</p>}

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {agentReport.length > 0 ? (
//                 agentReport.map((agent, index) => {
//                   const steftoNo = agent.stefToNo || agent.employee_code;

//                   return (
//                     <motion.div
//                       key={index}
//                       className={`${
//                         expandedCard === steftoNo
//                           ? "col-span-full p-6 bg-teal-100 rounded-lg shadow-xl"
//                           : "p-6 bg-teal-100 rounded-lg shadow-xl"
//                       } hover:scale-105 transition-all duration-300`}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.6 }}
//                     >
//                       <h4 className="text-xl font-semibold">
//                         {agent.username}
//                       </h4>
//                       <h4 className="text-xl font-semibold">
//                         {agent.employee_code}
//                       </h4>
//                       <p className="text-gray-700">
//                         Registered On:{" "}
//                         {new Date(agent.registration_date).toLocaleDateString()}
//                       </p>
//                       <p className="text-gray-700">
//                         Active: {agent.is_active ? "Yes" : "No"}
//                       </p>

//                       <button
//                         onClick={() => handleGetPaymentHistory(steftoNo)}
//                         className="bg-black px-2 py-1 text-white rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-800"
//                       >
//                         Get Payment History
//                       </button>

//                       {/* Only render Payment History Section if data exists */}
//                       {expandedCard === steftoNo &&
//                         paymentHistory[steftoNo]?.length > 0 && (
//                           <div className="mt-4">
//                             <div className="bg-white rounded-lg shadow-md p-6">
//                               {!showGraph ? (
//                                 <>
//                                   <h4 className="text-lg font-semibold">
//                                     Payment History
//                                   </h4>
//                                   <table className="table-auto w-full mt-4">
//                                     <thead>
//                                       <tr>
//                                         <th className="px-4 py-2">S.No</th>
//                                         <th className="px-4 py-2">Date</th>
//                                         <th className="px-4 py-2">Amount</th>
//                                         <th className="px-4 py-2">Status</th>
//                                       </tr>
//                                     </thead>
//                                     <tbody>
//                                       {paymentHistory[steftoNo]?.map(
//                                         (item, index) => (
//                                           <tr key={index}>
//                                             <td className="px-4 py-2">
//                                               {index + 1}
//                                             </td>
//                                             <td className="px-4 py-2">
//                                               {item.date}
//                                             </td>
//                                             <td className="px-4 py-2">
//                                               {item.amount}
//                                             </td>
//                                             <td className="px-4 py-2">
//                                               {item.status}
//                                             </td>
//                                           </tr>
//                                         )
//                                       )}
//                                     </tbody>
//                                   </table>
//                                   <button
//                                     onClick={handleShowGraph}
//                                     className="mt-4 bg-blue-500 text-white px-4 py-2"
//                                   >
//                                     Show Graph
//                                   </button>
//                                 </>
//                               ) : (
//                                 <>
//                                   <div className="mb-4 flex justify-center space-x-6">
//                                     <button
//                                       onClick={() =>
//                                         handleFilterChange("lastWeek")
//                                       }
//                                       className="bg-blue-500 text-white px-4 py-2 rounded"
//                                     >
//                                       Last Week
//                                     </button>
//                                     <button
//                                       onClick={() =>
//                                         handleFilterChange("current")
//                                       }
//                                       className="bg-green-500 text-white px-4 py-2 rounded"
//                                     >
//                                       Current
//                                     </button>
//                                   </div>
//                                   {graphData ? (
//                                     <Line
//                                       data={graphData}
//                                       options={{ responsive: true }}
//                                     />
//                                   ) : (
//                                     <p>
//                                       No valid data available to show graph.
//                                     </p>
//                                   )}
//                                   <button
//                                     onClick={handleShowGraph}
//                                     className="mt-4 bg-blue-500 text-white px-4 py-2"
//                                   >
//                                     Show Table
//                                   </button>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                         )}

//                       {/* If no data for payment history, show message */}
//                       {expandedCard === steftoNo &&
//                         paymentHistory[steftoNo]?.length === 0 && (
//                           <p className="text-center py-4">
//                             No payment history available for this agent.
//                           </p>
//                         )}
//                     </motion.div>
//                   );
//                 })
//               ) : (
//                 <p className="text-gray-600">No agents reported to you.</p>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       <ToastContainer />
//     </div>
//   );
// };

// export default Senior_Dashboard;



