"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ExpertRule, ExpertRuleInsert } from "@/types/database";
import {
  EXPERT_CATEGORIES,
  EXPERT_RISK_LEVELS,
  CONFIDENCE_LEVELS,
} from "@/lib/constants";
import { LenderMultiSelect } from "./lender-multi-select";
import { ArrayInput } from "./array-input";

interface ExpertRuleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ExpertRule | null;
  onSave: (data: ExpertRuleInsert) => Promise<void>;
}

const emptyFormData: ExpertRuleInsert = {
  category: "",
  factor: "",
  risk_level: "",
  scenario: "",
  expert_reasoning: "",
  solutions: "",
  friendly_lenders: [],
  avoid_lenders: [],
  required_documents: [],
  clarifying_questions: [],
  confidence_level: "",
  source_notes: "",
};

export function ExpertRuleForm({
  open,
  onOpenChange,
  initialData,
  onSave,
}: ExpertRuleFormProps) {
  const [formData, setFormData] = useState<ExpertRuleInsert>(
    initialData
      ? {
          category: initialData.category,
          factor: initialData.factor,
          risk_level: initialData.risk_level,
          scenario: initialData.scenario,
          expert_reasoning: initialData.expert_reasoning,
          solutions: initialData.solutions,
          friendly_lenders: initialData.friendly_lenders || [],
          avoid_lenders: initialData.avoid_lenders || [],
          required_documents: initialData.required_documents || [],
          clarifying_questions: initialData.clarifying_questions || [],
          confidence_level: initialData.confidence_level,
          source_notes: initialData.source_notes || "",
        }
      : emptyFormData
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = <K extends keyof ExpertRuleInsert>(
    field: K,
    value: ExpertRuleInsert[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      setFormData(emptyFormData);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData(emptyFormData);
    }
    onOpenChange(newOpen);
  };

  // Reset form when initialData changes
  if (open && initialData && formData.category === "" && initialData.category !== "") {
    setFormData({
      category: initialData.category,
      factor: initialData.factor,
      risk_level: initialData.risk_level,
      scenario: initialData.scenario,
      expert_reasoning: initialData.expert_reasoning,
      solutions: initialData.solutions,
      friendly_lenders: initialData.friendly_lenders || [],
      avoid_lenders: initialData.avoid_lenders || [],
      required_documents: initialData.required_documents || [],
      clarifying_questions: initialData.clarifying_questions || [],
      confidence_level: initialData.confidence_level,
      source_notes: initialData.source_notes || "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "编辑专家规则" : "新建专家规则"}
          </DialogTitle>
          <DialogDescription>
            录入专家逻辑块，用于训练 AI 系统
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: 基础信息 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">基础信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">维度分类 *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => handleChange("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="factor">关键因子 *</Label>
                <Input
                  id="factor"
                  value={formData.factor}
                  onChange={(e) => handleChange("factor", e.target.value)}
                  placeholder="例如：ABN 注册时长"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="risk_level">风险等级 *</Label>
                <Select
                  value={formData.risk_level}
                  onValueChange={(v) => handleChange("risk_level", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择风险等级" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERT_RISK_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: 场景与评估 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">场景与评估</h3>

            <div className="space-y-2">
              <Label htmlFor="scenario">具体场景 *</Label>
              <Textarea
                id="scenario"
                value={formData.scenario}
                onChange={(e) => handleChange("scenario", e.target.value)}
                placeholder="描述一个具体的变量情况，例如：客户自雇，ABN 注册在 12 至 18 个月之间"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expert_reasoning">专家逻辑解析 *</Label>
              <Textarea
                id="expert_reasoning"
                value={formData.expert_reasoning}
                onChange={(e) => handleChange("expert_reasoning", e.target.value)}
                placeholder="解释为什么这是个问题，核心顾虑是什么，判断标准是什么"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solutions">对策建议 *</Label>
              <Textarea
                id="solutions"
                value={formData.solutions}
                onChange={(e) => handleChange("solutions", e.target.value)}
                placeholder="给 Junior Broker 的具体操作指令，包括优先选择、备选方案、关键操作等"
                rows={4}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Section 3: 银行偏好 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">银行偏好</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>友好银行 (推荐)</Label>
                <LenderMultiSelect
                  value={formData.friendly_lenders || []}
                  onChange={(v) => handleChange("friendly_lenders", v)}
                  placeholder="选择友好银行..."
                />
              </div>

              <div className="space-y-2">
                <Label>规避银行 (不推荐)</Label>
                <LenderMultiSelect
                  value={formData.avoid_lenders || []}
                  onChange={(v) => handleChange("avoid_lenders", v)}
                  placeholder="选择需规避的银行..."
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 4: 补充信息 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">补充信息</h3>

            <div className="space-y-2">
              <Label>必备材料清单</Label>
              <ArrayInput
                value={formData.required_documents || []}
                onChange={(v) => handleChange("required_documents", v)}
                placeholder="添加所需材料，按 Enter 确认"
              />
            </div>

            <div className="space-y-2">
              <Label>反问话术 (追问客户的问题)</Label>
              <ArrayInput
                value={formData.clarifying_questions || []}
                onChange={(v) => handleChange("clarifying_questions", v)}
                placeholder="添加追问问题，按 Enter 确认"
              />
            </div>
          </div>

          <Separator />

          {/* Section 5: 来源标注 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">来源标注</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="confidence_level">置信度 *</Label>
                <Select
                  value={formData.confidence_level}
                  onValueChange={(v) => handleChange("confidence_level", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择置信度" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONFIDENCE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source_notes">来源备注</Label>
                <Input
                  id="source_notes"
                  value={formData.source_notes || ""}
                  onChange={(e) => handleChange("source_notes", e.target.value)}
                  placeholder="例如：ANZ Policy 2024, BDM 确认"
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
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
