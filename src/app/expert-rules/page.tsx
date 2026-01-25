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
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  Download,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ExpertRule } from "@/types/database";
import {
  EXPERT_SYSTEM_CATEGORIES,
  CategoryDefinition,
  FactorDefinition,
  ConditionOption,
} from "@/lib/expert-factors";
import { LenderMultiSelect } from "@/components/expert-rules/lender-multi-select";
import { ArrayInput } from "@/components/expert-rules/array-input";

// 风险等级图标
const RiskIcon = ({ level }: { level: string }) => {
  switch (level) {
    case "STOP":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "HIGH":
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case "MEDIUM":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "LOW":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return null;
  }
};

const getRiskBadgeClass = (level: string) => {
  switch (level) {
    case "STOP":
      return "bg-red-100 text-red-800 border-red-300";
    case "HIGH":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "LOW":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "";
  }
};

const getRiskLabel = (level: string) => {
  switch (level) {
    case "STOP":
      return "🔴 Deal Killer";
    case "HIGH":
      return "🟠 High Risk";
    case "MEDIUM":
      return "🟡 Medium";
    case "LOW":
      return "🟢 Low Risk";
    default:
      return level;
  }
};

// 每个 factor+condition 组合的表单数据
interface ConditionFormData {
  expert_reasoning: string;
  solutions: string;
  friendly_lenders: string[];
  avoid_lenders: string[];
  required_documents: string[];
  clarifying_questions: string[];
  confidence_level: string;
  source_notes: string;
}

const emptyConditionFormData: ConditionFormData = {
  expert_reasoning: "",
  solutions: "",
  friendly_lenders: [],
  avoid_lenders: [],
  required_documents: [],
  clarifying_questions: [],
  confidence_level: "HIGH",
  source_notes: "",
};

// 生成唯一的 key: factorId__conditionValue
function getConditionKey(factorId: string, conditionValue: string): string {
  return `${factorId}__${conditionValue}`;
}

export default function ExpertRulesPage() {
  const [activeCategory, setActiveCategory] = useState(EXPERT_SYSTEM_CATEGORIES[0].id);
  const [expandedFactors, setExpandedFactors] = useState<Set<string>>(new Set());
  const [expandedConditions, setExpandedConditions] = useState<Set<string>>(new Set());
  const [conditionForms, setConditionForms] = useState<Record<string, ConditionFormData>>({});
  const [savedRules, setSavedRules] = useState<ExpertRule[]>([]);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch("/api/expert-rules");
      if (!response.ok) throw new Error("Failed to fetch rules");
      const data = await response.json();
      setSavedRules(data);

      // 初始化已保存的规则到表单 (使用 factor + scenario 作为 key)
      const formsFromSaved: Record<string, ConditionFormData> = {};
      data.forEach((rule: ExpertRule) => {
        const key = getConditionKey(rule.factor, rule.scenario);
        formsFromSaved[key] = {
          expert_reasoning: rule.expert_reasoning,
          solutions: rule.solutions,
          friendly_lenders: rule.friendly_lenders || [],
          avoid_lenders: rule.avoid_lenders || [],
          required_documents: rule.required_documents || [],
          clarifying_questions: rule.clarifying_questions || [],
          confidence_level: rule.confidence_level,
          source_notes: rule.source_notes || "",
        };
      });
      setConditionForms(formsFromSaved);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  const toggleFactor = (factorId: string) => {
    const newExpanded = new Set(expandedFactors);
    if (newExpanded.has(factorId)) {
      newExpanded.delete(factorId);
    } else {
      newExpanded.add(factorId);
    }
    setExpandedFactors(newExpanded);
  };

  const toggleCondition = (key: string) => {
    const newExpanded = new Set(expandedConditions);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedConditions(newExpanded);
  };

  const updateConditionForm = (
    key: string,
    field: keyof ConditionFormData,
    value: ConditionFormData[keyof ConditionFormData]
  ) => {
    setConditionForms((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || emptyConditionFormData),
        [field]: value,
      },
    }));
  };

  const getConditionForm = (key: string): ConditionFormData => {
    return conditionForms[key] || emptyConditionFormData;
  };

  const handleSaveCondition = async (
    category: CategoryDefinition,
    factor: FactorDefinition,
    condition: ConditionOption
  ) => {
    const key = getConditionKey(factor.id, condition.value);
    const form = getConditionForm(key);

    // 验证必填字段
    if (!form.expert_reasoning) {
      toast.error("请填写专家逻辑解析");
      return;
    }
    if (!form.solutions) {
      toast.error("请填写对策建议");
      return;
    }

    setSavingKey(key);

    try {
      // 检查是否已存在 (通过 factor + scenario)
      const existingRule = savedRules.find(
        (r) => r.factor === factor.id && r.scenario === condition.value
      );

      const payload = {
        category: category.id,
        factor: factor.id,
        risk_level: condition.riskLevel,
        scenario: condition.value,
        expert_reasoning: form.expert_reasoning,
        solutions: form.solutions,
        friendly_lenders: form.friendly_lenders,
        avoid_lenders: form.avoid_lenders,
        required_documents: form.required_documents,
        clarifying_questions: form.clarifying_questions,
        confidence_level: form.confidence_level,
        source_notes: form.source_notes,
      };

      const url = existingRule
        ? `/api/expert-rules/${existingRule.id}`
        : "/api/expert-rules";
      const method = existingRule ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "保存失败");
      }

      toast.success(`${condition.label} 保存成功`);
      fetchRules();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSavingKey(null);
    }
  };

  const handleExportAll = () => {
    window.open("/api/expert-rules/export", "_blank");
  };

  const handleExportCategory = (categoryId: string) => {
    window.open(`/api/expert-rules/export?category=${categoryId}`, "_blank");
  };

  const isConditionSaved = (factorId: string, conditionValue: string) => {
    return savedRules.some(
      (r) => r.factor === factorId && r.scenario === conditionValue
    );
  };

  // 统计每个 category 中已保存的条件数量
  const getCategorySavedCount = (categoryId: string) => {
    const category = EXPERT_SYSTEM_CATEGORIES.find((c) => c.id === categoryId);
    if (!category) return { saved: 0, total: 0 };

    let total = 0;
    let saved = 0;

    category.factors.forEach((factor) => {
      if (factor.inputType === "select" && factor.conditions) {
        total += factor.conditions.length;
        factor.conditions.forEach((cond) => {
          if (isConditionSaved(factor.id, cond.value)) {
            saved++;
          }
        });
      } else {
        // text 类型的 factor 算一个
        total += 1;
        if (savedRules.some((r) => r.factor === factor.id)) {
          saved++;
        }
      }
    });

    return { saved, total };
  };

  // 统计 factor 中已保存的条件数量
  const getFactorSavedCount = (factor: FactorDefinition) => {
    if (factor.inputType === "select" && factor.conditions) {
      const total = factor.conditions.length;
      const saved = factor.conditions.filter((cond) =>
        isConditionSaved(factor.id, cond.value)
      ).length;
      return { saved, total };
    }
    return { saved: savedRules.some((r) => r.factor === factor.id) ? 1 : 0, total: 1 };
  };

  const currentCategory = EXPERT_SYSTEM_CATEGORIES.find((c) => c.id === activeCategory);

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
              <h1 className="text-3xl font-bold">专家逻辑矩阵</h1>
              <p className="text-muted-foreground">
                Expert System - 每个情况对应独立的专家逻辑
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            导出全部 Markdown
          </Button>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {EXPERT_SYSTEM_CATEGORIES.map((cat) => {
            const { saved, total } = getCategorySavedCount(cat.id);
            return (
              <Card
                key={cat.id}
                className={`cursor-pointer transition-all ${
                  activeCategory === cat.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">
                    {saved}/{total}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{cat.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Category Content */}
        {currentCategory && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {currentCategory.name}
                    <span className="text-muted-foreground font-normal ml-2">
                      ({currentCategory.nameEn})
                    </span>
                  </CardTitle>
                  <CardDescription>{currentCategory.description}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportCategory(currentCategory.id)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  导出此板块
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCategory.factors.map((factor) => {
                const isFactorExpanded = expandedFactors.has(factor.id);
                const { saved, total } = getFactorSavedCount(factor);

                return (
                  <div key={factor.id} className="border rounded-lg">
                    {/* Factor Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleFactor(factor.id)}
                    >
                      <div className="flex items-center gap-3">
                        {isFactorExpanded ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{factor.name}</span>
                            <span className="text-sm text-muted-foreground">
                              ({factor.nameEn})
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {factor.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant={saved === total ? "default" : "secondary"}>
                        {saved}/{total} 已录入
                      </Badge>
                    </div>

                    {/* Factor Conditions List */}
                    {isFactorExpanded && factor.inputType === "select" && factor.conditions && (
                      <div className="border-t">
                        {factor.conditions.map((condition) => {
                          const condKey = getConditionKey(factor.id, condition.value);
                          const isCondExpanded = expandedConditions.has(condKey);
                          const isSaved = isConditionSaved(factor.id, condition.value);
                          const form = getConditionForm(condKey);

                          return (
                            <div
                              key={condition.value}
                              className={`border-b last:border-b-0 ${
                                isSaved ? "bg-green-50/50" : ""
                              }`}
                            >
                              {/* Condition Header */}
                              <div
                                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30"
                                onClick={() => toggleCondition(condKey)}
                              >
                                <div className="flex items-center gap-3 pl-8">
                                  {isCondExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                  <RiskIcon level={condition.riskLevel} />
                                  <span className="text-sm">{condition.label}</span>
                                  {isSaved && (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-100 text-green-800 text-xs"
                                    >
                                      已录入
                                    </Badge>
                                  )}
                                </div>
                                <Badge className={getRiskBadgeClass(condition.riskLevel)}>
                                  {getRiskLabel(condition.riskLevel)}
                                </Badge>
                              </div>

                              {/* Condition Form */}
                              {isCondExpanded && (
                                <div className="px-4 pb-4 pt-2 ml-12 space-y-4 bg-muted/20">
                                  {/* Expert Reasoning */}
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                      专家逻辑解析 *
                                    </Label>
                                    <Textarea
                                      value={form.expert_reasoning}
                                      onChange={(e) =>
                                        updateConditionForm(condKey, "expert_reasoning", e.target.value)
                                      }
                                      placeholder="解释为什么这是个问题，核心顾虑是什么，判断标准是什么"
                                      rows={3}
                                    />
                                  </div>

                                  {/* Solutions */}
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                      对策建议 *
                                    </Label>
                                    <Textarea
                                      value={form.solutions}
                                      onChange={(e) =>
                                        updateConditionForm(condKey, "solutions", e.target.value)
                                      }
                                      placeholder="给 Junior Broker 的具体操作指令"
                                      rows={3}
                                    />
                                  </div>

                                  <Separator />

                                  {/* Lender Preferences */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm">友好银行</Label>
                                      <LenderMultiSelect
                                        value={form.friendly_lenders}
                                        onChange={(v) =>
                                          updateConditionForm(condKey, "friendly_lenders", v)
                                        }
                                        placeholder="选择友好银行..."
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm">规避银行</Label>
                                      <LenderMultiSelect
                                        value={form.avoid_lenders}
                                        onChange={(v) =>
                                          updateConditionForm(condKey, "avoid_lenders", v)
                                        }
                                        placeholder="选择需规避的银行..."
                                      />
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* Supporting Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm">必备材料</Label>
                                      <ArrayInput
                                        value={form.required_documents}
                                        onChange={(v) =>
                                          updateConditionForm(condKey, "required_documents", v)
                                        }
                                        placeholder="添加材料，按 Enter"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm">追问问题</Label>
                                      <ArrayInput
                                        value={form.clarifying_questions}
                                        onChange={(v) =>
                                          updateConditionForm(condKey, "clarifying_questions", v)
                                        }
                                        placeholder="添加问题，按 Enter"
                                      />
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* Confidence & Source */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm">置信度</Label>
                                      <Select
                                        value={form.confidence_level}
                                        onValueChange={(v) =>
                                          updateConditionForm(condKey, "confidence_level", v)
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
                                      <Label className="text-sm">来源备注</Label>
                                      <Input
                                        value={form.source_notes}
                                        onChange={(e) =>
                                          updateConditionForm(condKey, "source_notes", e.target.value)
                                        }
                                        placeholder="例如：ANZ Policy 2024"
                                      />
                                    </div>
                                  </div>

                                  {/* Save Button */}
                                  <div className="flex justify-end pt-2">
                                    <Button
                                      onClick={() =>
                                        handleSaveCondition(currentCategory, factor, condition)
                                      }
                                      disabled={savingKey === condKey}
                                      size="sm"
                                    >
                                      <Save className="h-4 w-4 mr-2" />
                                      {savingKey === condKey
                                        ? "保存中..."
                                        : isSaved
                                        ? "更新"
                                        : "保存"}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Text input factor (non-select) */}
                    {isFactorExpanded && factor.inputType === "text" && (
                      <div className="border-t p-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          此因子为自由文本输入类型，请在下方描述具体情况后填写专家逻辑。
                        </p>
                        {/* 简化处理，text 类型暂时保持原来的逻辑 */}
                        <Input placeholder={factor.placeholder || "描述具体情况..."} />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
