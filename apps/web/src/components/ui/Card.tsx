import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = true,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`glass-card rounded-xl p-5 transition-all duration-300 ${
        hoverEffect ? "hover:-translate-y-1 hover:border-slate-600/50 hover:shadow-indigo-500/10" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
