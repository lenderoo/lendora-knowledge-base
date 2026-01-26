import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("killer_combinations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
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

    // Validate required fields
    const requiredFields = [
      "name",
      "name_en",
      "description",
      "factors",
      "expert_reasoning",
      "solutions",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate factors is an array
    if (!Array.isArray(body.factors) || body.factors.length === 0) {
      return NextResponse.json(
        { error: "factors must be a non-empty array" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("killer_combinations")
      .insert({
        name: body.name,
        name_en: body.name_en,
        description: body.description,
        factors: body.factors,
        expert_reasoning: body.expert_reasoning,
        solutions: body.solutions,
        alternative_lenders: body.alternative_lenders || [],
        confidence_level: body.confidence_level || "HIGH",
        source_notes: body.source_notes || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
