

// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { TransactionType } from "@/lib/types";
// import { cn } from "@/lib/utils";
// import {
//   CreateTransactionSchema,
//   CreateTransactionSchemaType,
// } from "@/schema/transaction";
// import { ReactNode, useCallback, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import CategoryPicker from "@/app/(dashboard)/_components/CategoryPicker";
// import {
//   Popover,
//   PopoverContent as Content,
//   PopoverTrigger as Trigger,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { CalendarIcon } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import axios from "axios";
// import { useQueryClient } from "@tanstack/react-query";

// interface Props {
//   trigger: ReactNode;
//   type: TransactionType;
//   transactionId: string;
// }

// function EditTransactionDialog({ trigger, type, transactionId }: Props) {
//   const queryClient = useQueryClient();
//   const form = useForm<CreateTransactionSchemaType>({
//     resolver: zodResolver(CreateTransactionSchema),
//     defaultValues: {
//       type,
//       date: new Date(),
//       description: "",
//       amount: 0,
//       category: "",
//     },
//   });

//   const [open, setOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Fetch transaction details when the dialog opens
//   const fetchTransaction = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const res = await axios.get(`/api/transactions/${transactionId}`);
//       const data = res.data;

//       // Populate the form with existing data
//       form.reset({
//         type: data.type,
//         description: data.description || "",
//         amount: data.amount || 0,
//         // Ensure date consistency here
//         date: new Date(data.date),
//         category: data.category || "",
//       });

//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching transaction:", error);
//       toast.error("Failed to fetch transaction details.");
//       setIsLoading(false);
//     }
//   }, [transactionId, form]);

//   useEffect(() => {
//     if (open && transactionId) {
//       fetchTransaction();
//     }
//   }, [open, transactionId, fetchTransaction]);

//   // Submit updated transaction details
//   const onSubmit = async (values: CreateTransactionSchemaType) => {
//     try {
//       setIsLoading(true);
//       toast.loading("Updating transaction...", { id: "update-transaction" });

//       // Send the date as-is without converting to UTC
//       const response = await axios.patch(`/api/transactions/${transactionId}`, {
//         ...values,
//         // date: DateToUTCDate(values.date), // Remove this line
//         date: values.date,
//       });

//       if (response.status === 200) {
//         toast.success("Transaction updated successfully 🎉", {
//           id: "update-transaction",
//         });

//         // Invalidate queries to refresh data
//         queryClient.invalidateQueries({
//           queryKey: ["overview", "history"],
//         });
  
//         queryClient.invalidateQueries({
//           queryKey: ["overview", "stats"],
//         });
  
//         queryClient.invalidateQueries({
//           queryKey: ["transactions"],
//         });

//         setOpen(false);
//       } else {
//         toast.error("Failed to update transaction.");
//       }
//     } catch (error) {
//       console.error("Error updating transaction:", error);
//       toast.error("An error occurred while updating the transaction.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>{trigger}</DialogTrigger>
//       <DialogContent
//         className={cn(
//           "max-w-lg w-full p-4 rounded-lg sm:p-6 lg:max-w-2xl",
//           "bg-orange-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg"
//         )}
//       >
//         <DialogHeader>
//           <DialogTitle className="text-lg font-semibold">
//             Edit Transaction
//           </DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-orange-600 dark:text-orange-300">
//                     Description
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       className="border border-orange-400 dark:border-orange-500 focus:ring-orange-500 focus:border-orange-500"
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Enter a transaction description
//                   </FormDescription>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="amount"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-orange-600 dark:text-orange-300">
//                     Amount
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       {...field}
//                       className="border border-orange-400 dark:border-orange-500 focus:ring-orange-500 focus:border-orange-500"
//                     />
//                   </FormControl>
//                   <FormDescription>Enter the transaction amount</FormDescription>
//                 </FormItem>
//               )}
//             />
//             <div className="flex gap-4">
//               <FormField
//                 control={form.control}
//                 name="category"
//                 render={({ field }) => (
//                   <FormItem className="flex-1">
//                     <FormLabel className="text-orange-600 dark:text-orange-300">
//                       Category
//                     </FormLabel>
//                     <FormControl>
//                       <CategoryPicker
//                         type={type}
//                         onChange={field.onChange}
//                         selectedCategory={field.value}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       Choose a transaction category
//                     </FormDescription>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="date"
//                 render={({ field }) => (
//                   <FormItem className="flex-1">
//                     <FormLabel className="text-orange-600 dark:text-orange-300">
//                       Date
//                     </FormLabel>
//                     <Popover
                      
//                     >
//                       <Trigger asChild>
//                         <Button
//                           type="button"
//                           disabled
//                           variant="outline"
//                           className="w-full border-orange-400 dark:border-orange-500 text-left bg-gray-100 dark:bg-gray-800"
//                         >
//                           {field.value
//                             ? format(new Date(field.value), "PPP")
//                             : "Select Date"}
//                           <CalendarIcon className="ml-2 h-5 w-5" />
//                         </Button>
//                       </Trigger>
//                       <Content
//                         className="w-auto p-0 z-50"
//                         onMouseDown={(e) => e.stopPropagation()}
//                       >
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={(value) => field.onChange(value)}
//                           initialFocus
//                           disabled
//                         />
                       
//                       </Content>
//                     </Popover>
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </form>
//         </Form>
//         <DialogFooter className="flex justify-between mt-4">
//           <Button
//             variant="secondary"
//             onClick={() => setOpen(false)}
//             className="bg-orange-400 text-white hover:bg-orange-500"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={form.handleSubmit(onSubmit)}
//             disabled={isLoading}
//             className="bg-orange-500 text-white hover:bg-orange-600"
//           >
//             {isLoading ? "Updating..." : "Update"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default EditTransactionDialog;


"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "@/app/(dashboard)/_components/CategoryPicker";
import {
  Popover,
  PopoverContent as Content,
  PopoverTrigger as Trigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  trigger: ReactNode;
  type: TransactionType;
  transactionId: string;
}

function EditTransactionDialog({ trigger, type, transactionId }: Props) {
  const queryClient = useQueryClient();
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
      description: "",
      amount: 0,
      category: "",
    },
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch transaction details when the dialog opens
  const fetchTransaction = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/transactions/${transactionId}`);
      const data = res.data;

      // Populate the form with existing data
      form.reset({
        type: data.type,
        description: data.description || "",
        amount: data.amount || 0,
        // Ensure date consistency here
        date: new Date(data.date),
        category: data.category || "",
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      toast.error("Failed to fetch transaction details.");
      setIsLoading(false);
    }
  }, [transactionId, form]);

  useEffect(() => {
    if (open && transactionId) {
      fetchTransaction();
    }
  }, [open, transactionId, fetchTransaction]);

  // Submit updated transaction details
  const onSubmit = async (values: CreateTransactionSchemaType) => {
    try {
      setIsLoading(true);
      toast.loading("Updating transaction...", { id: "update-transaction" });

      // Send the date as-is without converting to UTC
      const response = await axios.patch(`/api/transactions/${transactionId}`, {
        ...values,
        date: values.date,
      });

      if (response.status === 200) {
        toast.success("Transaction updated successfully 🎉", {
          id: "update-transaction",
        });

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({
          queryKey: ["overview", "history"],
        });

        queryClient.invalidateQueries({
          queryKey: ["overview", "stats"],
        });

        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        });

        setOpen(false);
      } else {
        toast.error("Failed to update transaction.");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("An error occurred while updating the transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-lg w-full p-4 rounded-lg sm:p-6 lg:max-w-2xl",
          "bg-orange-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg"
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-orange-600 dark:text-orange-300">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border border-orange-400 dark:border-orange-500 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a transaction description
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-orange-600 dark:text-orange-300">
                    Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="border border-orange-400 dark:border-orange-500 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the transaction amount
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* Responsive layout for category and date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-600 block dark:text-orange-300">
                      Category
                    </FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={field.onChange}
                        selectedCategory={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a transaction category
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-600 dark:text-orange-300">
                      Date
                    </FormLabel>
                    <Popover>
                      <Trigger asChild>
                        <Button
                          type="button"
                          disabled
                          variant="outline"
                          className="w-full border-orange-400 dark:border-orange-500 text-left bg-gray-100 dark:bg-gray-800"
                        >
                          {field.value
                            ? format(new Date(field.value), "PPP")
                            : "Select Date"}
                          <CalendarIcon className="ml-2 h-5 w-5" />
                        </Button>
                      </Trigger>
                      <Content
                        className="w-auto p-0 z-50"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => field.onChange(value)}
                          initialFocus
                          disabled
                        />
                      </Content>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className="flex flex-col-reverse gap-2 mt-4 sm:flex-row sm:justify-between">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto bg-orange-400 text-white hover:bg-orange-500"
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full sm:w-auto bg-orange-500 text-white hover:bg-orange-600"
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditTransactionDialog;
