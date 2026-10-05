import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", ...props }) => {
  return (
    <div
      className={`bg-slate-800/60 rounded-lg animate-shimmer ${className}`}
      {...props}
    />
  );
};
