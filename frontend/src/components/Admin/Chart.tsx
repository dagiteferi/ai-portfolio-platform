import * as React from "react"

const ChartContainer = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

const ChartTooltipContent = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

const Chart = ({ type = 'bar' }: { type?: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg border border-dashed border-muted-foreground/20">
      <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
        {type} chart placeholder
      </p>
    </div>
  );
};

export { ChartContainer, ChartTooltipContent, Chart };
