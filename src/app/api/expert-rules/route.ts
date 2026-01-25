import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const riskLevel = searchParams.get("risk_level");
    const search = searchParams.get("search");

    let query = supabase
      .from("expert_rules")
      .select("*")
      .order("category", { ascending: true })
      .order("factor", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    if (riskLevel) {
      query = query.eq("risk_level", riskLevel);
    }

    if (search) {
      query = query.or(`factor.ilike.%${search}%,scenario.ilike.%${search}%`);
    }

    const { data: rules, error } = await query;

    if (error) {
      console.error("Error fetching expert rules:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(rules);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      category,
      factor,
      risk_level,
      scenario,
      expert_reasoning,
      solutions,
      friendly_lenders,
      avoid_lenders,
      required_documents,
      clarifying_questions,
      confidence_level,
      source_notes,
    } = body;

    // Validate required fields
    if (!category || !factor || !risk_level || !scenario || !expert_reasoning || !solutions || !confidence_level) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    const { data: rule, error } = await supabase
      .from("expert_rules")
      .insert([
        {
          category,
          factor,
          risk_level,
          scenario,
          expert_reasoning,
          solutions,
          friendly_lenders: friendly_lenders || [],
          avoid_lenders: avoid_lenders || [],
          required_documents: required_documents || [],
          clarifying_questions: clarifying_questions || [],
          confidence_level,
          source_notes: source_notes || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating expert rule:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
