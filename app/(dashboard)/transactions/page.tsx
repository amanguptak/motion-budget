"use client";

import TransactionTable from "@/app/(dashboard)/transactions/_components/TransactionTable";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";

function TransactionsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 dark:from-gray-800 dark:to-gray-700 text-gray-300 shadow-lg">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8 px-4">
          <div>
            <p className="text-3xl font-bold">Transactions History</p>
            <p className="text-sm text-white/80">
              View and manage your transactions with ease
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <DateRangePicker
              initialDateFrom={dateRange.from}
              initialDateTo={dateRange.to}
              showCompare={false}
           
              onUpdate={(values) => {
                const { from, to } = values.range;

                if (!from || !to) return;
                if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                  toast.error(
                    `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`
                  );
                  return;
                }

                setDateRange({ from, to });
              }}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="container py-6">
        <TransactionTable from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
}

export default TransactionsPage;
