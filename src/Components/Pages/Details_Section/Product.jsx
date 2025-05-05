

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Package, FileCog, Info } from 'lucide-react';

function Product({ fieldGroups, personadata }) {
  const renderProductField = (field) => {
    const value = personadata[field] ?? (
      <span className="text-muted-foreground italic text-sm">N/A</span>
    );

    let IconComponent = Info;
    if (field.toLowerCase().includes('product')) IconComponent = Package;
    else if (field.toLowerCase().includes('process') || field.toLowerCase().includes('workflow')) IconComponent = FileCog;

    return (
      <div key={field} className="space-y-1">
        <Label
          htmlFor={field}
          className="text-xs font-medium uppercase text-muted-foreground tracking-wider flex items-center gap-1.5"
        >
          <IconComponent className="w-3.5 h-3.5" />
          {field.replace(/_/g, ' ')}
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
            <Package className="w-5 h-5" />
            Product & Process Information
          </CardTitle>
          <CardDescription>
            Details related to the product or process involved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fieldGroups && fieldGroups.length > 3 && fieldGroups[3]?.fields?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {fieldGroups[3].fields.map(renderProductField)}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Product/Process details not available or fields defined.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Product;














