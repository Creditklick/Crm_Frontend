

// import React, { useEffect, useState, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/Components/ui/table";
// import { Button } from "@/Components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
// import { PhoneOutgoing } from "lucide-react";
// import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
// import { ClickAwayListener } from "@mui/material";
// import { MdOutlineSortByAlpha } from "react-icons/md";
// import { FaSortNumericUp } from "react-icons/fa";
// import { FaSortAmountDownAlt } from "react-icons/fa";

// function TasksPage({ filteredData, isDarkMode, phonesearch }) {
//   const navigate = useNavigate();
//   const [showPhoneList, setShowPhoneList] = useState(false);
//   const [openSort, setOpenSort] = useState(false);
//   const [opencall, setOpenCall] = useState(false);
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "asc",
//   });

// //   const location = useLocation();
// //   const params = new URLSearchParams(location.search);
// //   const searchinput = params.get('search');
//    const [searchinput , setSearchInput] = useState('');

//    useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const liveSearch = params.get('search') || '';
//     setSearchInput(liveSearch);
//   }, [location.search]);


//   useEffect(() => {
//     console.log("Filter data taskpage received:", filteredData);
//   }, [filteredData]);

//   useEffect(() => {
//     console.log("Phone search prop in taskpage:", phonesearch);
//   }, [phonesearch]);

//   const tableHeader = useMemo(
//     () => [
//       { id: "1", name: "Loan Account Number", key: "Account_Number" },
//       { id: "2", name: "Full Name", key: "Name" },
//       { id: "3", name: "CustId", key: "CUSTID" },
//       { id: "5", name: "Portfolio", key: "paymentStatus" },
//       { id: "6", name: "Total OutStanding", key: "Total_outs" },
//       { id: "7", name: "Disposition", key: "Status" },
//       { id: "8", name: "Actions" },
//     ],
//     []
//   );

//   const handleCheck = (stefto_id) => {
//     stefto_id && navigate(`/persona/${stefto_id}`);
//   };


//   const handleCall = async (phoneNumber) => {
//   try {
//     if (!phoneNumber) {
//       console.error("No phone number available");
//       return;
//     }

//     // Replace these parameters with your actual values
//     const apiUrl = new URL("https://app.flexydial.com/api/clicktocall_webrtc/");
//     const params = {
//       tenantName: "buzzworks",
//       tenantId: "31456",
//       actionName: "flexy",
//       entityType: "customer",
//       entityId: "7787",
//       phoneNumber: phoneNumber
//     };

//     Object.entries(params).forEach(([key, value]) => {
//       apiUrl.searchParams.append(key, value);
//     });

//     const response = await fetch(apiUrl, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         // Add authentication headers if required
//         // "Authorization": "Basic " + btoa(username + ":" + password)
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Call initiated successfully:", data);
//     // Add user feedback here (e.g., toast notification)
//   } catch (error) {
//     console.error("Error initiating call:", error);
//     // Add error handling UI feedback here
//   }
// };

//   // const handleCall = (phoneNumber) => {
//   //   setOpenCall(true);
//   //   phoneNumber && console.log(`Initiating call to: ${phoneNumber}`);
//   // };

//   const formatCurrency = (value) => {
//     const number = parseFloat(value);
//     return isNaN(number) ? value : number.toLocaleString("en-IN", {
//       style: "currency",
//       currency: "INR",
//     });
//   };

//   const highlightText = (text, search) => {
//     if (!search || !text) return text;
//     const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//     const regex = new RegExp(`(${escapedSearch})`, 'gi');
//     const parts = String(text).split(regex);
    
//     return parts.map((part, index) =>
//       regex.test(part) ? (
//         <span key={index} className="bg-yellow-200">
//           {part}
//         </span>
//       ) : (
//         part
//       )
//     );
//   };

//   const sortedData = useMemo(() => {
//     let data = filteredData || [];
    
//     // Apply search filter
//     if (searchinput) {
//       const searchLower = searchinput.toLowerCase();
//       data = data.filter(item => {
//         const name = item.Name?.toLowerCase() || '';
//         const custId = item.CUSTID?.toLowerCase() || '';
//         return name.includes(searchLower) || custId.includes(searchLower);
//       });
//     }

//     // Apply sorting
//     if (sortConfig.key) {
//       const sorted = [...data];
//       sorted.sort((a, b) => {
//         const aValue = a[sortConfig.key] ?? "";
//         const bValue = b[sortConfig.key] ?? "";

//         if (sortConfig.key === "Total_outs" || sortConfig.key === "CUSTID") {
//           const aNum = parseFloat(aValue) || 0;
//           const bNum = parseFloat(bValue) || 0;
//           return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
//         }

//         if (sortConfig.key === "Name") {
//             const aStr = String(aValue).trim();
//             const bStr = String(bValue).trim();
//             return sortConfig.direction === "asc"
//               ? aStr.localeCompare(bStr, undefined, { sensitivity: "base" })
//               : bStr.localeCompare(aStr, undefined, { sensitivity: "base" });
//           }

//         return sortConfig.direction === "asc"
//           ? aValue > bValue ? 1 : -1
//           : aValue < bValue ? 1 : -1;
//       });
//       return sorted;
//     }
    
//     return data;
//   }, [filteredData, sortConfig, searchinput]);





//   const SortBy = [
//     {
//       name: "Name",
//       key: "Name",
//       icons: <MdOutlineSortByAlpha />,
//       color: "text-blue-500",
//       onClick: () => handleSort("Name"),
//     },
//     {
//       name: "CustId",
//       key: "CUSTID",
//       icons: <FaSortNumericUp />,
//       color: "text-green-500",
//       onClick: () => handleSort("CUSTID"),
//     },
//     {
//       name: "Amount",
//       key: "Total_outs",
//       icons: <FaSortAmountDownAlt />,
//       color: "text-yellow-500",
//       onClick: () => handleSort("Total_outs"),
//     },
//   ];

//   const handleSort = (key) => {
//     setSortConfig(prev => ({
//       key,
//       direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
//     }));
//     setOpenSort(false);
//   };

//   return (
//     <>
//       <div className={`w-full px-4 py-2 flex justify-between items-center bg-muted/50 border-b mb-4`}>
//         <span className="font-semibold text-foreground">Assigned Data</span>
//         <ClickAwayListener onClickAway={() => setOpenSort(false)}>
//           <div className="relative flex items-center border-2 px-2 py-1 cursor-pointer rounded-md">
//             <span className="font-medium">Sort By: </span>
//             <h1>
//               {sortConfig.key ? (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
//             </h1>
//             <div onClick={() => setOpenSort(!openSort)} className="ml-2">
//               {sortConfig.key ? SortBy.find(item => item.key === sortConfig.key)?.name || "Sort" : "Sort"}
//             </div>
//             {openSort && (
//               <div className="absolute bg-white top-10 z-10 right-0 w-full border rounded-md shadow-lg">
//                 {SortBy.map((item, index) => (
//                   <div
//                     key={index}
//                     className={`flex items-center space-x-3 px-3 py-2 hover:bg-slate-200 cursor-pointer text-sm`}
//                     onClick={item.onClick}
//                   >
//                     <span className={`${item.color}`}>{item.icons}</span>
//                     <span>{item.name}</span>
//                     {sortConfig.key === item.key && (
//                       <span className="ml-auto">
//                         {sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />}
//                       </span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </ClickAwayListener>
//       </div>

//       <div className="relative px-4">
//         <Card className="overflow-hidden">
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   {tableHeader.map(headerItem => (
//                     <TableHead key={headerItem.id} className="relative">
//                       <div className="flex items-center space-x-1">
//                         {headerItem.name}
//                         {headerItem.key && SortBy.some(sort => sort.key === headerItem.key) && (
//                           <button
//                             onClick={() => handleSort(headerItem.key)}
//                             className="focus:outline-none"
//                           >
//                             {sortConfig.key === headerItem.key ? (
//                               sortConfig.direction === "asc" ? (
//                                 <FaSortUp className="text-blue-500" />
//                               ) : (
//                                 <FaSortDown className="text-blue-500" />
//                               )
//                             ) : (
//                               <FaSort className="text-gray-400" />
//                             )}
//                           </button>
//                         )}
//                       </div>
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {!sortedData || sortedData.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={tableHeader.length}
//                       className="h-24 text-center text-muted-foreground"
//                     >
//                       No records found.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   sortedData.map(item => (
//                     <TableRow key={item.SteftoNo || item.id}>
//                       <TableCell>{item[tableHeader[0].key] ?? "N/A"}</TableCell>
//                       <TableCell>
//                         {highlightText(item[tableHeader[1].key] ?? "N/A", searchinput)}
//                       </TableCell>
//                       <TableCell>
//                         {highlightText(item[tableHeader[2].key] ?? "N/A", searchinput)}
//                       </TableCell>
//                       <TableCell>{item[tableHeader[3].key] ?? "N/A"}</TableCell>
//                       <TableCell className="text-right">
//                         {formatCurrency(item[tableHeader[4].key])}
//                       </TableCell>
//                       <TableCell>{item[tableHeader[5].key] ?? "N/A"}</TableCell>
//                       <TableCell>
//                         <div className="flex items-center space-x-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleCall(item?.Phone)}
//                             className={'cursor-pointer'}
//                             disabled={!item?.Phone}
//                             title={item?.Phone ? `Call ${item.Phone}` : "No phone number available"}
//                           >
//                             <PhoneOutgoing className="w-4 h-4 mr-1" /> Call
//                           </Button>
//                           <Button
//                             variant="secondary"
//                             size="sm"
//                             className="cursor-pointer"
//                             onClick={() => handleCheck(item?.SteftoNo)}
//                             disabled={!item?.SteftoNo}
//                             title={item?.SteftoNo ? "View Details" : "Details ID missing"}
//                           >
//                             Details
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </>
//   );
// }

// export default TasksPage;










import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { PhoneOutgoing } from "lucide-react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { ClickAwayListener } from "@mui/material";
import { MdOutlineSortByAlpha } from "react-icons/md";
import { FaSortNumericUp, FaSortAmountDownAlt } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/Components/ui/dialog";
// No need for Input and Label from Shadcn UI in the dialog if no credentials are taken
// import { Input } from "@/Components/ui/input";
// import { Label } from "@/Components/ui/label";
import { toast } from 'sonner'; // For toast notifications

// Your actual API endpoint base - use this one!
const CLICK_TO_CALL_API_BASE = "https://app.flexydial.com/api/clicktocall_webrtc/";

function TasksPage({ filteredData, isDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSort, setOpenSort] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [phoneNumberToCall, setPhoneNumberToCall] = useState("");
  const [isCalling, setIsCalling] = useState(false); 
  const [callStatus, setCallStatus] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const [searchinput, setSearchInput] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const liveSearch = params.get('search') || '';
    setSearchInput(liveSearch);
  }, [location.search]);

  const tableHeader = useMemo(
    () => [
      { id: "1", name: "Loan Account Number", key: "Account_Number" },
      { id: "2", name: "Full Name", key: "Name" },
      { id: "3", name: "CustId", key: "CUSTID" },
      { id: "5", name: "Portfolio", key: "paymentStatus" },
      { id: "6", name: "Total OutStanding", key: "Total_outs" },
      { id: "7", name: "Disposition", key: "Status" },
      { id: "8", name: "Actions" },
    ],
    []
  );

  const handleCheck = (stefto_id) => {
    stefto_id && navigate(`/persona/${stefto_id}`);
  };

  const handleCallClick = (phoneNumber) => {
    setPhoneNumberToCall(phoneNumber);
    setShowCallDialog(true); // Open the call dialog
    setCallStatus(null); // Reset call status
  };

  const initiateCall = async () => {
    if (!phoneNumberToCall) {
      toast.error("No phone number to call.");
      return;
    }

    setIsCalling(true);
    setCallStatus(null); // Clear previous status
     

     const url = new URL(CLICK_TO_CALL_API_BASE);

      // Append your fixed tenant-specific parameters and the dynamic phone number
      url.searchParams.append("tenantName", "buzzworks");
      url.searchParams.append("tenantId", "31456");
      url.searchParams.append("actionName", "flexy");
      url.searchParams.append("entityType", "customer");
      url.searchParams.append("entityId", "7787"); // Assuming this is a fixed entity ID for your calls
      url.searchParams.append("phoneNumber", phoneNumberToCall);
     
       window.open(`${url}`);


    // try {
    //   const url = new URL(CLICK_TO_CALL_API_BASE);

    //   // Append your fixed tenant-specific parameters and the dynamic phone number
    //   url.searchParams.append("tenantName", "buzzworks");
    //   url.searchParams.append("tenantId", "31456");
    //   url.searchParams.append("actionName", "flexy");
    //   url.searchParams.append("entityType", "customer");
    //   url.searchParams.append("entityId", "7787"); // Assuming this is a fixed entity ID for your calls
    //   url.searchParams.append("phoneNumber", phoneNumberToCall);

      


    //   // const response = await fetch(url.toString(), {
    //   //   method: "GET", // As indicated by your API's URL structure
    //   //   // If your API requires any headers (e.g., API key, authorization token), add them here:
    //   //   // headers: {
    //   //   //   'X-API-Key': 'YOUR_API_KEY_HERE',
    //   //   //   'Authorization': 'Bearer YOUR_AUTH_TOKEN_HERE',
    //   //   //   'Content-Type': 'application/json' // Even for GET, sometimes relevant
    //   //   // }
    //   // });

    //   if (response.ok) { // Check if status is 200-299
    //     // The API might not return JSON, it might just return a success status or a simple string.
    //     // Try to parse JSON first, but be ready for it to fail if it's not JSON.
    //     let data;
    //     try {
    //       data = await response.json();
    //       console.log("Call API response (JSON):", data);
    //     } catch (jsonError) {
    //       data = await response.text(); // Get response as text if not JSON
    //       console.log("Call API response (Text):", data);
    //     }

    //     toast.success(`Call initiated successfully to ${phoneNumberToCall}!`);
    //     setCallStatus("success");
    //   } else {
    //     let errorData;
    //     try {
    //       errorData = await response.json();
    //     } catch (jsonError) {
    //       errorData = await response.text();
    //     }
    //     const errorMessage = typeof errorData === 'string' ? errorData : errorData.message || response.statusText || "Unknown error";
    //     console.error("Failed to initiate call:", errorData);
    //     toast.error(`Failed to initiate call: ${errorMessage}`);
    //     setCallStatus("error");


    //   }
    // } 
    // catch (error) {
    //   console.error("Error initiating call:", error);
    //   toast.error("An error occurred while trying to initiate the call. Check console for details.");
    //   setCallStatus("error");
    // } finally {
    //   setIsCalling(false);
    //   // Optionally close the dialog after a short delay if call was successful
    //   if (callStatus === "success") { // Use a state update callback if you need to be sure.
    //     setTimeout(() => setShowCallDialog(false), 1500);
    //   }
    // }




  };

  const formatCurrency = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? value : number.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const highlightText = (text, search) => {
    if (!search || !text) return text;
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    const parts = String(text).split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const sortedData = useMemo(() => {
    let data = filteredData || [];

    // Apply search filter
    if (searchinput) {
      const searchLower = searchinput.toLowerCase();
      data = data.filter(item => {
        const name = item.Name?.toLowerCase() || '';
        const custId = item.CUSTID?.toLowerCase() || '';
        return name.includes(searchLower) || custId.includes(searchLower);
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      const sorted = [...data];
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";

        if (sortConfig.key === "Total_outs" || sortConfig.key === "CUSTID") {
          const aNum = parseFloat(aValue) || 0;
          const bNum = parseFloat(bValue) || 0;
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        if (sortConfig.key === "Name") {
          const aStr = String(aValue).trim();
          const bStr = String(bValue).trim();
          return sortConfig.direction === "asc"
            ? aStr.localeCompare(bStr, undefined, { sensitivity: "base" })
            : bStr.localeCompare(aStr, undefined, { sensitivity: "base" });
        }

        return sortConfig.direction === "asc"
          ? (aValue > bValue ? 1 : -1)
          : (aValue < bValue ? 1 : -1);
      });
      return sorted;
    }

    return data;
  }, [filteredData, sortConfig, searchinput]);

  const SortBy = useMemo(() => [
    {
      name: "Name",
      key: "Name",
      icons: <MdOutlineSortByAlpha />,
      color: "text-blue-500",
      onClick: () => handleSort("Name"),
    },
    {
      name: "CustId",
      key: "CUSTID",
      icons: <FaSortNumericUp />,
      color: "text-green-500",
      onClick: () => handleSort("CUSTID"),
    },
    {
      name: "Amount",
      key: "Total_outs",
      icons: <FaSortAmountDownAlt />,
      color: "text-yellow-500",
      onClick: () => handleSort("Total_outs"),
    },
  ], []);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
    setOpenSort(false);
  };

  return (
    <>
      <div className={`w-full px-4 py-2 flex justify-between items-center bg-muted/50 border-b mb-4`}>
        <span className="font-semibold text-foreground">Assigned Data</span>
        <ClickAwayListener onClickAway={() => setOpenSort(false)}>
          <div className="relative flex items-center border-2 px-2 py-1 cursor-pointer rounded-md">
            <span className="font-medium">Sort By: </span>
            <h1>
              {sortConfig.key ? (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
            </h1>
            <div onClick={() => setOpenSort(!openSort)} className="ml-2">
              {sortConfig.key ? SortBy.find(item => item.key === sortConfig.key)?.name || "Sort" : "Sort"}
            </div>
            {openSort && (
              <div className="absolute bg-white top-10 z-10 right-0 w-full border rounded-md shadow-lg">
                {SortBy.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 px-3 py-2 hover:bg-slate-200 cursor-pointer text-sm`}
                    onClick={item.onClick}
                  >
                    <span className={`${item.color}`}>{item.icons}</span>
                    <span>{item.name}</span>
                    {sortConfig.key === item.key && (
                      <span className="ml-auto">
                        {sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ClickAwayListener>
      </div>

      <div className="relative px-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeader.map(headerItem => (
                    <TableHead key={headerItem.id} className="relative">
                      <div className="flex items-center space-x-1">
                        {headerItem.name}
                        {headerItem.key && SortBy.some(sort => sort.key === headerItem.key) && (
                          <button
                            onClick={() => handleSort(headerItem.key)}
                            className="focus:outline-none"
                          >
                            {sortConfig.key === headerItem.key ? (
                              sortConfig.direction === "asc" ? (
                                <FaSortUp className="text-blue-500" />
                              ) : (
                                <FaSortDown className="text-blue-500" />
                              )
                            ) : (
                              <FaSort className="text-gray-400" />
                            )}
                          </button>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!sortedData || sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeader.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map(item => (
                    <TableRow key={item.SteftoNo || item.id}>
                      <TableCell>{item[tableHeader[0].key] ?? "N/A"}</TableCell>
                      <TableCell>
                        {highlightText(item[tableHeader[1].key] ?? "N/A", searchinput)}
                      </TableCell>
                      <TableCell>
                        {highlightText(item[tableHeader[2].key] ?? "N/A", searchinput)}
                      </TableCell>
                      <TableCell>{item[tableHeader[3].key] ?? "N/A"}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item[tableHeader[4].key])}
                      </TableCell>
                      <TableCell>{item[tableHeader[5].key] ?? "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCallClick(item?.Phone)}
                            className={'cursor-pointer bg-green-400 hover:bg-green-500'}
                            disabled={!item?.Phone}
                            title={item?.Phone ? `Call ${item.Phone}` : "No phone number available"}
                          >
                            <PhoneOutgoing className="w-4 h-4 mr-1 bg-amber-500" /> Call
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="cursor-pointer bg-gray-400 hover:bg-gray-500"
                            onClick={() => handleCheck(item?.SteftoNo)}
                            disabled={!item?.SteftoNo}
                            title={item?.SteftoNo ? "View Details" : "Details ID missing"}
                          >
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Call Confirmation Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Call</DialogTitle>
            <DialogDescription>
              Are you sure you want to initiate a call to **{phoneNumberToCall || 'N/A'}**?
              <br />
              {/* <span className="text-blue-600">
                (This will directly call via FlexyDial's API. No credentials needed here.)
              </span> */}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {callStatus === "success" && (
              <p className="text-green-500 text-sm text-center">Call initiated successfully!</p>
            )}
            {callStatus === "error" && (
              <p className="text-red-500 text-sm text-center">Failed to initiate call. Please check console for details.</p>
            )}
            {isCalling && (
              <p className="text-blue-500 text-sm text-center">Initiating call...</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCallDialog(false);
                setCallStatus(null); // Clear status on cancel
                setIsCalling(false);
              }}
            
            >
              Cancel
            </Button>
            <Button
              onClick={initiateCall}
             
            >
              {isCalling ? "Calling..." : "Call Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TasksPage;