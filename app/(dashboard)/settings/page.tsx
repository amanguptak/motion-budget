"use client";

import CreateCategoryDialog from "@/app/(dashboard)/_components/CreateCategoryDialog";
import DeleteCategoryDialog from "@/app/(dashboard)/_components/DeleteCategoryDialog";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

function page() {
  return (
    <>

      <div className="border-b bg-gradient-to-r from-orange-400 to-orange-300 dark:from-gray-800 dark:to-gray-700 text-white shadow-lg">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8 px-4">
          <div>
            <p className="text-4xl font-bold">Settings</p>
            <p className="text-sm text-white/80">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>


      <div className="container flex flex-col gap-6 p-6">
        <Card className="bg-gradient-to-b from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-orange-600 dark:text-orange-400">
              Currency
            </CardTitle>
            <CardDescription className="text-sm text-gray-700 dark:text-gray-300">
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
}

export default page;

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card className="bg-gradient-to-b from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {type === "expense" ? (
                <TrendingDown className="h-12 w-12 rounded-lg bg-red-500/10 p-2 text-red-500 shadow-md shadow-red-200" />
              ) : (
                <TrendingUp className="h-12 w-12 rounded-lg bg-emerald-500/10 p-2 text-emerald-500 shadow-md shadow-emerald-200" />
              )}
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {type === "income" ? "Incomes" : "Expenses"} Categories
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sorted by name
                </p>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm bg-orange-500 text-white hover:bg-orange-600">
                  <PlusSquare className="h-4 w-4" />
                  Create Category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No
              <span
                className={cn(
                  "ml-1 font-semibold",
                  type === "income" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {type}
              </span>
              categories yet
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create one to get started
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard category={category} key={category.name} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex flex-col justify-between rounded-lg bg-white shadow-md dark:bg-gray-800 hover:shadow-lg">
      <div className="flex flex-col items-center gap-4 p-6">
        <span className="text-4xl" role="img">
          {category.icon}
        </span>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {category.name}
        </p>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className="flex w-full items-center justify-center gap-2 rounded-none bg-red-500/10 text-red-500 hover:bg-red-500/20"
            variant={"secondary"}
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </Button>
        }
      />
    </div>
  );
}
