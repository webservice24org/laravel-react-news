declare function route(
  name: string,
  params?: any
): string

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

interface Props {
  subCategory: any;
}

export default function SubCategoryStatusToggle({ subCategory }: Props) {
  const [status, setStatus] = useState(subCategory.status);
  const [loading, setLoading] = useState(false);

  const toggleStatus = () => {
    setLoading(true);

    router.patch(
      route("admin.subcategories.toggle-status", { subCategory: subCategory.id }),
      {},
      {
        onSuccess: () => {
          setStatus(!status); // update local state
          setLoading(false);
          toast.success(`Status updated to ${!status ? "Active" : "Inactive"}`);
        },
        onError: () => {
          setLoading(false);
          toast.error("Failed to update status");
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={status} // use state instead of prop
        onCheckedChange={toggleStatus} // fixed function name
        disabled={loading} // disable while loading
      />
      <span
        className={`text-xs font-medium ${
          status ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        }`}
      >
        {status ? "Active" : "Inactive"}
      </span>
    </div>
  );
}
