import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { ExpertRule } from "@/types/database";
import {
  EXPERT_SYSTEM_CATEGORIES,
  getFactorById,
} from "@/lib/expert-factors";
import { CONFIDENCE_LEVELS } from "@/lib/constants";

function getCategoryLabel(categoryId: string): string {
  const category = EXPERT_SYSTEM_CATEGORIES.find((c) => c.id === categoryId);
  return category ? `${category.name} (${category.nameEn})` : categoryId;
}

function getFactorLabel(factorId: string): string {
  const result = getFactorById(factorId);
  return result ? `${result.factor.name} (${result.factor.nameEn})` : factorId;
}

function getConditionLabel(factorId: string, conditionValue: string): string {
  const result = getFactorById(factorId);
  if (!result || result.factor.inputType !== "select") return conditionValue;
  const condition = result.factor.conditions?.find((c) => c.value === conditionValue);
  return condition ? condition.label : conditionValue;
}

function getRiskLabel(value: string): string {
  switch (value) {
    case "STOP":
      return "🔴 Stop (Deal Killer)";
    case "HIGH":
      return "🟠 High Risk";
    case "MEDIUM":
      return "🟡 Medium Risk";
    case "LOW":
      return "🟢 Low Risk";
    default:
      return value;
  }
}

function getConfidenceLabel(value: string): string {
  const found = CONFIDENCE_LEVELS.find((c) => c.value === value);
  return found ? found.label : value;
}

function sanitizeTag(text: string): string {
  return text.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, "");
}

function ruleToMarkdown(rule: ExpertRule): string {
  const lines: string[] = [];

  const factorLabel = getFactorLabel(rule.factor);
  const categoryLabel = getCategoryLabel(rule.category);
  const conditionLabel = getConditionLabel(rule.factor, rule.scenario);

  lines.push(`# 专家逻辑块：${factorLabel}`);
  lines.push("");
  lines.push("## 1. 维度分类");
  lines.push(`- **Category**: ${categoryLabel}`);
  lines.push(`- **Factor**: ${factorLabel}`);
  lines.push(`- **Risk Level**: ${getRiskLabel(rule.risk_level)}`);
  lines.push("");
  lines.push("## 2. 场景描述 (Scenario)");
  lines.push(`> **条件**: ${conditionLabel}`);
  lines.push("");
  lines.push("## 3. 资深 Broker 逻辑解析 (Expert Reasoning)");
  lines.push(rule.expert_reasoning);
  lines.push("");
  lines.push("## 4. 解决方案与建议 (Actionable Advice)");
  lines.push(rule.solutions);
  lines.push("");
  lines.push("## 5. 推荐银行与偏好 (Lender Preferences)");

  const friendlyLenders = rule.friendly_lenders?.length
    ? rule.friendly_lenders.join(", ")
    : "暂无";
  const avoidLenders = rule.avoid_lenders?.length
    ? rule.avoid_lenders.join(", ")
    : "暂无";

  lines.push(`- ✅ **友好**: ${friendlyLenders}`);
  lines.push(`- ❌ **规避**: ${avoidLenders}`);
  lines.push("");

  if (rule.clarifying_questions?.length) {
    lines.push("## 6. 必须追问的问题 (Clarifying Questions)");
    rule.clarifying_questions.forEach((q) => {
      lines.push(`- ${q}`);
    });
    lines.push("");
  }

  if (rule.required_documents?.length) {
    lines.push("## 7. 必备材料清单 (Required Documents)");
    rule.required_documents.forEach((doc) => {
      lines.push(`- ${doc}`);
    });
    lines.push("");
  }

  lines.push("---");
  lines.push(`Confidence: ${getConfidenceLabel(rule.confidence_level)}`);
  if (rule.source_notes) {
    lines.push(`Source: ${rule.source_notes}`);
  }
  lines.push(`Tags: #${sanitizeTag(rule.category)} #${sanitizeTag(rule.factor)}`);
  lines.push("");

  return lines.join("\n");
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    const format = searchParams.get("format") || "markdown";

    if (id) {
      // Export single rule
      const { data: rule, error } = await supabase
        .from("expert_rules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json({ error: "规则不存在" }, { status: 404 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (format === "json") {
        return NextResponse.json(rule);
      }

      const markdown = ruleToMarkdown(rule);
      const factorLabel = getFactorLabel(rule.factor);
      return new NextResponse(markdown, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${factorLabel.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, "_")}.md"`,
        },
      });
    }

    // Export all rules
    const category = searchParams.get("category");

    let query = supabase
      .from("expert_rules")
      .select("*")
      .order("category", { ascending: true })
      .order("factor", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    const { data: rules, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (format === "json") {
      return NextResponse.json(rules);
    }

    // Combine all rules into a single markdown document
    const markdowns = rules?.map(ruleToMarkdown) || [];
    const combinedMarkdown = markdowns.join("\n---\n\n");

    const filename = category
      ? `expert_rules_${category}.md`
      : "expert_rules_all.md";

    return new NextResponse(combinedMarkdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
