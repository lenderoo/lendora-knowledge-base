"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Plus, X, AlertCircle } from "lucide-react";
import {
  EXPERT_SYSTEM_CATEGORIES,
  getFactorById,
} from "@/lib/expert-factors";
import { LenderMultiSelect } from "./lender-multi-select";
import { KillerCombinationFactor } from "@/types/database";

interface FactorConditionPair {
  factorId: string;
  conditionValues: string[];
}

interface KillerComboFormData {
  factors: FactorConditionPair[];
  description: string;
  expert_reasoning: string;
  solutions: string;
  alternative_lenders: string[];
  confidence_level: string;
  source_notes: string;
}

const emptyFormData: KillerComboFormData = {
  factors: [],
  description: "",
  expert_reasoning: "",
  solutions: "",
  alternative_lenders: [],
  confidence_level: "HIGH",
  source_notes: "",
};

// Output data structure for saving (includes generated names)
export interface KillerComboSaveData {
  name: string;
  name_en: string;
  description: string;
  factors: FactorConditionPair[];
  expert_reasoning: string;
  solutions: string;
  alternative_lenders: string[];
  confidence_level: string;
  source_notes: string;
}

interface KillerComboFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id?: string;
    name: string;
    name_en: string;
    description: string;
    factors: KillerCombinationFactor[];
    expert_reasoning: string;
    solutions: string;
    alternative_lenders: string[] | null;
    confidence_level: string;
    source_notes: string | null;
  } | null;
  onSave: (data: KillerComboSaveData, existingId?: string) => Promise<void>;
}

export function KillerComboForm({
  open,
  onOpenChange,
  initialData,
  onSave,
}: KillerComboFormProps) {
  const [formData, setFormData] = useState<KillerComboFormData>(
    initialData
      ? {
          description: initialData.description,
          factors: initialData.factors as FactorConditionPair[],
          expert_reasoning: initialData.expert_reasoning,
          solutions: initialData.solutions,
          alternative_lenders: initialData.alternative_lenders || [],
          confidence_level: initialData.confidence_level,
          source_notes: initialData.source_notes || "",
        }
      : emptyFormData
  );
  const [isSaving, setIsSaving] = useState(false);

  // Get all factors from all categories for selection
  const allFactors = EXPERT_SYSTEM_CATEGORIES.flatMap((cat) =>
    cat.factors
      .filter((f) => f.inputType === "select" && f.conditions)
      .map((f) => ({
        ...f,
        categoryName: cat.name,
        categoryId: cat.id,
      }))
  );

  // Auto-generate names based on selected factors and conditions
  const generatedNames = useMemo(() => {
    if (formData.factors.length === 0) {
      return { name: "", name_en: "" };
    }

    const nameParts: string[] = [];
    const nameEnParts: string[] = [];

    formData.factors.forEach((f) => {
      const result = getFactorById(f.factorId);
      if (!result) return;

      const { factor } = result;
      // Use factor name for Chinese
      nameParts.push(factor.name);
      // Use factor nameEn for English
      nameEnParts.push(factor.nameEn);
    });

    return {
      name: nameParts.join(" + "),
      name_en: nameEnParts.join(" + "),
    };
  }, [formData.factors]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData(emptyFormData);
    } else if (initialData) {
      setFormData({
        description: initialData.description,
        factors: initialData.factors as FactorConditionPair[],
        expert_reasoning: initialData.expert_reasoning,
        solutions: initialData.solutions,
        alternative_lenders: initialData.alternative_lenders || [],
        confidence_level: initialData.confidence_level,
        source_notes: initialData.source_notes || "",
      });
    }
    onOpenChange(newOpen);
  };

  const addFactorCondition = () => {
    setFormData((prev) => ({
      ...prev,
      factors: [...prev.factors, { factorId: "", conditionValues: [] }],
    }));
  };

  const removeFactorCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      factors: prev.factors.filter((_, i) => i !== index),
    }));
  };

  const updateFactor = (index: number, factorId: string) => {
    setFormData((prev) => ({
      ...prev,
      factors: prev.factors.map((f, i) =>
        i === index ? { factorId, conditionValues: [] } : f
      ),
    }));
  };

  const toggleCondition = (index: number, conditionValue: string) => {
    setFormData((prev) => ({
      ...prev,
      factors: prev.factors.map((f, i) => {
        if (i !== index) return f;
        const values = f.conditionValues.includes(conditionValue)
          ? f.conditionValues.filter((v) => v !== conditionValue)
          : [...f.conditionValues, conditionValue];
        return { ...f, conditionValues: values };
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate at least one factor is selected
    if (formData.factors.length === 0) {
      return;
    }

    setIsSaving(true);
    try {
      const saveData: KillerComboSaveData = {
        name: generatedNames.name,
        name_en: generatedNames.name_en,
        description: formData.description,
        factors: formData.factors,
        expert_reasoning: formData.expert_reasoning,
        solutions: formData.solutions,
        alternative_lenders: formData.alternative_lenders,
        confidence_level: formData.confidence_level,
        source_notes: formData.source_notes,
      };
      await onSave(saveData, initialData?.id);
      setFormData(emptyFormData);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const getFactorConditions = (factorId: string) => {
    const result = getFactorById(factorId);
    if (!result || result.factor.inputType !== "select") return [];
    return result.factor.conditions || [];
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            {initialData ? "编辑必死组合" : "新建必死组合"}
          </DialogTitle>
          <DialogDescription>
            定义多因子联动的 Deal Killer 情况
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Factor Conditions - Move to top since name is auto-generated */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">触发条件组合</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFactorCondition}
              >
                <Plus className="h-4 w-4 mr-1" />
                添加因子
              </Button>
            </div>

            {formData.factors.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                点击"添加因子"来定义触发条件
              </p>
            )}

            {formData.factors.map((factorCond, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 bg-red-50/30"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">因子 {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFactorCondition(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Select
                  value={factorCond.factorId}
                  onValueChange={(v) => updateFactor(index, v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择因子..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allFactors.map((factor) => (
                      <SelectItem key={factor.id} value={factor.id}>
                        <span className="text-muted-foreground text-xs mr-2">
                          [{factor.categoryName}]
                        </span>
                        {factor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {factorCond.factorId && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      选择触发条件 (可多选)
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {getFactorConditions(factorCond.factorId).map((cond) => (
                        <Badge
                          key={cond.value}
                          variant={
                            factorCond.conditionValues.includes(cond.value)
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer ${
                            factorCond.conditionValues.includes(cond.value)
                              ? "bg-red-600 hover:bg-red-700"
                              : "hover:bg-red-100"
                          }`}
                          onClick={() => toggleCondition(index, cond.value)}
                        >
                          {cond.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Separator />

          {/* Expert Logic */}
          <div className="space-y-4">
            <h3 className="font-semibold">专家逻辑</h3>
            <div className="space-y-2">
              <Label>专家逻辑解析 *</Label>
              <Textarea
                value={formData.expert_reasoning}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expert_reasoning: e.target.value,
                  }))
                }
                placeholder="为什么这个组合是 Deal Killer，银行的考量是什么"
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>解决方案 *</Label>
              <Textarea
                value={formData.solutions}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, solutions: e.target.value }))
                }
                placeholder="遇到这种情况应该怎么处理，有没有替代方案"
                rows={3}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Alternative Lenders */}
          <div className="space-y-4">
            <h3 className="font-semibold">替代方案</h3>
            <div className="space-y-2">
              <Label>可能接受的替代 Lender (Non-Prime)</Label>
              <LenderMultiSelect
                value={formData.alternative_lenders}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, alternative_lenders: v }))
                }
                placeholder="选择可能接受的 Non-Prime Lender..."
              />
            </div>
          </div>

          <Separator />

          {/* Source */}
          <div className="space-y-4">
            <h3 className="font-semibold">来源标注</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>置信度</Label>
                <Select
                  value={formData.confidence_level}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, confidence_level: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">高置信度 (银行政策)</SelectItem>
                    <SelectItem value="LOW">低置信度 (Exception经验)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>来源备注</Label>
                <Input
                  value={formData.source_notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, source_notes: e.target.value }))
                  }
                  placeholder="例如：多家银行 BDM 确认"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700">
              {isSaving ? "保存中..." : initialData ? "更新" : "创建"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
