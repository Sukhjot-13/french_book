import React from "react";
import { ListSkeleton } from "@/src/components/ui/ListSkeleton";

export default function Loading() {
  return <ListSkeleton rows={8} label="Loading examples" />;
}
