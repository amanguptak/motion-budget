// import Logo from "@/components/Logo";
// import React, { ReactNode } from "react";

// function layout({ children }: { children: ReactNode }) {
//   return (
//     <div className="relative flex h-screen w-full flex-col items-center justify-center">
//       <Logo />
//       <div className="mt-12">{children}</div>
//     </div>
//   );
// }

// export default layout;

import Logo from "@/components/Logo";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center 
                 bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100 px-4"
    >
      {/* Logo Section */}
      <Logo />

      {/* Slogan */}
      <h1
        className="mt-6 text-2xl sm:text-4xl font-extrabold text-center 
             text-orange-400 dark:text-orange-500"
      >
        Track. Save. Grow.
      </h1>

      {/* Subtext */}
      <p
        className="mt-4 text-lg sm:text-xl text-center max-w-2xl 
             text-gray-700 dark:text-gray-400"
      >
        Your all-in-one budgeting app.
      </p>

      {/* Main Content */}
      <div className="mt-12 w-full max-w-4xl mx-auto flex justify-center items-center mb-10">
        {children}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-gray-600  dark:text-gray-400">
        Created by Aman Gupta
      </footer>
    </div>
  );
}

export default layout;
