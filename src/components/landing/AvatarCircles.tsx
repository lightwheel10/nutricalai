"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: string[];
}

function AvatarCircles({
  numPeople,
  className,
  avatarUrls,
}: AvatarCirclesProps) {
  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <Avatar key={index} className="border-2 border-white dark:border-gray-800">
          <AvatarImage src={url} alt={`Avatar ${index + 1}`} />
          <AvatarFallback>{`A${index + 1}`}</AvatarFallback>
        </Avatar>
      ))}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
      >
        +{numPeople}
      </div>
    </div>
  );
}

export default AvatarCircles;
