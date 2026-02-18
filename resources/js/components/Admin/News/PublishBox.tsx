import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function PublishBox({ data, setData }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Label>Status:</Label>
        <select className="dark:bg-gray-900"
          value={data.status}
          onChange={(e) => setData("status", e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {data.status === "scheduled" && (
        <div>
          <Label>Scheduled At</Label>
          <Input
            type="datetime-local"
            value={data.scheduled_at || ""}
            onChange={(e) => setData("scheduled_at", e.target.value)}
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <Label>Is Lead?</Label>
        <Switch
          checked={data.is_lead || false}
          onCheckedChange={(value) => setData("is_lead", value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <Label>Is Sub Lead?</Label>
        <Switch
          checked={data.is_sub_lead || false}
          onCheckedChange={(value) => setData("is_sub_lead", value)}
        />
      </div>
    </div>
  )
}
