"use client";
/*
 * Documentation:
 * AccordionFaq — https://app.subframe.com/library?component=AccordionFaq_14a794a5-d529-4432-bae5-d1c17baedbda
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { FeatherPlus } from "@subframe/core";
import * as SubframeUtils from "../utils";

interface ChevronProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Chevron> {
  className?: string;
}

const Chevron = React.forwardRef<HTMLDivElement, ChevronProps>(function Chevron(
  { className, ...otherProps }: ChevronProps,
  ref
) {
  return (
    <SubframeCore.Collapsible.Chevron {...otherProps}>
      <div
        className={SubframeUtils.twClassNames(
          "flex flex-col items-start rounded-full bg-default-font px-1 py-1",
          className
        )}
        ref={ref}
      >
        <FeatherPlus className="text-button-small font-button-small text-default-font-light" />
      </div>
    </SubframeCore.Collapsible.Chevron>
  );
});

interface ContentProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Content> {
  children?: React.ReactNode;
  className?: string;
}

const Content = React.forwardRef<HTMLDivElement, ContentProps>(function Content(
  { children, className, ...otherProps }: ContentProps,
  ref
) {
  return children ? (
    <SubframeCore.Collapsible.Content asChild={true} {...otherProps}>
      <div
        className={SubframeUtils.twClassNames(
          "flex w-full flex-col items-start gap-2",
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    </SubframeCore.Collapsible.Content>
  ) : null;
});

interface TriggerProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Trigger> {
  children?: React.ReactNode;
  className?: string;
}

const Trigger = React.forwardRef<HTMLDivElement, TriggerProps>(function Trigger(
  { children, className, ...otherProps }: TriggerProps,
  ref
) {
  return children ? (
    <SubframeCore.Collapsible.Trigger asChild={true} {...otherProps}>
      <div
        className={SubframeUtils.twClassNames(
          "flex w-full cursor-pointer flex-col items-start gap-2",
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    </SubframeCore.Collapsible.Trigger>
  ) : null;
});

interface AccordionFaqRootProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Root> {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const AccordionFaqRoot = React.forwardRef<
  HTMLDivElement,
  AccordionFaqRootProps
>(function AccordionFaqRoot(
  { trigger, children, className, ...otherProps }: AccordionFaqRootProps,
  ref
) {
  return (
    <SubframeCore.Collapsible.Root asChild={true} {...otherProps}>
      <div
        className={SubframeUtils.twClassNames(
          "group/14a794a5 flex w-full flex-col items-start rounded-md",
          className
        )}
        ref={ref}
      >
        <Trigger>
          {trigger ? (
            <div className="flex w-full grow shrink-0 basis-0 flex-col items-start group-data-[state=open]/14a794a5:h-auto group-data-[state=open]/14a794a5:w-full group-data-[state=open]/14a794a5:flex-none">
              {trigger}
            </div>
          ) : null}
        </Trigger>
        <Content>
          {children ? (
            <div className="flex w-full grow shrink-0 basis-0 flex-col items-start">
              {children}
            </div>
          ) : null}
        </Content>
      </div>
    </SubframeCore.Collapsible.Root>
  );
});

export const AccordionFaq = Object.assign(AccordionFaqRoot, {
  Chevron,
  Content,
  Trigger,
});
