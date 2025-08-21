"use client";
/*
 * Documentation:
 * DarkCard — https://app.subframe.com/library?component=DarkCard_cdb98d34-697b-4c64-b34c-f264f693e31e
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface DarkCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DarkCardRoot = React.forwardRef<HTMLDivElement, DarkCardRootProps>(
  function DarkCardRoot(
    { children, className, ...otherProps }: DarkCardRootProps,
    ref
  ) {
    return children ? (
      <div
        className={SubframeUtils.twClassNames(
          "flex w-full flex-col items-start rounded-lg bg-[#26262680] px-6 py-6",
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {children}
      </div>
    ) : null;
  }
);

export const DarkCard = DarkCardRoot;
