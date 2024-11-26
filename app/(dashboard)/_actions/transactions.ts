"use server";

import prisma from "@/lib/prisma";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, description, type } = parsedBody.data;
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("category not found");
  }

  // NOTE: don't make confusion between $transaction ( prisma ) and prisma.transaction (table)

  await prisma.$transaction([
    // Create user transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // Update month aggregate table
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    // Update year aggreate
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}


export async function UpdateTransaction(
  transactionId: string,
  form: CreateTransactionSchemaType
) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, description, type } = form;
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("Category not found");
  }

  await prisma.$transaction([
    // Update the transaction
    prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // Update month aggregate table
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    // Update year aggregate table
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}


// export async function UpdateTransaction(
//   transactionId: string,
//   form: CreateTransactionSchemaType
// ) {
//   const user = await currentUser();
//   if (!user) {
//     redirect("/sign-in");
//   }

//   const { amount, category, date, description, type } = form;

//   // Fetch old transaction data
//   const oldTransaction = await prisma.transaction.findUnique({
//     where: { id: transactionId },
//   });

//   if (!oldTransaction) {
//     throw new Error("Transaction not found");
//   }

//   // Fetch the category row
//   const categoryRow = await prisma.category.findFirst({
//     where: {
//       userId: user.id,
//       name: category,
//     },
//   });

//   if (!categoryRow) {
//     throw new Error("Category not found");
//   }

//   await prisma.$transaction([
//     // Update the transaction
//     prisma.transaction.update({
//       where: { id: transactionId },
//       data: {
//         amount,
//         date,
//         description: description || "",
//         type,
//         category: categoryRow.name,
//         categoryIcon: categoryRow.icon,
//       },
//     }),

//     // Update month aggregate table
//     prisma.monthHistory.upsert({
//       where: {
//         day_month_year_userId: {
//           userId: user.id,
//           day: oldTransaction.date.getUTCDate(),
//           month: oldTransaction.date.getUTCMonth(),
//           year: oldTransaction.date.getUTCFullYear(),
//         },
//       },
//       create: {
//         userId: user.id,
//         day: date.getUTCDate(),
//         month: date.getUTCMonth(),
//         year: date.getUTCFullYear(),
//         expense: type === "expense" ? amount : 0,
//         income: type === "income" ? amount : 0,
//       },
//       update: {
//         // Adjust for old transaction amount
//         expense: {
//           increment: type === "expense" ? amount : 0,
//           decrement: oldTransaction.type === "expense" ? oldTransaction.amount : 0,
//         },
//         income: {
//           increment: type === "income" ? amount : 0,
//           decrement: oldTransaction.type === "income" ? oldTransaction.amount : 0,
//         },
//       },
//     }),

//     // Update year aggregate table
//     prisma.yearHistory.upsert({
//       where: {
//         month_year_userId: {
//           userId: user.id,
//           month: date.getUTCMonth(),
//           year: date.getUTCFullYear(),
//         },
//       },
//       create: {
//         userId: user.id,
//         month: date.getUTCMonth(),
//         year: date.getUTCFullYear(),
//         expense: type === "expense" ? amount : 0,
//         income: type === "income" ? amount : 0,
//       },
//       update: {
//         // Adjust for old transaction amount
//         expense: {
//           increment: type === "expense" ? amount : 0,
//           decrement: oldTransaction.type === "expense" ? oldTransaction.amount : 0,
//         },
//         income: {
//           increment: type === "income" ? amount : 0,
//           decrement: oldTransaction.type === "income" ? oldTransaction.amount : 0,
//         },
//       },
//     }),
//   ]);
// }
