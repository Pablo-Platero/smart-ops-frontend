import React from "react";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export default function Card({ className = "", children }: CardProps) {
  return <div className={["card", className].join(" ")}>{children}</div>;
}