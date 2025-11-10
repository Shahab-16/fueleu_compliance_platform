// frontend/src/adapters/ui/components/Card.tsx
import React from "react";

type Props = {
  title?: string;
  value?: React.ReactNode;
  color?: string;
  children?: React.ReactNode;
};

export default function Card({ title, value, color = "bg-white", children }: Props) {
  return (
    <div className={`p-4 rounded-lg shadow-sm ${color}`}>
      {title && <div className="text-sm text-gray-600">{title}</div>}
      {value !== undefined && <div className="text-2xl font-semibold mt-1">{value}</div>}
      {children}
    </div>
  );
}
