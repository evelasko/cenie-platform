"use client";
/*
 * Documentation:
 * QuarterColumnLayout — https://app.subframe.com/library?component=QuarterColumnLayout_2edff21d-6e1b-455c-a83b-e2d99e03dcce
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface QuarterColumnLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  padded?: "default" | "large";
  mobile?: boolean;
  className?: string;
}

const QuarterColumnLayoutRoot = React.forwardRef<
  HTMLDivElement,
  QuarterColumnLayoutRootProps
>(function QuarterColumnLayoutRoot(
  {
    padded = "default",
    mobile = false,
    className,
    ...otherProps
  }: QuarterColumnLayoutRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "group/2edff21d flex w-full flex-col items-start",
        { "px-6 py-6": padded === "large" },
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div
        className={SubframeUtils.twClassNames(
          "flex w-full items-start gap-1 bg-error-600 md:flex-row",
          { "flex-col flex-nowrap gap-1": mobile }
        )}
      >
        <div
          className={SubframeUtils.twClassNames(
            "flex flex-col items-start gap-1 bg-brand-600 w-[25%] max-w-300px",
            {
              "h-auto w-full flex-none": mobile,
              "w-[24%] max-w-300px": padded === "large",
            }
          )}
        >
          <span className="w-full text-body font-body text-default-font">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non
            blandit libero. Duis blandit condimentum urna vel consequat. Nulla
            rhoncus dapibus imperdiet. Nullam sit amet orci vel justo porttitor
            accumsan eu quis risus. Phasellus mollis scelerisque varius.
            Pellentesque sed augue egestas, feugiat purus id, feugiat eros.
            Morbi gravida mi id velit venenatis congue.
          </span>
        </div>
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 bg-success-600">
          <span className="w-full text-body font-body text-default-font">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non
            blandit libero. Duis blandit condimentum urna vel consequat. Nulla
            rhoncus dapibus imperdiet. Nullam sit amet orci vel justo porttitor
            accumsan eu quis risus. Phasellus mollis scelerisque varius.
            Pellentesque sed augue egestas, feugiat purus id, feugiat eros.
            Morbi gravida mi id velit venenatis congue.
          </span>
        </div>
      </div>
    </div>
  );
});

export const QuarterColumnLayout = QuarterColumnLayoutRoot;
