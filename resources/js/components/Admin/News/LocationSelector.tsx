"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { ChevronsUpDown, X } from "lucide-react"

type Id = number
type Opt = { id: Id; name: string }

type Division = Opt
type District = Opt & { division_id: Id }
type Upazila = Opt & { district_id: Id }
type Union = Opt & { upazila_id: Id }

type Props = {
  data: any
  setData: (key: any, value: any) => void

  divisions: Division[]
  districts: District[]
  upazilas: Upazila[]
  unions: Union[]

  errors?: any
}

export default function LocationSelector({
  data,
  setData,
  divisions = [],
  districts = [],
  upazilas = [],
  unions = [],
  errors = {},
}: Props) {
  // -----------------------------
  // Filters (UI only, not saved)
  // -----------------------------
  const [filterDivisionId, setFilterDivisionId] = useState<Id | null>(null)
  const [filterDistrictId, setFilterDistrictId] = useState<Id | null>(null)
  const [filterUpazilaId, setFilterUpazilaId] = useState<Id | null>(null)

  // -----------------------------
  // Selected unions (saved)
  // data.unions must be number[]
  // -----------------------------
  const selectedUnionIds: Id[] = useMemo(() => {
    const raw = Array.isArray(data.unions) ? data.unions : []
    return raw.map((x: any) => Number(x)).filter((n: number) => Number.isFinite(n))
  }, [data.unions])

  const primaryUnionId: Id | null = data.primary_union_id ? Number(data.primary_union_id) : null

  // -----------------------------
  // Lookup maps
  // -----------------------------
  const divisionById = useMemo(() => new Map(divisions.map((d) => [d.id, d])), [divisions])
  const districtById = useMemo(() => new Map(districts.map((d) => [d.id, d])), [districts])
  const upazilaById = useMemo(() => new Map(upazilas.map((u) => [u.id, u])), [upazilas])
  const unionById = useMemo(() => new Map(unions.map((u) => [u.id, u])), [unions])

  const districtIdFromUpazila = useMemo(() => {
    const m = new Map<Id, Id>()
    upazilas.forEach((u) => m.set(u.id, u.district_id))
    return m
  }, [upazilas])

  const divisionIdFromDistrict = useMemo(() => {
    const m = new Map<Id, Id>()
    districts.forEach((d) => m.set(d.id, d.division_id))
    return m
  }, [districts])

  // -----------------------------
  // Filtered lists (UI)
  // -----------------------------
  const filteredDistricts = useMemo(() => {
    if (!filterDivisionId) return districts
    return districts.filter((d) => d.division_id === filterDivisionId)
  }, [districts, filterDivisionId])

  const filteredUpazilas = useMemo(() => {
    if (!filterDistrictId) return upazilas
    return upazilas.filter((u) => u.district_id === filterDistrictId)
  }, [upazilas, filterDistrictId])

  const filteredUnions = useMemo(() => {
    if (!filterUpazilaId) return unions
    return unions.filter((u) => u.upazila_id === filterUpazilaId)
  }, [unions, filterUpazilaId])

  // -----------------------------
  // WP behavior: selecting union implies parents
  // derive parent IDs from selected unions
  // -----------------------------
  const derivedParents = useMemo(() => {
    const divSet = new Set<Id>()
    const disSet = new Set<Id>()
    const upaSet = new Set<Id>()

    for (const uid of selectedUnionIds) {
      const un = unionById.get(uid)
      if (!un) continue

      const upaId = un.upazila_id
      upaSet.add(upaId)

      const disId = districtIdFromUpazila.get(upaId)
      if (disId) disSet.add(disId)

      const divId = disId ? divisionIdFromDistrict.get(disId) : undefined
      if (divId) divSet.add(divId)
    }

    const divisionsArr = Array.from(divSet).sort((a, b) => a - b)
    const districtsArr = Array.from(disSet).sort((a, b) => a - b)
    const upazilasArr = Array.from(upaSet).sort((a, b) => a - b)

    return { divisions: divisionsArr, districts: districtsArr, upazilas: upazilasArr }
  }, [selectedUnionIds, unionById, districtIdFromUpazila, divisionIdFromDistrict])

  // ✅ Keep parent pivots synced into form
  useEffect(() => {
    setData("divisions", derivedParents.divisions)
    setData("districts", derivedParents.districts)
    setData("upazilas", derivedParents.upazilas)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    derivedParents.divisions.join(","),
    derivedParents.districts.join(","),
    derivedParents.upazilas.join(","),
  ])

  // ✅ If primary union removed, clear it
  useEffect(() => {
    if (primaryUnionId && !selectedUnionIds.includes(primaryUnionId)) {
      setData("primary_union_id", "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUnionIds.join(","), primaryUnionId])

  // -----------------------------
  // Actions
  // -----------------------------
  const toggleUnion = (id: Id) => {
    const next = selectedUnionIds.includes(id)
      ? selectedUnionIds.filter((x) => x !== id)
      : [...selectedUnionIds, id].sort((a, b) => a - b)

    setData("unions", next)

    // if we have no primary yet, auto set first selected as primary
    if (!primaryUnionId && next.length > 0) {
      setData("primary_union_id", String(next[0]))
    }
  }

  const clearAll = () => {
    setData("unions", [])
    setData("primary_union_id", "")
    setData("divisions", [])
    setData("districts", [])
    setData("upazilas", [])
  }

  const formatTrail = (unionId: Id) => {
    const un = unionById.get(unionId)
    if (!un) return "Unknown"

    const upa = upazilaById.get(un.upazila_id)
    const dis = upa ? districtById.get(upa.district_id) : undefined
    const div = dis ? divisionById.get(dis.division_id) : undefined

    return [div?.name, dis?.name, upa?.name, un.name].filter(Boolean).join(" → ")
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Location</Label>
        {selectedUnionIds.length > 0 && (
          <Button type="button" variant="ghost" size="sm" className="h-7 px-2" onClick={clearAll}>
            Clear
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-2 rounded-md border bg-white p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-600">Filters (optional)</span>
          <span className="text-xs text-neutral-500">{selectedUnionIds.length} selected</span>
        </div>

        <div className="space-y-2">
          {/* Division filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="w-full justify-between">
                {filterDivisionId ? divisionById.get(filterDivisionId)?.name : "Filter by division"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search division..." />
                <CommandList>
                  <CommandEmpty>No division found</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="__all_div__"
                      onSelect={() => {
                        setFilterDivisionId(null)
                        setFilterDistrictId(null)
                        setFilterUpazilaId(null)
                      }}
                    >
                      All divisions
                    </CommandItem>

                    {divisions.map((d) => (
                      <CommandItem
                        key={d.id}
                        value={d.name}
                        onSelect={() => {
                          setFilterDivisionId(d.id)
                          setFilterDistrictId(null)
                          setFilterUpazilaId(null)
                        }}
                      >
                        {d.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* District filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="w-full justify-between">
                {filterDistrictId ? districtById.get(filterDistrictId)?.name : "Filter by district"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search district..." />
                <CommandList>
                  <CommandEmpty>No district found</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="__all_dis__"
                      onSelect={() => {
                        setFilterDistrictId(null)
                        setFilterUpazilaId(null)
                      }}
                    >
                      All districts
                    </CommandItem>

                    {filteredDistricts.map((d) => (
                      <CommandItem
                        key={d.id}
                        value={d.name}
                        onSelect={() => {
                          setFilterDistrictId(d.id)
                          setFilterUpazilaId(null)
                        }}
                      >
                        {d.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Upazila filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="w-full justify-between">
                {filterUpazilaId ? upazilaById.get(filterUpazilaId)?.name : "Filter by upazila"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search upazila..." />
                <CommandList>
                  <CommandEmpty>No upazila found</CommandEmpty>
                  <CommandGroup>
                    <CommandItem value="__all_upa__" onSelect={() => setFilterUpazilaId(null)}>
                      All upazilas
                    </CommandItem>

                    {(filterDistrictId ? filteredUpazilas : upazilas).map((u) => (
                      <CommandItem key={u.id} value={u.name} onSelect={() => setFilterUpazilaId(u.id)}>
                        {u.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Union multi-select */}
      <div className="space-y-2 rounded-md border p-2">
        <Label className="text-xs text-neutral-600">Select Unions (multiple)</Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between">
              {selectedUnionIds.length > 0
                ? `${selectedUnionIds.length} union(s) selected`
                : "Choose unions"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-105 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search union..." />
              <CommandList>
                <CommandEmpty>No union found</CommandEmpty>

                <CommandGroup>
                  {filteredUnions.map((u) => {
                    const checked = selectedUnionIds.includes(u.id)

                    return (
                      <CommandItem
                        key={u.id}
                        value={u.name}
                        onSelect={() => toggleUnion(u.id)}
                        className="flex items-start gap-2"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleUnion(u.id)}
                          onClick={(e) => e.stopPropagation()}
                        />

                        <div className="flex-1">
                          <div className="text-sm">{u.name}</div>
                          <div className="text-xs text-neutral-500">{formatTrail(u.id)}</div>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected badges */}
        {selectedUnionIds.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedUnionIds.map((uid) => (
              <Badge key={uid} variant="secondary" className="flex items-center gap-2">
                <span className="text-xs">{formatTrail(uid)}</span>
                <button
                  type="button"
                  className="opacity-70 hover:opacity-100"
                  onClick={() => toggleUnion(uid)}
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {errors?.unions && <p className="text-sm text-red-600">{errors.unions}</p>}
      </div>

      {/* Primary location */}
      <div className="space-y-2 rounded-md border p-3">
        <Label className="text-xs text-neutral-600">Primary Location</Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              disabled={selectedUnionIds.length === 0}
            >
              {primaryUnionId
                ? unionById.get(primaryUnionId)?.name ?? "Primary selected"
                : selectedUnionIds.length > 0
                  ? "Choose primary union"
                  : "Select unions first"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-105 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search selected unions..." />
              <CommandList>
                <CommandEmpty>No match</CommandEmpty>

                <CommandGroup>
                  <CommandItem value="__none__" onSelect={() => setData("primary_union_id", "")}>
                    No primary
                  </CommandItem>

                  {selectedUnionIds.map((uid) => {
                    const u = unionById.get(uid)
                    if (!u) return null
                    return (
                      <CommandItem key={uid} value={u.name} onSelect={() => setData("primary_union_id", String(uid))}>
                        <div className="flex flex-col">
                          <span className="text-sm">{u.name}</span>
                          <span className="text-xs text-neutral-500">{formatTrail(uid)}</span>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {errors?.primary_union_id && <p className="text-sm text-red-600">{errors.primary_union_id}</p>}
      </div>

      {/* Implied parents */}
      <div className="rounded-md border p-3">
        <Label className="text-xs text-neutral-600">Implied Parents (auto)</Label>

        <div className="mt-2 flex flex-wrap gap-1">
          <Badge variant="outline">Divisions: {derivedParents.divisions.length}</Badge>
          <Badge variant="outline">Districts: {derivedParents.districts.length}</Badge>
          <Badge variant="outline">Upazilas: {derivedParents.upazilas.length}</Badge>
          <Badge variant="outline">Unions: {selectedUnionIds.length}</Badge>
        </div>
      </div>
    </div>
  )
}
