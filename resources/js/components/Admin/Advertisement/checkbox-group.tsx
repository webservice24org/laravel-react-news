import { Checkbox } from "@/components/ui/checkbox"

interface Item {
  id: number
  name: string
}

interface Props {
  items: Item[]
  selected: number[]
  onChange: (values: number[]) => void
}

export default function CheckboxGroup({ items, selected, onChange }: Props) {

  const toggle = (id: number, checked: boolean) => {

    if (checked) {
      onChange([...selected, id])
    } else {
      onChange(selected.filter((itemId) => itemId !== id))
    }

  }

  return (

    <div className="grid grid-cols-3 gap-3 mt-3">

      {items.map((item) => (

        <div key={item.id} className="flex items-center gap-2">

          <Checkbox
            checked={selected.includes(item.id)}
            onCheckedChange={(checked) => toggle(item.id, !!checked)}
          />

          <span>{item.name}</span>

        </div>

      ))}

    </div>

  )

}