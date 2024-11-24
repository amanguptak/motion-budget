"use client";

import HistoryPeriodSelector from "@/app/(dashboard)/_components/HistoryPeriodSelector";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { Period, Timeframe } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState, useCallback } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Sector,
} from "recharts";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

// Define data shape for chart
interface HistoryData {
  year: number;
  month: number;
  day?: number;
  income: number;
  expense: number;
}

function History({ userSettings }: { userSettings: UserSettings }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const formatter = useMemo(
    () => GetFormatterForCurrency(userSettings.currency),
    [userSettings.currency]
  );

  const historyDataQuery = useQuery<HistoryData[]>({
    queryKey: ["overview", "history", timeframe, period],
    queryFn: async () => {
      const res = await fetch(
        `/api/history-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch history data");
      }
      return res.json();
    },
    staleTime: 300000,
  });

  const dataAvailable =
    historyDataQuery.data && historyDataQuery.data.length > 0;

  const aggregateData = useMemo(() => {
    if (!dataAvailable || !historyDataQuery.data) return null;
    const totalIncome = historyDataQuery.data.reduce(
      (sum, item) => sum + item.income,
      0
    );
    const totalExpense = historyDataQuery.data.reduce(
      (sum, item) => sum + item.expense,
      0
    );
    const balance = totalIncome - totalExpense;
    return [
      { name: "Income", value: totalIncome, color: "#10b981" },
      { name: "Expense", value: totalExpense, color: "#ef4444" },
      { name: "Balance", value: balance, color: "#F97316" },
    ];
  }, [historyDataQuery.data, dataAvailable]);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      value,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy - 20}
          textAnchor="middle"
          className="font-bold text-lg fill-current text-gray-900 dark:text-gray-100"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          className="text-md fill-current text-gray-700 dark:text-gray-300"
        >
          {formatter.format(value)}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 5}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#fff"
          strokeWidth={2}
          cornerRadius={5}
        />
      </g>
    );
  };

  return (
    <div className="w-full ">
      <div className="flex flex-wrap justify-between items-center space-y-2">
        <HistoryPeriodSelector
          period={period}
          setPeriod={setPeriod}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={"outline"}
            className="flex items-center gap-2 text-sm dark:bg-emerald-500"
          >
            <div className="h-4 w-4 rounded-full dark:bg-emerald-200 bg-emerald-500"></div>
            Income
          </Badge>
          <Badge
            variant={"outline"}
            className="flex items-center gap-2 text-sm dark:bg-red-500"
          >
            <div className="h-4 w-4 rounded-full dark:bg-red-300  bg-red-500"></div>
            Expense
          </Badge>
        </div>
      </div>

      {/* Bar Chart Card */}
      <Card className="w-full bg-orange-50 border-0 dark:bg-slate-900 shadow-md my-2 ">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold text-gray-800 dark:text-gray-200">
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={historyDataQuery.data}>
                  <defs>
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#10b981"
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="100%"
                        stopColor="#10b981"
                        stopOpacity="0.2"
                      />
                    </linearGradient>
                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#ef4444"
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="100%"
                        stopColor="#ef4444"
                        stopOpacity="0.2"
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="5 5"
                    strokeOpacity={0.2}
                    vertical={false}
                  />
                  <XAxis
                    dataKey={(data: HistoryData) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      return timeframe === "year"
                        ? date.toLocaleDateString("default", { month: "short" })
                        : date.toLocaleDateString("default", { day: "2-digit" });
                    }}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                  <Bar dataKey="income" fill="url(#incomeBar)" radius={4} />
                  <Bar dataKey="expense" fill="url(#expenseBar)" radius={4} />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => (
                      <CustomTooltip formatter={formatter} {...props} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-700 dark:text-gray-400">
                No data for the selected period
              </div>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>

      {/* Pie Chart Card */}
      <Card className="w-full bg-orange-50 border-0 dark:bg-slate-900 shadow-md my-2">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold text-gray-800 dark:text-gray-200">
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable && aggregateData ? (
              <div className="flex flex-col md:flex-row items-center justify-center">
                <div className="w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={aggregateData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="60%"
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={onPieEnter}
                        paddingAngle={5}
                      >
                        {aggregateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2">
                  {aggregateData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center cursor-pointer"
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div className="flex space-x-2 w-full">
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.name}
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                          {formatter.format(item.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-700 dark:text-gray-400">
                No data for the selected period
              </div>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

export default History;

function CustomTooltip({ active, payload, formatter }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className="min-w-[300px] rounded border bg-background p-2">
      <TooltipRow
        formatter={formatter}
        label="Expense"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Income"
        value={income}
        bgColor="bg-emerald-500"
        textColor="text-emerald-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor="bg-orange-400"
        textColor="text-foreground"
      />
    </div>
  );
}

function TooltipRow({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: {
  label: string;
  textColor: string;
  bgColor: string;
  value: number;
  formatter: Intl.NumberFormat;
}) {
  const formattingFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <div className="flex items-center gap-1">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            formattingFn={formattingFn}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
