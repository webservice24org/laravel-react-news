import { useState } from "react";
import { router } from "@inertiajs/react";
import { Switch } from "@/components/ui/switch";

interface DistrictStatusToggleProps {
  district: {
    id: number;
    status: boolean;
  };
}

export default function DistrictStatusToggle({ district }: DistrictStatusToggleProps) {
  const [checked, setChecked] = useState(district.status);
  const [loading, setLoading] = useState(false);

  const toggleStatus = () => {
    const newStatus = !checked;
    setChecked(newStatus); // optimistic update
    setLoading(true);

    router.patch(`/admin/districts/${district.id}/toggle-status`, { status: newStatus }, {
      preserveScroll: true,
      onError: () => setChecked(checked), // revert if failed
      onFinish: () => setLoading(false),
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={toggleStatus}
        disabled={loading}
      />
      <span
        className={`text-xs font-medium ${
          checked
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {checked ? "Active" : "Inactive"}
      </span>
    </div>
  );
}
