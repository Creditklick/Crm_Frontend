
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea"; 
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose, 
    SheetFooter
} from "@/Components/ui/sheet";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Skeleton } from "@/Components/ui/skeleton";


import {
    User, Phone, Mail, MessageSquare, Edit, History, Loader2, Save, Info, X, ListRestart, NotebookPen
} from 'lucide-react';



function Contact({
    fieldGroups,
    personadata,
    remarks,         
    setremarks,      
   
  
    handleRemarksJson,
    updatedNumber,  
    setUpdatedNumber,
    handleUpdateNumber,
    stefto_id,      
    isLoadingAddRemark, 
    isLoadingUpdateNumber, 
    isDarkmode
}) {

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [remarkHistory, setRemarkHistory] = useState([]);
    const [isLoadingRemarks, setIsLoadingRemarks] = useState(false);
    const [errorRemarks, setErrorRemarks] = useState(null);



    useEffect(()=>{
       console.log("remakr data",remarkHistory);
    },[])

    
    const fetchRemarks = useCallback(async () => {
        if (!stefto_id) {
            setErrorRemarks("Cannot fetch remarks: Missing required ID.");
            console.error("stefto_id is missing");
            return;
        }
        setIsLoadingRemarks(true);
        setErrorRemarks(null);
        try {
            const response = await axios.get(`https://crm-backend-msk3.onrender.com/searchapp/remarkjson`, {
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

 
    useEffect(() => {
        if (isSheetOpen) {
            fetchRemarks();
        }
    }, [isSheetOpen, fetchRemarks]);

   
    const renderContactField = (field) => {
        const value = personadata[field] ?? <span className="text-muted-foreground italic text-sm">N/A</span>;
     
        let IconComponent = Info;
        if (field.toLowerCase().includes('phone') || field.toLowerCase().includes('mobile')) IconComponent = Phone;
        else if (field.toLowerCase().includes('email')) IconComponent = Mail;
        else if (field.toLowerCase().includes('name')) IconComponent = User;

        return (
            <div key={field} className="space-y-1">
                <Label htmlFor={field} className="text-xs font-medium uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                   <IconComponent className="w-3.5 h-3.5"/>
                   {field.replace(/_/g, ' ')} 
                </Label>
                <p id={field} className="text-sm text-foreground break-words">
                    {value}
                </p>
            </div>
        );
    };

   
    return (
        <div className="space-y-6 p-1">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

             
                <Card className="lg:col-span-2 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <User className="w-5 h-5" />
                            Contact Information
                        </CardTitle>
                        <CardDescription>
                            Primary contact details for this individual.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {fieldGroups && fieldGroups.length > 2 && fieldGroups[2]?.fields ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4">
                                {fieldGroups[2].fields.map(renderContactField)}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Contact field definitions not available.</p>
                        )}
                    </CardContent>
                </Card>

              
                <Card className="lg:col-span-1 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                            <Edit className="w-5 h-5" />
                            Actions & Updates
                        </CardTitle>
                         <CardDescription>
                            Update contact info or add remarks.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    
                        <div className="space-y-2">
                            <Label htmlFor="update-number" className="flex items-center text-sm font-medium">
                                <Phone className="w-4 h-4 mr-1.5 text-muted-foreground" />
                                Update Phone Number
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="update-number"
                                    type="tel" 
                                    value={updatedNumber}
                                    onChange={(e) => setUpdatedNumber(e.target.value)}
                                    placeholder="Enter new number"
                                    className="flex-grow text-sm focus:ring-2 focus:ring-primary/50"
                                />
                                <button
                                    size="sm"
                                    onClick={handleUpdateNumber}
                                    disabled={!updatedNumber?.trim() || isLoadingUpdateNumber}
                                    className={`flex-shrink-0 `}
                                    aria-label="Update Number"
                                >
                                    <div className={`border-2  px-2 py-2 cursor-pointer rounded-lg transition-all duration-300 ease-in-out hover:scale-105 ${isDarkmode==true ? "border-white" : 'border-black'}`}>
                                    {isLoadingUpdateNumber ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4 " />
                                    )}

                                    </div>
                                    
                                </button>
                            </div>
                        </div>
                        
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Contact;