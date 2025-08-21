"use client";
/*
 * Documentation:
 * DarkSectionWithHeading — https://app.subframe.com/library?component=DarkSectionWithHeading_b8c84d74-d9f0-4e9b-a0b4-9a2102d729e4
 * Icon with background — https://app.subframe.com/library?component=Icon+with+background_c5d68c0e-4c0c-4cff-8d8c-6ff334859b3a
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { FeatherPlus } from "@subframe/core";
import * as SubframeUtils from "../utils";
import { IconWithBackground } from "./IconWithBackground";

interface DarkSectionWithHeadingRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  overlineText?: React.ReactNode;
  sectionHeading?: React.ReactNode;
  numberText?: React.ReactNode;
  children?: React.ReactNode;
  variant?: "default" | "empty";
  className?: string;
}

const DarkSectionWithHeadingRoot = React.forwardRef<
  HTMLDivElement,
  DarkSectionWithHeadingRootProps
>(function DarkSectionWithHeadingRoot(
  {
    icon = <FeatherPlus />,
    overlineText,
    sectionHeading,
    numberText,
    children,
    variant = "default",
    className,
    ...otherProps
  }: DarkSectionWithHeadingRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "group/b8c84d74 flex w-full flex-col items-start gap-2 rounded-lg bg-neutral-50 px-6 py-6",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-transparent px-6 py-6" />
        <div
          className={SubframeUtils.twClassNames(
            "flex w-full items-start gap-2 py-12",
            { hidden: variant === "empty" }
          )}
        >
          <IconWithBackground
            variant="light"
            size="x-small"
            icon={icon}
            square={false}
          />
          {overlineText ? (
            <span className="text-overline font-overline text-default-font-light">
              {overlineText}
            </span>
          ) : null}
          <div className="flex grow shrink-0 basis-0 items-start gap-2 pl-12 pr-2">
            {sectionHeading ? (
              <span
                className={SubframeUtils.twClassNames(
                  "font-['Outfit'] text-[99px] font-[500] leading-[99px] tracking-tight text-default-font-light",
                  { inline: variant === "empty" }
                )}
              >
                {sectionHeading}
              </span>
            ) : null}
            {numberText ? (
              <span className="text-display-text-large font-display-text-large text-subtext-color">
                {numberText}
              </span>
            ) : null}
          </div>
        </div>
        {children ? (
          <div className="flex w-full flex-col items-start gap-2 px-2 py-2">
            {children}
          </div>
        ) : null}
        <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-transparent px-6 py-6" />
      </div>
    </div>
  );
});

export const DarkSectionWithHeading = DarkSectionWithHeadingRoot;
