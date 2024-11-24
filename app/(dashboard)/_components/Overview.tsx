"use client";

import CategoriesStats from "@/app/(dashboard)/_components/CategoriesStats";
import StatsCards from "@/app/(dashboard)/_components/StatsCards";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";

function Overview({ userSettings }: { userSettings: UserSettings }) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      {/* Header Section */}
      <div className="container flex flex-wrap items-end justify-end gap-4 py-6">
       
        <div className="flex items-center gap-3">
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

      {/* Content Section */}
      <div className="container flex flex-wrap gap-6 py-6">
        {/* Stats Cards in Single Row for Desktop */}
        <div className="flex flex-wrap lg:flex-nowrap w-full gap-6">
          <StatsCards
            userSettings={userSettings}
            from={dateRange.from}
            to={dateRange.to}
          />
        </div>

        {/* Categories Stats */}
        <div className="flex flex-wrap lg:flex-nowrap w-full gap-6">
          <CategoriesStats
            userSettings={userSettings}
            from={dateRange.from}
            to={dateRange.to}
          />
        </div>
      </div>
    </>
  );
}

export default Overview;
