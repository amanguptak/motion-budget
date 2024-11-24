import CreateTransactionDialog from "@/app/(dashboard)/_components/CreateTransactionDialog";
import History from "@/app/(dashboard)/_components/History";
import Overview from "@/app/(dashboard)/_components/Overview";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-orange-200 via-orange-100 to-orange-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-lg sm:text-xl">
            Keep track of your finances with ease and control.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            {/* Income Button */}
            <CreateTransactionDialog
              trigger={
                <Button className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
                  Add Income 🤑
                </Button>
              }
              type="income"
            />

            {/* Expense Button */}
            <CreateTransactionDialog
              trigger={
                <Button className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200">
                  Add Expense 😤
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-9">
        {/* Overview Card */}
        <div className="flex-1  dark:bg-gray-800 rounded-lg p-6 min-w-[300px]">
          <h2 className="text-xl font-semibold mb-4 text-orange-700 dark:text-orange-400">
            Overview
          </h2>
          <Overview userSettings={userSettings} />
        </div>

        {/* History Card */}
        <div className="flex-1  dark:bg-gray-800 rounded-lg p-6 min-w-[300px]">
          <h2 className="text-xl font-semibold mb-4 text-orange-700 dark:text-orange-400">
            Transaction History
          </h2>
          <History userSettings={userSettings} />
        </div>

        {/* Insights Card */}
        {/* <div className="flex-1 bg-orange-100 dark:bg-gray-800 rounded-lg p-6 min-w-[300px]">
          <h2 className="text-xl font-semibold mb-4 text-orange-700 dark:text-orange-400">
            Insights
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Coming soon: Get personalized analytics and financial insights to
            help you make informed decisions.
          </p>
        </div> */}
      </main>
    </div>
  );
}

export default page;
