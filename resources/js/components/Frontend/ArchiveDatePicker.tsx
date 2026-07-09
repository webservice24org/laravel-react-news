"use client";

import { useState } from "react";
import React from "react"
import { router } from "@inertiajs/react";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ArchiveDatePickerProps {
    className?: string;
    buttonClassName?: string;
    placeholder?: string;
}

export default function ArchiveDatePicker({
    className = "",
    buttonClassName = "",
    placeholder = "Select archive date",
}: ArchiveDatePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <div className={className}>
            <Popover>

                <PopoverTrigger asChild>

                    <Button
                        variant="outline"
                        className={`w-full justify-between text-left font-normal ${buttonClassName}`}
                    >
                        {date ? format(date, "PPP") : placeholder}

                        <CalendarIcon className="h-4 w-4 opacity-70" />
                    </Button>

                </PopoverTrigger>

                <PopoverContent
                    className="w-auto p-0"
                    align="start"
                >

                    <DayPicker
                        mode="single"
                        className="rounded-lg border"
                        captionLayout="dropdown"
                        selected={date}
                        onSelect={(selectedDate) => {

                            if (!selectedDate) return;

                            setDate(selectedDate);

                            const year = selectedDate.getFullYear();
                            const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                            const day = String(selectedDate.getDate()).padStart(2, "0");

                            router.visit(`/archive/${year}-${month}-${day}`);
                        }}
                    />

                </PopoverContent>

            </Popover>
        </div>
    );
}