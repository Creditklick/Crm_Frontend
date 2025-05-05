import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { FaBell } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import { ClickAwayListener } from "@mui/material";
import { Button } from "@/components/ui/button";
import Basic from "./Details_Section/Basic";
import Payment from "./Details_Section/Payment";
import Contact from "./Details_Section/Contact";
import Product from "./Details_Section/Product";
import Permanentaddress from "./Details_Section/Permanentaddress";
import Workaddress from "./Details_Section/Wordaddress";


function ShowDetails({ isactive, objectdata }) {
  console.log("show detail page data ", objectdata);
  const initialDate = new Date();

  const [remarksId, setRemarksId] = useState("");
  const { stefto_id } = useParams();
  const [personadata, setPersonaData] = useState(null);
  const [updatedNumber, setUpdatedNumber] = useState("");
  const [status, setStatus] = useState("");
  const [paidFullAmount, setPaidFullAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    initialDate.toISOString().split("T")[0]
  ); //status of date
  const [remarks, setremarks] = useState("");

  const [currenttime, setCurrentTime] = useState("");
  const [custId, setCustId] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [paymentHistory, setPaymentNotification] = useState([]);
  const token = localStorage.getItem("token");

  const Payment_history_Noti = async () => {
    try {
      const response = await axios.get(
        `http://172.16.0.20:8000/alphaselector/api/payment/${stefto_id}/GetPayment_History`
      );
      console.log("Get all payment history ", response.data.data);
      setPaymentNotification(response?.data?.data);
      const historyData = response?.data?.data;
      if (Array.isArray(historyData)) {
        setPaymentNotification(historyData);
      } else {
        console.error("Invalid data format:", historyData);
        setPaymentNotification([]); 
      }
    } catch (error) {
      console.log("Error in ", error.message);
    }
  };


  useEffect(()=>{
     console.log("user stefto ",stefto_id);
  },[])

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://172.16.0.20:8000/searchapp/persona",
        {
          params: { stefto_id: stefto_id },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setCustId(response.data.CUSTID);
      setPersonaData(response.data);
    } catch (error) {
      console.error("Error fetching persona data:", error.message);
    }
  };

  const handleRemarksJson = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://172.16.0.20:8000/searchapp/addremarks",
        {
          stefto_id: stefto_id,
          remarks: remarks,
          remarksId: remarksId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Successfully add remarks");
      await fetchData();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    Promise.all([fetchData(), Payment_history_Noti()]);
  }, [stefto_id]);

  const fieldGroups = [
    {
      heading: "Basic Information",
      fields: [
        "SteftoNo",
        "CUSTID",
        "Name",
        "Account_Number",
        "Card_Number",
        "CREDITLIMI",
        "Total_outs",
        "PRINCIPLE_OUTSTANDING",
        "MIN_AMT_DUE",
        "PRODUCT_NPA",
        "Status",
      ],
    },
    {
      heading: "Payment Information",
      fields: [
        "ISSUE_DATE",
        "LAST_BILLING_DATE",
        "INT_FEES",
        "INT_OUTSTD",
        "BUCK1",
        "BUCK2",
        "FINAL_STATE",
      ],
    },
    {
      heading: "Contact Details",
      fields: [
        "Email",
        "Phone",
        "Updated_Number",
        "Refrence_mobile_number",
        "Remark1",
        "Remark1_Changed",
        "Remark2",
        "Remark2_Changed",
        "Remark3",
        "Remark3_Changed",
        "CURRENT_CITY",
        "CURRENT_STATE",
      ],
    },
    {
      heading: "Process and Product Information",
      fields: [
        "Process_Name",
        "Product",
        "Month",
        "CYCLEDATE",
        "NPA_DPD_BRACKET",
        "VINTAGE_FLAG",
        "CREATED_ON",
        "ACCOUNT_STATUS_NXT",
        "YEAR_OF_BIRTH",
      ],
    },
    {
      heading: "Permanent Address",
      fields: [
        "PTEL1",
        "CURRENT_TEL1",
        "Address2",
        "City",
        "Address",
        "CURRENT_PIN",
        "PADD1",
        "PADD2",
        "PCITY",
        "PSTATE",
      ],
    },
    {
      heading: "Work Address and Details",
      fields: [
        "WORK_ADD1",
        "WTEL1",
        "WMOBILE",
        "WEMAIL",
        "ORGANISATION",
        "DESIGNATION",
        "WCITY",
        "WORK_ADD2",
        "WSTATE",
      ],
    },
    {
      heading: "Other Details",
      fields: [
        "NORMS",
        "DPD",
        "LAST_PAY_DATE1",
        "LAST_PAY_AMT1",
        "ALLOCATION_DPD_BRACKET",
        "TOTAL_PAYMENT",
        "Fully_Paid_Amount",
        ,
        "ZONE",
        "REGION",
      ],
    },
  ];

  const handleUpdateNumber = async () => {
    try {
      await axios.post(
        `http://172.16.0.20:8000/searchapp/persona/${stefto_id}/Update_Number/`,
        { updatedNumber }
      );

      alert("Updated number added successfully");
      setUpdatedNumber("");
      fetchData();
    } catch (error) {
      console.error("Error updating number:", error);
      alert("Failed to update number");
    }
  };


  const onUpdateStatus = async () => {
    if (!status || !selectedDate || !currenttime || !custId) {
      console.error(
        "Missing required fields: status, selectedDate, currenttime, or custId"
      );
      return;
    }
    try {
      const response = await axios.post(
        "http://172.16.0.20:8000/searchapp/notification/api/v1",
        {
          status: status,
          selectedDate: selectedDate,
          currenttime: currenttime,
          custId: custId,
          stefto_id : stefto_id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Successfully Done");

      console.log("Response from backend:", response.data);
    } catch (error) {

      if (error.response) {
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }

   
    setSelectedDate("");
    setCurrentTime("");
  };

  const handleUpisend = async () => {
    try {
      await axios.get(`http://172.16.0.20:8000/card-info/${stefto_id}/`);

      alert("Message sent successfully");
    } catch (error) {
      console.error("Error Sending Message:", error);
      alert("Failed to Send Message");
    }
  };


  const handleSelect = (value) => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleRefresh = () => {
    Payment_history_Noti();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const apiEndpoints = {
    "Full Amount": `/alphaselector/api/payment/${stefto_id}/Paid_Full_Amount/`,
    "Pay Partially": `/alphaselector/api/payment/${stefto_id}/Paid_Partial_Amount/`,
    Settlement: `/alphaselector/api/payment/${stefto_id}/Settlement_Amount`,
    CibilCleanUp: `/alphaselector/api/payment/${stefto_id}/CibilCleanUp_Amount`,
    // Add more options if needed
  };

  const handleSubmit = async () => {
    if (!selectedOption || !inputValue) {
      alert("Please select an option and enter a value.");
      return;
    }

    const endpoint = apiEndpoints[selectedOption]; // Get API URL dynamically
    console.log("select type of payment", selectedOption);
    console.log("type of payment ", endpoint);

    if (!endpoint) {
      console.error("Invalid payment type selected");
      return;
    }

    try {
      await axios.post(`http://172.16.0.20:8000${endpoint}`, {
        amount: inputValue,
      });

      alert(`${selectedOption} payment recorded successfully`);
      setInputValue("");
      setSelectedOption(null);
      // fetchData();
    } catch (error) {
      console.log("Error in ", error.response.data.message);
      alert(`Failed to update ${selectedOption} payment`);
    }
  };

  if (!personadata) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div>
      {isactive === "basic" && (
        <Basic
          isactive="basic"
          fieldGroups={fieldGroups}
          setStatus={setStatus}
          onUpdateStatus={onUpdateStatus}
          handleDateChange={handleDateChange}
          setCurrentTime={setCurrentTime}
          selectedDate={selectedDate}
          status={status}
          currenttime={currenttime}
          personadata={personadata}
          isDarkmode={objectdata?.isDarkMode}
          setRemarksId={setRemarksId}
          setremarks={setremarks}
          handleRemarksJson={handleRemarksJson}
          remarks={remarks}
          stefto_id={stefto_id}
        />
      )}

      {isactive === "payment" && (
        <Payment
          fieldGroups={fieldGroups}
          personadata={personadata}
          handleUpisend={handleUpisend}
          paymentHistory={paymentHistory}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedOption={selectedOption}
          handleSelect={handleSelect}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isOpenNotification={isOpenNotification}
          setIsOpenNotification={setIsOpenNotification}
          handleRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          isDarkmode={objectdata?.isDarkMode}
        />
      )}

      {}

      {isactive === "contact" && (
        <Contact
          fieldGroups={fieldGroups}
          personadata={personadata}
          remarks={remarks}
          setremarks={setremarks}
          remarksId={remarksId}
          setRemarksId={setRemarksId}
          handleRemarksJson={handleRemarksJson}
          updatedNumber={updatedNumber}
          setUpdatedNumber={setUpdatedNumber}
          handleUpdateNumber={handleUpdateNumber}
          stefto_id={stefto_id}
          isDarkmode={objectdata?.isDarkMode}
        />
      )}

      {isactive === "product" && (
        <Product fieldGroups={fieldGroups} personadata={personadata} />
      )}

      {isactive === "permanentaddress" && (
        <Permanentaddress fieldGroups={fieldGroups} personadata={personadata} />
      )}

      {isactive === "workaddress" && (
        <Workaddress fieldGroups={fieldGroups} personadata={personadata} />
      )}
    </div>
  );
}

export default ShowDetails;
