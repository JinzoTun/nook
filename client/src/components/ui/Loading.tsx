
import React from "react";

export const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-6 h-6 border-4 border-grey-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
