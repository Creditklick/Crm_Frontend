

import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneOutgoing } from "lucide-react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { ClickAwayListener } from "@mui/material";
import { MdOutlineSortByAlpha } from "react-icons/md";
import { FaSortNumericUp } from "react-icons/fa";
import { FaSortAmountDownAlt } from "react-icons/fa";

function TasksPage({ filteredData, isDarkMode, phonesearch }) {
  const navigate = useNavigate();
  const [showPhoneList, setShowPhoneList] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [opencall, setOpenCall] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const searchinput = params.get('search');
   const [searchinput , setSearchInput] = useState('');

   useEffect(() => {
    const params = new URLSearchParams(location.search);
    const liveSearch = params.get('search') || '';
    setSearchInput(liveSearch);
  }, [location.search]);


  useEffect(() => {
    console.log("Filter data taskpage received:", filteredData);
  }, [filteredData]);

  useEffect(() => {
    console.log("Phone search prop in taskpage:", phonesearch);
  }, [phonesearch]);

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

  const handleCall = (phoneNumber) => {
    setOpenCall(true);
    phoneNumber && console.log(`Initiating call to: ${phoneNumber}`);
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
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      });
      return sorted;
    }
    
    return data;
  }, [filteredData, sortConfig, searchinput]);



 
//   const sorted = [...filteredData];
//       if (sortConfig.key) {
//         sorted.sort((a, b) => {
//           const aValue = a[sortConfig.key] ?? "";
//           const bValue = b[sortConfig.key] ?? "";
  
//           // Handle numeric sorting for Total_outs and CUSTID
//           if (sortConfig.key === "Total_outs" || sortConfig.key === "CUSTID") {
//             const aNum = parseFloat(aValue) || 0;
//             const bNum = parseFloat(bValue) || 0;
//             return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
//           }
  
//           // Handle case-insensitive alphabetical sorting for Name
//           if (sortConfig.key === "Name") {
//             const aStr = String(aValue).trim();
//             const bStr = String(bValue).trim();
//             return sortConfig.direction === "asc"
//               ? aStr.localeCompare(bStr, undefined, { sensitivity: "base" })
//               : bStr.localeCompare(aStr, undefined, { sensitivity: "base" });
//           }
  
//           // Default comparison for other fields
//           return sortConfig.direction === "asc"
//             ? aValue > bValue
//               ? 1
//               : -1
//             : aValue < bValue
//             ? 1
//             : -1;
//         });
//       }
//       return sorted;
//     }, [filteredData, sortConfig]);










  const SortBy = [
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
  ];

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
                            onClick={() => handleCall(item?.Phone)}
                            className={'cursor-pointer'}
                            disabled={!item?.Phone}
                            title={item?.Phone ? `Call ${item.Phone}` : "No phone number available"}
                          >
                            <PhoneOutgoing className="w-4 h-4 mr-1" /> Call
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="cursor-pointer"
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
    </>
  );
}

export default TasksPage;