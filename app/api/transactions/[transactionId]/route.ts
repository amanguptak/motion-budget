import { GetFormatterForCurrency } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { transactionId: string } }
) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  try {
    const { transactionId } = params;
    console.log(transactionId ," transaction so me that");
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: user.id,
      },
    });

    if (!transaction) {
      return new NextResponse("transaction Not Found", { status: 404 });
    }
    console.log(transaction, "transactionFound");

    return NextResponse.json(transaction);
  } catch (err) {
    console.log(err, "while updating transaction");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};







// export const PATCH = async (
//   req: Request,
//   { params }: { params: { transactionId: string } }
// ) => {
//   const user = await currentUser();
//   if (!user) {
//     redirect("/sign-in");
//   }

//   try {
//     const { transactionId } = params;
//     const values = await req.json(); // Fetch the updated values
//     const { amount, category, description, type } = values;

//     // Fetch the old transaction data
//     const oldTransaction = await prisma.transaction.findUnique({
//       where: { id: transactionId },
//     });

//     if (!oldTransaction) {
//       return new NextResponse("Transaction not found", { status: 404 });
//     }

//     const { amount: oldAmount, type: oldType, date } = oldTransaction;

//     // Update the transaction
//     const updatedTransaction = await prisma.transaction.update({
//       where: { id: transactionId },
//       data: {
//         amount,
//         category,
//         description,
//         type,
//       },
//     });

//     // Adjust aggregates (monthHistory and yearHistory)
//     const day = date.getUTCDate();
//     const month = date.getUTCMonth();
//     const year = date.getUTCFullYear();

//     await prisma.$transaction([
//       // Update MonthHistory for the old transaction
//       prisma.monthHistory.upsert({
//         where: {
//           day_month_year_userId: {
//             userId: user.id,
//             day,
//             month,
//             year,
//           },
//         },
//         create: {
//           userId: user.id,
//           day,
//           month,
//           year,
//           income: oldType === "income" ? -oldAmount : 0,
//           expense: oldType === "expense" ? -oldAmount : 0,
//         },
//         update: {
//           income: {
//             decrement: oldType === "income" ? oldAmount : 0,
//           },
//           expense: {
//             decrement: oldType === "expense" ? oldAmount : 0,
//           },
//         },
//       }),

//       // Update MonthHistory for the new transaction
//       prisma.monthHistory.upsert({
//         where: {
//           day_month_year_userId: {
//             userId: user.id,
//             day,
//             month,
//             year,
//           },
//         },
//         create: {
//           userId: user.id,
//           day,
//           month,
//           year,
//           income: type === "income" ? amount : 0,
//           expense: type === "expense" ? amount : 0,
//         },
//         update: {
//           income: {
//             increment: type === "income" ? amount : 0,
//           },
//           expense: {
//             increment: type === "expense" ? amount : 0,
//           },
//         },
//       }),

//       // Update YearHistory for the old transaction
//       prisma.yearHistory.upsert({
//         where: {
//           month_year_userId: {
//             userId: user.id,
//             month,
//             year,
//           },
//         },
//         create: {
//           userId: user.id,
//           month,
//           year,
//           income: oldType === "income" ? -oldAmount : 0,
//           expense: oldType === "expense" ? -oldAmount : 0,
//         },
//         update: {
//           income: {
//             decrement: oldType === "income" ? oldAmount : 0,
//           },
//           expense: {
//             decrement: oldType === "expense" ? oldAmount : 0,
//           },
//         },
//       }),

//       // Update YearHistory for the new transaction
//       prisma.yearHistory.upsert({
//         where: {
//           month_year_userId: {
//             userId: user.id,
//             month,
//             year,
//           },
//         },
//         create: {
//           userId: user.id,
//           month,
//           year,
//           income: type === "income" ? amount : 0,
//           expense: type === "expense" ? amount : 0,
//         },
//         update: {
//           income: {
//             increment: type === "income" ? amount : 0,
//           },
//           expense: {
//             increment: type === "expense" ? amount : 0,
//           },
//         },
//       }),
//     ]);

//     return NextResponse.json(updatedTransaction);
//   } catch (err) {
//     console.error("Error updating transaction:", err);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };





export const PATCH = async (
  req: Request,
  { params }: { params: { transactionId: string } }
) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  try {
    const { transactionId } = params;
    const values = await req.json();
    const { amount, category, description, type, date: newDate } = values;

    // Fetch the old transaction data
    const oldTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!oldTransaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    const { amount: oldAmount, type: oldType, date } = oldTransaction;
    const updatedDate = new Date(newDate || date); // Use existing date if newDate is undefined

    // Extract date components
    const day = updatedDate.getDate();
    const month = updatedDate.getMonth();
    const year = updatedDate.getFullYear();

    // Update the transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        amount,
        category,
        description,
        type,
        date: updatedDate,
      },
    });

    // Calculate the differences
    let incomeDifference = 0;
    let expenseDifference = 0;

    // Subtract old amount from old type
    if (oldType === "income") {
      incomeDifference -= oldAmount;
    } else if (oldType === "expense") {
      expenseDifference -= oldAmount;
    }

    // Add new amount to new type
    if (type === "income") {
      incomeDifference += amount;
    } else if (type === "expense") {
      expenseDifference += amount;
    }

    // Adjust aggregates
    await prisma.$transaction([
      // Update MonthHistory
      prisma.monthHistory.upsert({
        where: {
          day_month_year_userId: {
            userId: user.id,
            day,
            month,
            year,
          },
        },
        create: {
          userId: user.id,
          day,
          month,
          year,
          income: incomeDifference,
          expense: expenseDifference,
        },
        update: {
          income: {
            increment: incomeDifference,
          },
          expense: {
            increment: expenseDifference,
          },
        },
      }),

      // Update YearHistory
      prisma.yearHistory.upsert({
        where: {
          month_year_userId: {
            userId: user.id,
            month,
            year,
          },
        },
        create: {
          userId: user.id,
          month,
          year,
          income: incomeDifference,
          expense: expenseDifference,
        },
        update: {
          income: {
            increment: incomeDifference,
          },
          expense: {
            increment: expenseDifference,
          },
        },
      }),
    ]);

    return NextResponse.json(updatedTransaction);
  } catch (err) {
    console.error("Error updating transaction:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};



