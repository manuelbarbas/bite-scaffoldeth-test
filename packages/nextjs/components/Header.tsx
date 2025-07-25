"use client";

import React from "react";
import Link from "next/link";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 shrink-0 justify-center z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-center">
        <Link href="/" passHref className="flex items-center gap-2">
          <div className="flex flex-col text-center">
            <span className="font-bold leading-tight text-2xl text-white">BITE Mint Token DApp</span>
            <span className="text-sm text-white">Scaffold-ETH Integration</span>
          </div>
        </Link>
      </div>
    </div>
  );
};
