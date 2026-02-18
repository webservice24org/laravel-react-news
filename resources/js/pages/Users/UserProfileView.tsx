import { Head } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/layouts/app-layout";

interface UserProfileProps {
  user: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: { id: number; name: string }[];
    profile?: {
      profile_photo?: string;
      address?: string;
      about?: string;
      dob?: string;
      nid_number?: string;
      mobile_number?: string;
    } | null;
  };
}

export default function UserProfileView({ user }: UserProfileProps) {
  const profile = user.profile;

  return (
    <AppLayout breadcrumbs={[{ title: "User Profile", href: `/admin/users/${user.id}/view` }]}>
      <Head title="User Profile" />

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          {profile?.profile_photo && (
            <img
              src={`/storage/${profile.profile_photo}`}
              alt="Profile Photo"
              className="h-24 w-24 rounded-full object-cover border"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-1 flex gap-1">
              {user.roles.map((role) => (
                <Badge key={role.id} variant="secondary">{role.name}</Badge>
              ))}
            </div>
            <div className="mt-1">
              <span className={user.is_active ? "text-green-600" : "text-red-600"}>
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <h3 className="font-semibold">Profile Details</h3>
          <p><strong>Address:</strong> {profile?.address || "—"}</p>
          <p><strong>About:</strong> {profile?.about || "—"}</p>
          <p><strong>Date of Birth:</strong> {profile?.dob || "—"}</p>
          <p><strong>NID Number:</strong> {profile?.nid_number || "—"}</p>
          <p><strong>Mobile Number:</strong> {profile?.mobile_number || "—"}</p>
        </div>

      </div>
    </AppLayout>
  );
}
