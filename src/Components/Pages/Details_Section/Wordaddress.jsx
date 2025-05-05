import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";


import { Building2, MapPin, Phone, Info } from 'lucide-react';

import { ClipboardList } from 'lucide-react';


function WorkAddress({
    fieldGroups,
    personadata,
}) {

  
    const renderWorkDetailField = (field) => {
        const value = personadata[field] ?? <span className="text-muted-foreground italic text-sm">N/A</span>;

        let IconComponent = Info; 
        if (field.toLowerCase().includes('address') || field.toLowerCase().includes('city') || field.toLowerCase().includes('pin')) IconComponent = MapPin;
        else if (field.toLowerCase().includes('phone') || field.toLowerCase().includes('mobile')) IconComponent = Phone;
        else if (field.toLowerCase().includes('company') || field.toLowerCase().includes('office') || field.toLowerCase().includes('work')) IconComponent = Building2;

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


     const renderDetailField = (field) => {
            const value = personadata[field] ?? <span className="text-muted-foreground italic text-sm">N/A</span>;
            const IconComponent = Info; 
    
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
        <div className="w-full p-1 overflow-auto space-y-3"> 
             <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <Building2 className="w-5 h-5" /> {/* Icon for Work Address */}
                        Work Address & Details
                    </CardTitle>
                    <CardDescription>
                        Details related to the individual's work or office location.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Check if fieldGroups and the specific index/fields exist (using index 5) */}
                    {fieldGroups && fieldGroups.length > 5 && fieldGroups[5]?.fields && fieldGroups[5].fields.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                            {/* Map all fields from fieldGroups[5] */}
                            {fieldGroups[5].fields.map(renderWorkDetailField)}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Work address details not available or fields defined.</p>
                    )}
                </CardContent>
             </Card>

           
















           
             <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <ClipboardList className="w-5 h-5" /> {/* Changed icon */}
                        Other Details
                    </CardTitle>
                    <CardDescription>
                        Additional miscellaneous information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Check if fieldGroups and the specific index/fields exist */}
                    {fieldGroups && fieldGroups.length > 6 && fieldGroups[6]?.fields && fieldGroups[6].fields.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                            {/* Map all fields from fieldGroups[6] */}
                            {fieldGroups[6].fields.map(renderDetailField)}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No additional details available or fields defined.</p>
                    )}
                </CardContent>
             </Card>

            
             
           


        </div>
    );
}


export default WorkAddress;
