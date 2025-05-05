













import React ,{useState ,useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/Components/ui/button";


import { Textarea } from "@/components/ui/textarea"; 
import { ScrollArea } from "@/components/ui/scroll-area";



import { 
    ListRestart, NotebookPen, Save, History 
  } from 'lucide-react';
  
  import { Skeleton } from "@/components/ui/skeleton";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetFooter
} from "@/components/ui/sheet";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiCalendar } from "react-icons/fi";
import axios from 'axios'

import { Loader2, Calendar as CalendarIcon, Clock, CheckCircle, Edit } from 'lucide-react';



const statusOptions = [
    {
        label: "Communication Status",
        options: [
            "Call back", "Language Barrier", "Not Contactable",
            "Ringing Not Response", "Third party Call Back", "Wrong Number"
        ]
    },
    {
        label: "Payment Status",
        options: [
            "Promise to Pay", "Refuse To pay", "Pay and Settlement",
            "Pay Latter", "Paid"
        ]
    },
    {
        label: "Special Cases",
        options: [
            "Early Warning Signal", "Switch Off", "Death", "OTP"
        ]
    }
];


const showDateTime = (status) => !!status && status !== ''; 


function Basic({
    isactive,
    fieldGroups,
    setStatus,
    onUpdateStatus,
    handleDateChange,
    setCurrentTime,  
    selectedDate,
    status,
    currenttime,
    personadata,
    isLoading, 
    isDarkmode,
    remarks,
    setremarks,
    stefto_id,
    handleRemarksJson,
    isLoadingAddRemark, 
    isLoadingUpdateNumber,
}) {

    if (isactive !== "basic") return null;

      const [isSheetOpen, setIsSheetOpen] = useState(false);
        const [remarkHistory, setRemarkHistory] = useState([]);
        const [isLoadingRemarks, setIsLoadingRemarks] = useState(false);
        const [errorRemarks, setErrorRemarks] = useState(null);



        const fetchRemarks = useCallback(async () => {
            if (!stefto_id) {
                setErrorRemarks("Cannot fetch remarks: Missing required ID.");
                console.error("stefto_id is missing");
                return;
            }
            setIsLoadingRemarks(true);
            setErrorRemarks(null);
            try {
                const response = await axios.get(`http://172.16.0.20:8000/searchapp/remarkjson`, {
                    params: { stefto_id: stefto_id } 
                });
                console.log("remark data",response.data.data);
                setRemarkHistory(Array.isArray(response.data?.data) ? response.data.data.reverse() : []); 
            } catch (error) {
                console.error("Error fetching remarks:", error);
                setErrorRemarks(`Failed to fetch remarks: ${error.message}`);
                setRemarkHistory([]); 
            } finally {
                setIsLoadingRemarks(false);
            }
        }, [stefto_id]);

    console.log("dark mode in basic",isDarkmode);



     useEffect(() => {
            if (isSheetOpen) {
                fetchRemarks();
            }
        }, [isSheetOpen, fetchRemarks]);


    return (
        <div className="w-full space-y-6 p-1"> 

         

             <div className='grid lg:grid-cols-2 md:grid-cols-1 space-x-4'>
             <Card className="grid-cols-1 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <Edit className="w-5 h-5" />
                        Update Interaction Status
                       
                    </CardTitle>
                    <CardDescription>
                        Select the outcome of your interaction and schedule follow-ups if needed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="w-full sm:w-auto sm:flex-1 ">
                            <Label htmlFor="status-select" className="sr-only">Select Status</Label> 
                            <Select
                                value={status || ""} 
                                onValueChange={(value) => setStatus(value === "" ? null : value)}
                            >
                                <SelectTrigger id="status-select" className="w-full  text-sm transition-colors duration-200 focus:ring-2 focus:ring-primary/50">
                                    <SelectValue placeholder="Select Status..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((group) => (
                                        <SelectGroup key={group.label}>
                                            <SelectLabel className={`text-xs  font-semibold text-muted-foreground px-2 py-1.5  ${isDarkmode==true ? 'bg-gray-800 text-white' : ''} `}>{group.label}</SelectLabel>
                                            {group.options.map(option => (
                                                <SelectItem key={option} value={option} className={` 
                                                ${isDarkmode==true ? 'bg-gray-600 text-white' : ''} text-sm cursor-pointer`}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={onUpdateStatus}
                            disabled={!status || isLoading}
                            className="w-full sm:w-auto px-5 py-2.5 text-white  text-sm font-medium transition-all duration-200 group shadow-sm hover:shadow-md transform active:scale-95"
                            aria-label="Update Status"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <CheckCircle className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                            )}
                            {isLoading ? "Updating..." : "Update Status"}
                        </Button>
                    </div>

                 
                    <AnimatePresence>
                        {showDateTime(status) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden pt-4 border-t border-border" 
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  
                                    <div className="space-y-1.5">
                                        <Label htmlFor="followup-date" className="flex items-center text-sm font-medium text-muted-foreground">
                                            <CalendarIcon className="w-4 h-4 mr-1.5"  />
                                            Follow-up Date
                                        </Label>
                                        
                                         <div>
                                        <Input
                                            id="followup-date"
                                            type="date"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            className="text-sm  transition-colors duration-200 focus:ring-2 focus:ring-primary/50"
                                            min={new Date().toISOString().split('T')[0]} 
                                           
                                        />

                                        </div> 



                                        

                                    </div>

                                   
                                    <div className="space-y-1.5">
                                        <Label htmlFor="followup-time" className="flex items-center text-sm font-medium text-muted-foreground">
                                            <Clock className="w-4 h-4 mr-1.5" />
                                            Follow-up Time
                                        </Label>
                                        <Input
                                            id="followup-time"
                                            type="time"
                                            value={currenttime}
                                            onChange={(e) => setCurrentTime(e.target.value)}
                                            className="text-sm transition-colors duration-200 focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </CardContent>
            </Card>
            <Card className='grid-cols-1 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300'>
                
                 <CardContent>
                 <div className="space-y-2 border-t pt-4">
                             <Label htmlFor="add-remark" className="flex items-center text-sm font-medium">
                                <NotebookPen className="w-4 h-4 mr-1.5 text-muted-foreground" />
                                Add New Remark
                            </Label>
                             <Textarea
                                id="add-remark"
                                value={remarks}
                                onChange={(e) => setremarks(e.target.value)}
                                placeholder="Type your remark here..."
                                className="text-sm min-h-[80px] focus:ring-2 focus:ring-primary/50"
                                rows={3}
                             />
                            <div className="flex justify-between items-center pt-2">
                                
                              
                                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <History className="mr-2 h-4 w-4" />
                                            View History
                                        </Button>
                                    </SheetTrigger>
                                    
                                    <SheetContent className="w-full sm:w-[540px] sm:max-w-none flex flex-col">
                                        <SheetHeader>
                                            <SheetTitle className="flex items-center gap-2">
                                                <History className="w-5 h-5 text-primary"/>
                                                Remarks History
                                            </SheetTitle>
                                            <SheetDescription>
                                                Chronological list of remarks for this contact. Newest first.
                                                <Button variant="ghost" size="icon" onClick={fetchRemarks} disabled={isLoadingRemarks} className="ml-2 h-7 w-7">
                                                    <ListRestart className={`h-4 w-4 ${isLoadingRemarks ? 'animate-spin': ''}`}/>
                                                    <span className="sr-only">Refresh Remarks</span>
                                                </Button>
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="flex-grow overflow-hidden py-2">
                                            <ScrollArea className="h-full pr-4">
                                                 {isLoadingRemarks ? (
                                                    <div className="space-y-3 mt-2">
                                                        <Skeleton className="h-10 w-full" />
                                                        <Skeleton className="h-10 w-full" />
                                                        <Skeleton className="h-10 w-full" />
                                                    </div>
                                                 ) : errorRemarks ? (
                                                    <p className="text-sm text-destructive text-center p-4">{errorRemarks}</p>
                                                 ) : remarkHistory.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {remarkHistory.map((item, index) => (
                                                            <div key={item.id || index} className=" py-2 text-xs border px-4 rounded-md  bg-muted/50 ">
                                                                <p className="text-foreground font-medium mb-1 break-words">{item.remarks || 'No remark text.'}</p>
                                                                <div className="flex justify-between items-center text-muted-foreground">
                                                                    <span>By: {item.employee_id || 'Unknown'}</span>
                                                                    <span>{item?.currentdate ? item.currentdate : 'Unknown date'}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                 ) : (
                                                    <p className="text-sm text-muted-foreground text-center p-4">No remarks found.</p>
                                                 )}
                                            </ScrollArea>
                                        </div>
                                        <SheetFooter className="mt-auto">
                                            <SheetClose asChild>
                                                <Button variant="outline">Close</Button>
                                            </SheetClose>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>

                               
                                <Button
                                    size="sm"
                                    onClick={handleRemarksJson} 
                                    disabled={!remarks?.trim() || isLoadingAddRemark}
                                    className="flex-shrink-0"
                                >
                                    {isLoadingAddRemark ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                         <Save className="mr-2 h-4 w-4" />
                                    )}
                                    {isLoadingAddRemark ? "Saving..." : "Save Remark"}
                                </Button>
                            </div>
                        </div>
                 </CardContent>
            </Card>

             </div>

            
          

            {/* --- Data Display Cards --- */}
            {fieldGroups && fieldGroups.length > 0 && fieldGroups[0]?.fields && (
                <div className="grid grid-cols-1  gap-6">
                    {/* Table 1 Card */}
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-primary">
                                Primary Information 
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-md border">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            {fieldGroups[0].fields.slice(0, 6).map((field) => (
                                                <th
                                                    key={field}
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                                >
                                                    {field.replace(/_/g, ' ')} 
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border bg-background">
                                        <tr className="hover:bg-muted/50 transition-colors duration-150">
                                            {fieldGroups[0].fields.slice(0, 6).map((field) => (
                                                <td
                                                    key={field}
                                                    className="px-4 py-3 whitespace-nowrap text-sm text-foreground"
                                                >
                                                    {personadata[field] ?? <span className="text-muted-foreground italic">N/A</span>} {/* Handle null/undefined */}
                                                </td>
                                            ))}
                                        </tr>
                                     
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Table 2 Card */}
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-primary">
                                Secondary Information 
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-md border">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            {fieldGroups[0].fields.slice(6).map((field) => (
                                                <th
                                                    key={field}
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                                >
                                                    {field.replace(/_/g, ' ')} 
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border bg-background">
                                        <tr className="hover:bg-muted/50 transition-colors duration-150">
                                            {fieldGroups[0].fields.slice(6).map((field) => (
                                                <td
                                                    key={field}
                                                    className="px-4 py-3 whitespace-nowrap text-sm text-foreground"
                                                >
                                                    {personadata[field] ?? <span className="text-muted-foreground italic">N/A</span>} {/* Handle null/undefined */}
                                                </td>
                                            ))}
                                        </tr>
                                      
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default Basic;