import React from "react";
import { ListSkeleton } from "@/src/components/ui/ListSkeleton";

export default function Loading() {
  return <ListSkeleton rows={10} label="Loading vocabulary" />;
}
