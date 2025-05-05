import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Bell,
  RefreshCw,
  CircleDollarSign,
  Receipt,
  CheckCheck,
  Sparkle,
  Loader2,
  Send,
  Info,
  ListChecks,
} from "lucide-react";

const paymentOptions = [
  {
    value: "Full Amount",
    icon: CircleDollarSign,
    iconColor: "text-green-600",
    bgColor: "hover:bg-green-50",
  },
  {
    value: "Pay Partially",
    icon: Receipt,
    iconColor: "text-blue-600",
    bgColor: "hover:bg-blue-50",
  },
  {
    value: "Settlement",
    icon: CheckCheck,
    iconColor: "text-cyan-600",
    bgColor: "hover:bg-cyan-50",
  },
  {
    value: "CibilCleanUp",
    icon: Sparkle,
    iconColor: "text-purple-600",
    bgColor: "hover:bg-purple-50",
  },
];

function Payment({
  fieldGroups,
  personadata,
  handleUpisend,
  paymentHistory = [],

  selectedOption,
  handleSelect,
  inputValue,
  handleInputChange,
  handleSubmit,

  handleRefresh,
  isRefreshing,
  isLoadingSubmit,

  isLoadingSend,
  isDarkmode,
}) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  console.log("dark mode state as payment", isDarkmode);

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "fully paid":
        return "success";
      case "cibilcleanup":
        return "warning";
      case "partially paid":
        return "info";
      case "settlement":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6 p-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <Card className="md:col-span-2 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                <CircleDollarSign className="w-5 h-5" />
                Record Payment / Action
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                Select payment type, enter amount, and submit.
              </CardDescription>
            </div>

            <Popover open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative flex-shrink-0"
                >
                  <Bell className="h-5 w-5" />
                  {paymentHistory.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 min-w-[20px] p-0 flex items-center justify-center rounded-full text-xs"
                    >
                      {paymentHistory.length}
                    </Badge>
                  )}
                  <span className="sr-only">View Payment History</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={`w-80 p-0 ${
                  isDarkmode == true ? "bg-black-400 text-white" : ""
                } `}
                align="end"
              >
                <div className="flex items-center justify-between p-3 border-b">
                  <h4 className="font-medium  leading-none text-sm flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 " />
                    Payment History
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    aria-label="Refresh History"
                    className={`${
                      isDarkmode == true
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </div>
                <ScrollArea className="h-72">
                  <div className="p-2 space-y-1">
                    {paymentHistory.length > 0 ? (
                      paymentHistory.map((payment, index) => (
                        <div
                          key={index}
                          className={`${
                            isDarkmode == true
                              ? "text-white"
                              : "p-2 rounded-md hover:bg-muted transition-colors text-xs"
                          } `}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className=" ">
                              ₹
                              {payment.amount?.toLocaleString("en-IN") ?? "N/A"}
                            </span>
                            <Badge
                              variant={getStatusBadgeVariant(payment.status)}
                              className={` ${
                                isDarkmode === true ? "text-white" : ""
                              } text-xs`}
                            >
                              {payment.status || "N/A"}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            {payment.date
                              ? new Date(payment.date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "No date"}
                          </div>
                          {/* Add more details if available, e.g., payment.notes */}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No payment history found.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <Select
              value={selectedOption || ""}
              onValueChange={(value) =>
                handleSelect(value === "" ? null : value)
              }
            >
              <SelectTrigger className="w-full  text-sm focus:ring-2 focus:ring-primary/50">
                <SelectValue placeholder="Select Payment Type / Action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel
                    className={`text-xs font-semibold  mb-1 ${
                      isDarkmode
                        ? "text-white bg-gray-800"
                        : "text-muted-foreground"
                    }`}
                  >
                    Payment Options
                  </SelectLabel>

                  {paymentOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className={`text-sm cursor-pointer ${
                        isDarkmode == true ? "bg-gray-700" : ""
                      } ${option.bgColor}`}
                    >
                      <div className="flex items-center gap-2 ">
                        <option.icon
                          className={`w-4 h-4 ${
                            isDarkmode == true ? "text-white" : "text-black"
                          } ${option.iconColor}`}
                        />
                        <span
                          className={`${
                            isDarkmode == true ? "text-white" : ""
                          }`}
                        >
                          {option.value}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <AnimatePresence>
              {selectedOption && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden space-y-3"
                >
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="payment-value"
                      className="text-sm font-medium"
                    >
                      Amount / Value
                    </Label>
                    <Input
                      id="payment-value"
                      type="number"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder={`Enter ${
                        selectedOption === "Pay Partially" ||
                        selectedOption === "Full Amount"
                          ? "amount"
                          : "details"
                      }...`}
                      className="text-sm focus:ring-2 focus:ring-primary/50"
                      min="0"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!inputValue || isLoadingSubmit}
                    className="w-full sm:w-auto text-sm text-white"
                    size="sm"
                  >
                    {isLoadingSubmit ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isLoadingSubmit ? "Submitting..." : "Submit Action"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-primary">
              <Info className="w-5 h-5" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <Alert variant="default">
              <Send className="h-4 w-4" />
              <AlertTitle>Send Communication</AlertTitle>
              <AlertDescription className="text-sm">
                Please click the button below to send the relevant message or
                payment link to this customer.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full cursor-pointer text-sm"
              onClick={handleUpisend}
              disabled={isLoadingSend}
            >
              {isLoadingSend ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isLoadingSend ? "Sending..." : "Send Message / Link"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {fieldGroups && fieldGroups.length > 1 && fieldGroups[1]?.fields && (
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-primary">
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    {fieldGroups[1].fields.slice(0, 7).map((field) => (
                      <th
                        key={field}
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        {field.replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  <tr className="hover:bg-muted/50 transition-colors duration-150">
                    {fieldGroups[1].fields.slice(0, 7).map((field) => (
                      <td
                        key={field}
                        className="px-4 py-3 whitespace-nowrap text-sm text-foreground"
                      >
                        {personadata[field] ?? (
                          <span className="text-muted-foreground italic">
                            N/A
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Payment;
