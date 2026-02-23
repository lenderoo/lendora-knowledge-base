"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Search,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { LenderMultiSelect } from "@/components/expert-rules/lender-multi-select";

interface RestrictedArea {
  id: string;
  suburb: string;
  postcode: string;
  state: string;
  restriction_level: "RESTRICTED" | "WATCHLIST";
  category: string;
  reason: string;
  affected_lenders: string[];
  max_lvr: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];

const CATEGORIES = [
  { value: "HIGH_DENSITY", label: "高密度公寓区" },
  { value: "MINING_TOWN", label: "矿业小镇" },
  { value: "REMOTE_AREA", label: "偏远地区" },
  { value: "BUILDING_DEFECT", label: "建筑缺陷问题" },
  { value: "OTHER", label: "其他" },
];

const RESTRICTION_LEVELS = [
  { value: "RESTRICTED", label: "受限 (RESTRICTED)", color: "bg-red-100 text-red-800" },
  { value: "WATCHLIST", label: "观察名单 (WATCHLIST)", color: "bg-yellow-100 text-yellow-800" },
];

const emptyForm: Omit<RestrictedArea, "id" | "created_at" | "updated_at"> = {
  suburb: "",
  postcode: "",
  state: "NSW",
  restriction_level: "WATCHLIST",
  category: "HIGH_DENSITY",
  reason: "",
  affected_lenders: [],
  max_lvr: null,
  notes: null,
};

export default function RestrictedAreasPage() {
  const [areas, setAreas] = useState<RestrictedArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<RestrictedArea | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/restricted-areas");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAreas(data);
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingArea(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const handleEdit = (area: RestrictedArea) => {
    setEditingArea(area);
    setForm({
      suburb: area.suburb,
      postcode: area.postcode,
      state: area.state,
      restriction_level: area.restriction_level,
      category: area.category,
      reason: area.reason,
      affected_lenders: area.affected_lenders,
      max_lvr: area.max_lvr,
      notes: area.notes,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (area: RestrictedArea) => {
    if (!confirm(`确定删除 ${area.suburb} (${area.postcode})?`)) return;

    try {
      const response = await fetch(`/api/restricted-areas/${area.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("删除成功");
      fetchAreas();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("删除失败");
    }
  };

  const handleSave = async () => {
    if (!form.suburb || !form.postcode || !form.reason) {
      toast.error("请填写必填字段");
      return;
    }

    setSaving(true);
    try {
      const url = editingArea
        ? `/api/restricted-areas/${editingArea.id}`
        : "/api/restricted-areas";
      const method = editingArea ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to save");
      toast.success(editingArea ? "更新成功" : "添加成功");
      setIsDialogOpen(false);
      fetchAreas();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  // Filter areas
  const filteredAreas = areas.filter((area) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !area.suburb.toLowerCase().includes(searchLower) &&
        !area.postcode.includes(search)
      ) {
        return false;
      }
    }
    if (filterState !== "all" && area.state !== filterState) return false;
    if (filterCategory !== "all" && area.category !== filterCategory) return false;
    if (filterLevel !== "all" && area.restriction_level !== filterLevel) return false;
    return true;
  });

  // Group by state for display
  const groupedByState = filteredAreas.reduce((acc, area) => {
    if (!acc[area.state]) acc[area.state] = [];
    acc[area.state].push(area);
    return acc;
  }, {} as Record<string, RestrictedArea[]>);

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const getRestrictionBadge = (level: string) => {
    const config = RESTRICTION_LEVELS.find((l) => l.value === level);
    return (
      <Badge className={config?.color || ""}>
        {level === "RESTRICTED" ? "受限" : "观察"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <MapPin className="h-8 w-8" />
                受限区域管理
              </h1>
              <p className="text-muted-foreground">
                管理银行贷款受限的区域 (Postcode Restrictions)
              </p>
            </div>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            添加区域
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{areas.length}</div>
              <p className="text-sm text-muted-foreground">总区域数</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">
                {areas.filter((a) => a.restriction_level === "RESTRICTED").length}
              </div>
              <p className="text-sm text-muted-foreground">受限区域</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">
                {areas.filter((a) => a.restriction_level === "WATCHLIST").length}
              </div>
              <p className="text-sm text-muted-foreground">观察名单</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">
                {new Set(areas.map((a) => a.state)).size}
              </div>
              <p className="text-sm text-muted-foreground">覆盖州/领地</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label className="text-sm">搜索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="搜索 Suburb 或 Postcode..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-40">
                <Label className="text-sm">州/领地</Label>
                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Label className="text-sm">分类</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Label className="text-sm">限制级别</Label>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {RESTRICTION_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Areas Table */}
        <Card>
          <CardHeader>
            <CardTitle>区域列表 ({filteredAreas.length})</CardTitle>
            <CardDescription>
              点击编辑或删除区域
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                加载中...
              </div>
            ) : filteredAreas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>没有找到匹配的区域</p>
                <Button variant="outline" className="mt-4" onClick={handleAdd}>
                  添加第一个区域
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Suburb</TableHead>
                    <TableHead>Postcode</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>级别</TableHead>
                    <TableHead>最高LVR</TableHead>
                    <TableHead>受影响银行</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAreas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.suburb}</TableCell>
                      <TableCell>{area.postcode}</TableCell>
                      <TableCell>{area.state}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCategoryLabel(area.category)}</Badge>
                      </TableCell>
                      <TableCell>{getRestrictionBadge(area.restriction_level)}</TableCell>
                      <TableCell>
                        {area.max_lvr ? `${area.max_lvr}%` : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {area.affected_lenders.slice(0, 3).map((lender) => (
                            <Badge key={lender} variant="secondary" className="text-xs">
                              {lender}
                            </Badge>
                          ))}
                          {area.affected_lenders.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{area.affected_lenders.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(area)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(area)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingArea ? "编辑受限区域" : "添加受限区域"}
              </DialogTitle>
              <DialogDescription>
                添加或修改银行贷款受限区域信息
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Suburb *</Label>
                  <Input
                    value={form.suburb}
                    onChange={(e) => setForm({ ...form, suburb: e.target.value })}
                    placeholder="如 Sydney CBD"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Postcode *</Label>
                  <Input
                    value={form.postcode}
                    onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                    placeholder="如 2000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Select
                    value={form.state}
                    onValueChange={(v) => setForm({ ...form, state: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>分类 *</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>限制级别 *</Label>
                  <Select
                    value={form.restriction_level}
                    onValueChange={(v) =>
                      setForm({ ...form, restriction_level: v as "RESTRICTED" | "WATCHLIST" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESTRICTION_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label>限制原因 *</Label>
                <Textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="说明为什么该区域受限，如：高密度公寓过剩、矿业周期波动等"
                  rows={2}
                />
              </div>

              {/* Affected Lenders */}
              <div className="space-y-2">
                <Label>受影响银行</Label>
                <LenderMultiSelect
                  value={form.affected_lenders}
                  onChange={(v) => setForm({ ...form, affected_lenders: v })}
                  placeholder="选择受影响的银行..."
                />
              </div>

              {/* Max LVR & Notes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>最高 LVR (%)</Label>
                  <Input
                    type="number"
                    value={form.max_lvr || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        max_lvr: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    placeholder="如 70"
                  />
                </div>
                <div className="space-y-2">
                  <Label>备注</Label>
                  <Input
                    value={form.notes || ""}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value || null })
                    }
                    placeholder="其他备注信息"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "保存中..." : editingArea ? "更新" : "添加"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
