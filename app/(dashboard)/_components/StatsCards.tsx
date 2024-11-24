"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

function StatsCards({ from, to, userSettings }: Props) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-4 lg:flex-nowrap lg:gap-6 ">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-orange-600 bg-orange-200/50 shadow-md transition-transform duration-300 hover:scale-105" />
          }
          bgClass="bg-orange-50 dark:bg-slate-900  shadow-2xl hover:shadow-3xl dark:shadow-3xl "
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-200/50 shadow-md transition-transform duration-300 hover:scale-105" />
          }
          bgClass="bg-red-50 dark:bg-slate-900  shadow-2xl hover:shadow-3xl  dark:shadow-3xl"
        />
      </SkeletonWrapper> 

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-200/50 shadow-md transition-transform duration-300 hover:scale-105" />
          }
          bgClass="bg-violet-50 dark:bg-slate-900 shadow-2xl hover:shadow-3xl dark:shadow-3xl"
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  icon,
  bgClass,
}: {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: String;
  value: number;
  bgClass: string;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card
      className={`flex h-28 w-full items-center gap-4 p-6 rounded-lg ${bgClass} transition-transform duration-300 hover:scale-105`}
    >
      {icon}
      <div className="flex flex-col items-start gap-1">
        <p className="text-sm font-medium text-orange-600 dark:text-orange-300">
          {title}
        </p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-3xl font-bold text-gray-800 dark:text-white"
        />
      </div>
    </Card>
  );
}
