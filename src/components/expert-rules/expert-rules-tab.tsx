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
  Save,
  Download,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpertRule, KillerCombinationRow, KillerCombinationFactor } from "@/types/database";
import {
  EXPERT_SYSTEM_CATEGORIES,
  KILLER_COMBINATIONS,
  CategoryDefinition,
  FactorDefinition,
  ConditionOption,
  getFactorById,
} from "@/lib/expert-factors";
import { LenderMultiSelect } from "@/components/expert-rules/lender-multi-select";
import { ArrayInput } from "@/components/expert-rules/array-input";
import { KillerComboForm } from "@/components/expert-rules/killer-combo-form";

// Risk level icon component
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

// Form data for each factor+condition combination
interface ConditionFormData {
  risk_level: string; // Can override default risk level
  expert_reasoning: string;
  solutions: string;
  friendly_lenders: string[];
  friendly_lenders_reason: string;
  avoid_lenders: string[];
  avoid_lenders_reason: string;
  required_documents: string[];
  clarifying_questions: string[];
  confidence_level: string;
  source_notes: string;
}

const emptyConditionFormData: ConditionFormData = {
  risk_level: "", // Empty means use default
  expert_reasoning: "",
  solutions: "",
  friendly_lenders: [],
  friendly_lenders_reason: "",
  avoid_lenders: [],
  avoid_lenders_reason: "",
  required_documents: [],
  clarifying_questions: [],
  confidence_level: "HIGH",
  source_notes: "",
};

// Generate unique key: factorId__conditionValue
function getConditionKey(factorId: string, conditionValue: string): string {
  return `${factorId}__${conditionValue}`;
}

// Killer Combination form data
interface KillerComboFormData {
  expert_reasoning: string;
  solutions: string;
  alternative_lenders: string[];
  confidence_level: string;
  source_notes: string;
}

const emptyKillerComboFormData: KillerComboFormData = {
  expert_reasoning: "",
  solutions: "",
  alternative_lenders: [],
  confidence_level: "HIGH",
  source_notes: "",
};

export function ExpertRulesTab() {
  const [activeTab, setActiveTab] = useState("single-factor");
  const [activeCategory, setActiveCategory] = useState(EXPERT_SYSTEM_CATEGORIES[0].id);
  const [expandedFactors, setExpandedFactors] = useState<Set<string>>(new Set());
  const [expandedConditions, setExpandedConditions] = useState<Set<string>>(new Set());
  const [conditionForms, setConditionForms] = useState<Record<string, ConditionFormData>>({});
  const [savedRules, setSavedRules] = useState<ExpertRule[]>([]);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Killer combinations state
  const [expandedCombos, setExpandedCombos] = useState<Set<string>>(new Set());
  const [killerComboForms, setKillerComboForms] = useState<Record<string, KillerComboFormData>>({});
  const [savedKillerCombos, setSavedKillerCombos] = useState<KillerCombinationRow[]>([]);
  const [savingComboId, setSavingComboId] = useState<string | null>(null);

  // Custom killer combo form state
  const [showKillerComboForm, setShowKillerComboForm] = useState(false);
  const [editingKillerCombo, setEditingKillerCombo] = useState<KillerCombinationRow | null>(null);

  useEffect(() => {
    fetchRules();
    fetchKillerCombos();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch("/api/expert-rules");
      if (!response.ok) throw new Error("Failed to fetch rules");
      const data = await response.json();
      setSavedRules(data);

      // Initialize saved rules to forms (using factor + scenario as key)
      const formsFromSaved: Record<string, ConditionFormData> = {};
      data.forEach((rule: ExpertRule) => {
        const key = getConditionKey(rule.factor, rule.scenario);
        formsFromSaved[key] = {
          risk_level: rule.risk_level,
          expert_reasoning: rule.expert_reasoning,
          solutions: rule.solutions,
          friendly_lenders: rule.friendly_lenders || [],
          friendly_lenders_reason: rule.friendly_lenders_reason || "",
          avoid_lenders: rule.avoid_lenders || [],
          avoid_lenders_reason: rule.avoid_lenders_reason || "",
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

  const fetchKillerCombos = async () => {
    try {
      const response = await fetch("/api/killer-combinations");
      if (!response.ok) throw new Error("Failed to fetch killer combinations");
      const data = await response.json();
      setSavedKillerCombos(data);

      // Initialize saved combos to forms
      const formsFromSaved: Record<string, KillerComboFormData> = {};
      data.forEach((combo: KillerCombinationRow) => {
        // Match by name since predefined combos have string IDs
        const matchingPredef = KILLER_COMBINATIONS.find(
          (k) => k.name === combo.name || k.id === combo.name
        );
        const key = matchingPredef?.id || combo.id;
        formsFromSaved[key] = {
          expert_reasoning: combo.expert_reasoning,
          solutions: combo.solutions,
          alternative_lenders: combo.alternative_lenders || [],
          confidence_level: combo.confidence_level,
          source_notes: combo.source_notes || "",
        };
      });
      setKillerComboForms(formsFromSaved);
    } catch (error) {
      console.error("Error fetching killer combinations:", error);
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

    // Validate required fields
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
      // Check if exists (by factor + scenario)
      const existingRule = savedRules.find(
        (r) => r.factor === factor.id && r.scenario === condition.value
      );

      const payload = {
        category: category.id,
        factor: factor.id,
        risk_level: form.risk_level || condition.riskLevel, // Use custom or default
        scenario: condition.value,
        expert_reasoning: form.expert_reasoning,
        solutions: form.solutions,
        friendly_lenders: form.friendly_lenders,
        friendly_lenders_reason: form.friendly_lenders_reason,
        avoid_lenders: form.avoid_lenders,
        avoid_lenders_reason: form.avoid_lenders_reason,
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

  // Count saved conditions per category
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
        total += 1;
        if (savedRules.some((r) => r.factor === factor.id)) {
          saved++;
        }
      }
    });

    return { saved, total };
  };

  // Count saved conditions per factor
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

  // Killer combo helpers
  const toggleCombo = (comboId: string) => {
    const newExpanded = new Set(expandedCombos);
    if (newExpanded.has(comboId)) {
      newExpanded.delete(comboId);
    } else {
      newExpanded.add(comboId);
    }
    setExpandedCombos(newExpanded);
  };

  const updateKillerComboForm = (
    comboId: string,
    field: keyof KillerComboFormData,
    value: KillerComboFormData[keyof KillerComboFormData]
  ) => {
    setKillerComboForms((prev) => ({
      ...prev,
      [comboId]: {
        ...(prev[comboId] || emptyKillerComboFormData),
        [field]: value,
      },
    }));
  };

  const getKillerComboForm = (comboId: string): KillerComboFormData => {
    return killerComboForms[comboId] || emptyKillerComboFormData;
  };

  const isComboSaved = (comboId: string) => {
    const predef = KILLER_COMBINATIONS.find((k) => k.id === comboId);
    if (!predef) return false;
    return savedKillerCombos.some(
      (c) => c.name === predef.name || c.name === comboId
    );
  };

  const getComboDbRecord = (comboId: string) => {
    const predef = KILLER_COMBINATIONS.find((k) => k.id === comboId);
    if (!predef) return null;
    return savedKillerCombos.find(
      (c) => c.name === predef.name || c.name === comboId
    );
  };

  const handleSaveKillerCombo = async (comboId: string) => {
    const predef = KILLER_COMBINATIONS.find((k) => k.id === comboId);
    if (!predef) return;

    const form = getKillerComboForm(comboId);

    if (!form.expert_reasoning) {
      toast.error("请填写专家逻辑解析");
      return;
    }
    if (!form.solutions) {
      toast.error("请填写解决方案");
      return;
    }

    setSavingComboId(comboId);

    try {
      const existingRecord = getComboDbRecord(comboId);

      const payload = {
        name: predef.name,
        name_en: predef.nameEn,
        description: predef.description,
        factors: predef.factors,
        expert_reasoning: form.expert_reasoning,
        solutions: form.solutions,
        alternative_lenders: form.alternative_lenders,
        confidence_level: form.confidence_level,
        source_notes: form.source_notes,
      };

      const url = existingRecord
        ? `/api/killer-combinations/${existingRecord.id}`
        : "/api/killer-combinations";
      const method = existingRecord ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "保存失败");
      }

      toast.success(`${predef.name} 保存成功`);
      fetchKillerCombos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSavingComboId(null);
    }
  };

  // Get factor and condition labels for display
  const getFactorLabel = (factorId: string) => {
    const result = getFactorById(factorId);
    return result ? result.factor.name : factorId;
  };

  const getConditionLabels = (factorId: string, conditionValues: string[]) => {
    const result = getFactorById(factorId);
    if (!result || result.factor.inputType !== "select") return conditionValues.join(", ");
    return conditionValues
      .map((v) => {
        const cond = result.factor.conditions?.find((c) => c.value === v);
        return cond ? cond.label : v;
      })
      .join(" / ");
  };

  // Custom killer combo handlers
  const handleSaveCustomKillerCombo = async (
    data: {
      name: string;
      name_en: string;
      description: string;
      factors: { factorId: string; conditionValues: string[] }[];
      expert_reasoning: string;
      solutions: string;
      alternative_lenders: string[];
      confidence_level: string;
      source_notes: string;
    },
    existingId?: string
  ) => {
    const payload = {
      name: data.name,
      name_en: data.name_en,
      description: data.description,
      factors: data.factors,
      expert_reasoning: data.expert_reasoning,
      solutions: data.solutions,
      alternative_lenders: data.alternative_lenders,
      confidence_level: data.confidence_level,
      source_notes: data.source_notes,
    };

    const url = existingId
      ? `/api/killer-combinations/${existingId}`
      : "/api/killer-combinations";
    const method = existingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "保存失败");
    }

    toast.success(`${data.name} 保存成功`);
    fetchKillerCombos();
  };

  const handleDeleteKillerCombo = async (comboId: string, comboName: string) => {
    if (!confirm(`确定要删除 "${comboName}" 吗？`)) return;

    try {
      const response = await fetch(`/api/killer-combinations/${comboId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "删除失败");
      }

      toast.success(`${comboName} 已删除`);
      fetchKillerCombos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除失败");
    }
  };

  const handleEditKillerCombo = (combo: KillerCombinationRow) => {
    setEditingKillerCombo(combo);
    setShowKillerComboForm(true);
  };

  // Get custom combos (ones not matching predefined templates)
  const getCustomCombos = () => {
    const predefinedNames = KILLER_COMBINATIONS.map((k) => k.name);
    return savedKillerCombos.filter((c) => !predefinedNames.includes(c.name));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">专家逻辑矩阵</h2>
          <p className="text-muted-foreground">
            Expert System - 单因子规则 & 必死组合
          </p>
        </div>
        <Button variant="outline" onClick={handleExportAll}>
          <Download className="h-4 w-4 mr-2" />
          导出全部 Markdown
        </Button>
      </div>

      {/* Inner Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="single-factor">单因子规则</TabsTrigger>
          <TabsTrigger value="killer-combos">必死组合 (Killer Combinations)</TabsTrigger>
        </TabsList>

        {/* Single Factor Rules Tab */}
        <TabsContent value="single-factor" className="space-y-6 mt-4">
          {/* Category Stats */}
          <div className="grid grid-cols-5 gap-4">
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
                                <RiskIcon level={form.risk_level || condition.riskLevel} />
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
                              <Badge className={getRiskBadgeClass(form.risk_level || condition.riskLevel)}>
                                {getRiskLabel(form.risk_level || condition.riskLevel)}
                              </Badge>
                            </div>

                            {/* Condition Form */}
                            {isCondExpanded && (
                              <div className="px-4 pb-4 pt-2 ml-12 space-y-4 bg-muted/20">
                                {/* Risk Level Override */}
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    风险等级
                                    <span className="text-muted-foreground font-normal ml-2">
                                      (默认: {getRiskLabel(condition.riskLevel)})
                                    </span>
                                  </Label>
                                  <Select
                                    value={form.risk_level || condition.riskLevel}
                                    onValueChange={(v) =>
                                      updateConditionForm(condKey, "risk_level", v)
                                    }
                                  >
                                    <SelectTrigger className="w-[200px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="STOP">🔴 Stop (Deal Killer)</SelectItem>
                                      <SelectItem value="HIGH">🟠 High Risk</SelectItem>
                                      <SelectItem value="MEDIUM">🟡 Medium Risk</SelectItem>
                                      <SelectItem value="LOW">🟢 Low Risk</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <Separator />

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
                                <div className="space-y-4">
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
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm text-muted-foreground">为什么友好?</Label>
                                      <Textarea
                                        value={form.friendly_lenders_reason}
                                        onChange={(e) =>
                                          updateConditionForm(condKey, "friendly_lenders_reason", e.target.value)
                                        }
                                        placeholder="解释这些银行为什么对此情况友好..."
                                        rows={2}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm text-muted-foreground">为什么规避?</Label>
                                      <Textarea
                                        value={form.avoid_lenders_reason}
                                        onChange={(e) =>
                                          updateConditionForm(condKey, "avoid_lenders_reason", e.target.value)
                                        }
                                        placeholder="解释这些银行为什么应该规避..."
                                        rows={2}
                                      />
                                    </div>
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
                        <Input placeholder={factor.placeholder || "描述具体情况..."} />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
          )}
        </TabsContent>

        {/* Killer Combinations Tab */}
        <TabsContent value="killer-combos" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    必死组合 (Killer Combinations)
                  </CardTitle>
                  <CardDescription>
                    多因子联动导致的 Deal Killer 情况 - 遇到这些组合时，Prime Lender 基本不可能做
                  </CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingKillerCombo(null);
                  setShowKillerComboForm(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  新建组合
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Section: Predefined Templates */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">预设模板</h3>
              </div>
              {KILLER_COMBINATIONS.map((combo) => {
                const isExpanded = expandedCombos.has(combo.id);
                const isSaved = isComboSaved(combo.id);
                const form = getKillerComboForm(combo.id);

                return (
                  <div
                    key={combo.id}
                    className={`border rounded-lg ${isSaved ? "bg-green-50/50" : ""}`}
                  >
                    {/* Combo Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleCombo(combo.id)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                        <XCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{combo.name}</span>
                            {isSaved && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 text-xs"
                              >
                                已录入
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {combo.description}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-300">
                        🔴 Deal Killer
                      </Badge>
                    </div>

                    {/* Combo Details & Form */}
                    {isExpanded && (
                      <div className="border-t p-4 space-y-4">
                        {/* Factor Conditions Display */}
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium text-red-800 mb-2">触发条件组合</h4>
                          <div className="space-y-2">
                            {combo.factors.map((f, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className="text-red-700">
                                  {getFactorLabel(f.factorId)}
                                </Badge>
                                <span className="text-muted-foreground">:</span>
                                <span className="text-red-800">
                                  {getConditionLabels(f.factorId, f.conditionValues)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Expert Reasoning */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            专家逻辑解析 *
                          </Label>
                          <Textarea
                            value={form.expert_reasoning}
                            onChange={(e) =>
                              updateKillerComboForm(combo.id, "expert_reasoning", e.target.value)
                            }
                            placeholder="为什么这个组合是 Deal Killer，银行的考量是什么"
                            rows={3}
                          />
                        </div>

                        {/* Solutions */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            解决方案 *
                          </Label>
                          <Textarea
                            value={form.solutions}
                            onChange={(e) =>
                              updateKillerComboForm(combo.id, "solutions", e.target.value)
                            }
                            placeholder="遇到这种情况应该怎么处理，有没有替代方案"
                            rows={3}
                          />
                        </div>

                        <Separator />

                        {/* Alternative Lenders */}
                        <div className="space-y-2">
                          <Label className="text-sm">可能接受的替代 Lender (Non-Prime)</Label>
                          <LenderMultiSelect
                            value={form.alternative_lenders}
                            onChange={(v) =>
                              updateKillerComboForm(combo.id, "alternative_lenders", v)
                            }
                            placeholder="选择可能接受的 Non-Prime Lender..."
                          />
                        </div>

                        <Separator />

                        {/* Confidence & Source */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">置信度</Label>
                            <Select
                              value={form.confidence_level}
                              onValueChange={(v) =>
                                updateKillerComboForm(combo.id, "confidence_level", v)
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
                                updateKillerComboForm(combo.id, "source_notes", e.target.value)
                              }
                              placeholder="例如：多家银行 BDM 确认"
                            />
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-2">
                          <Button
                            onClick={() => handleSaveKillerCombo(combo.id)}
                            disabled={savingComboId === combo.id}
                            size="sm"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {savingComboId === combo.id
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

              {/* Section: Custom Combinations */}
              {getCustomCombos().length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">自定义组合</h3>
                  </div>
                  {getCustomCombos().map((combo) => {
                    const isExpanded = expandedCombos.has(combo.id);
                    const factors = combo.factors as unknown as KillerCombinationFactor[];

                    return (
                      <div
                        key={combo.id}
                        className="border rounded-lg bg-green-50/50"
                      >
                        {/* Combo Header */}
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleCombo(combo.id)}
                        >
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                            <XCircle className="h-5 w-5 text-red-600" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{combo.name}</span>
                                <Badge
                                  variant="outline"
                                  className="bg-blue-100 text-blue-800 text-xs"
                                >
                                  自定义
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {combo.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-100 text-red-800 border-red-300">
                              🔴 Deal Killer
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditKillerCombo(combo);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteKillerCombo(combo.id, combo.name);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>

                        {/* Combo Details */}
                        {isExpanded && (
                          <div className="border-t p-4 space-y-4">
                            {/* Factor Conditions Display */}
                            <div className="bg-red-50 p-4 rounded-lg">
                              <h4 className="font-medium text-red-800 mb-2">触发条件组合</h4>
                              <div className="space-y-2">
                                {factors.map((f, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <Badge variant="outline" className="text-red-700">
                                      {getFactorLabel(f.factorId)}
                                    </Badge>
                                    <span className="text-muted-foreground">:</span>
                                    <span className="text-red-800">
                                      {getConditionLabels(f.factorId, f.conditionValues)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Expert Reasoning */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">专家逻辑解析</Label>
                              <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded">
                                {combo.expert_reasoning}
                              </p>
                            </div>

                            {/* Solutions */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">解决方案</Label>
                              <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded">
                                {combo.solutions}
                              </p>
                            </div>

                            {/* Alternative Lenders */}
                            {combo.alternative_lenders && combo.alternative_lenders.length > 0 && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">替代 Lender (Non-Prime)</Label>
                                <div className="flex flex-wrap gap-2">
                                  {combo.alternative_lenders.map((lender) => (
                                    <Badge key={lender} variant="outline">
                                      {lender}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>置信度: {combo.confidence_level === "HIGH" ? "高" : "低"}</span>
                              {combo.source_notes && <span>来源: {combo.source_notes}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Killer Combo Form Dialog */}
      <KillerComboForm
        open={showKillerComboForm}
        onOpenChange={setShowKillerComboForm}
        initialData={editingKillerCombo ? {
          id: editingKillerCombo.id,
          name: editingKillerCombo.name,
          name_en: editingKillerCombo.name_en,
          description: editingKillerCombo.description,
          factors: editingKillerCombo.factors as unknown as KillerCombinationFactor[],
          expert_reasoning: editingKillerCombo.expert_reasoning,
          solutions: editingKillerCombo.solutions,
          alternative_lenders: editingKillerCombo.alternative_lenders,
          confidence_level: editingKillerCombo.confidence_level,
          source_notes: editingKillerCombo.source_notes,
        } : null}
        onSave={handleSaveCustomKillerCombo}
      />
    </div>
  );
}
