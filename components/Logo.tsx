import { HandCoins } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      {/* Icon with Updated Orange Color */}
      <HandCoins className="h-8 w-8 text-orange-600 dark:text-orange-400" />
      {/* Website Name with Updated Color */}
      <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
        Motion-Budget
      </span>
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href="/" className="flex items-center">
      {/* Mobile Logo with Updated Orange Gradient */}
      <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-2xl font-bold text-transparent">
        BudgetFlow
      </span>
    </a>
  );
}

export default Logo;
