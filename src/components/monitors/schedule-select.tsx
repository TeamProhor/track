"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ScheduleSelect({
  defaultValue = "300",
}: {
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <>
      <input type="hidden" name="schedule" value={value} />
      <Select value={value} onValueChange={(val) => val && setValue(val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="চেকিং ব্যবধান নির্বাচন করুন" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="300">৫ মিনিট (300s)</SelectItem>
          <SelectItem value="900">১৫ মিনিট (900s)</SelectItem>
          <SelectItem value="1800">৩০ মিনিট (1800s)</SelectItem>
          <SelectItem value="3600">১ ঘণ্টা (3600s)</SelectItem>
          <SelectItem value="21600">৬ ঘণ্টা (21600s)</SelectItem>
          <SelectItem value="86400">২৪ ঘণ্টা (86400s)</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
