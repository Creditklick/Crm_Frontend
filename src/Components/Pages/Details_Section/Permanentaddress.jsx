
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";

import { Home, MapPin, Info } from "lucide-react";

function PermanentAddress({ fieldGroups, personadata }) {
  const renderAddressField = (field) => {
    const value = personadata[field] ?? (
      <span className="text-muted-foreground italic text-sm">N/A</span>
    );

    let IconComponent = Info;
    if (
      field.toLowerCase().includes("address") ||
      field.toLowerCase().includes("city") ||
      field.toLowerCase().includes("pin") ||
      field.toLowerCase().includes("state") ||
      field.toLowerCase().includes("country")
    )
      IconComponent = MapPin;
    else if (field.toLowerCase().includes("landmark")) IconComponent = MapPin;

    return (
      <div key={field} className="space-y-1">
        <Label
          htmlFor={field}
          className="text-xs font-medium uppercase text-muted-foreground tracking-wider flex items-center gap-1.5"
        >
          <IconComponent className="w-3.5 h-3.5" />
          {field.replace(/_/g, " ")}
        </Label>
        <p id={field} className="text-sm text-foreground break-words">
          {value}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full p-1">
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Home className="w-5 h-5" />
            Permanent Address
          </CardTitle>
          <CardDescription>
            The individual's primary residential address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fieldGroups &&
          fieldGroups.length > 4 &&
          fieldGroups[4]?.fields &&
          fieldGroups[4].fields.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {fieldGroups[4].fields.map(renderAddressField)}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Permanent address details not available or fields defined.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PermanentAddress;
