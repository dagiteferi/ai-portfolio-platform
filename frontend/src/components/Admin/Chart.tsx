import * as React from "react"

const ChartContainer = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

const ChartTooltipContent = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

export { ChartContainer, ChartTooltipContent };
