import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const state = searchParams.get("state");
    const category = searchParams.get("category");
    const restrictionLevel = searchParams.get("restriction_level");
    const search = searchParams.get("search");

    let query = supabase
      .from("restricted_areas")
      .select("*")
      .order("state", { ascending: true })
      .order("suburb", { ascending: true });

    if (state) {
      query = query.eq("state", state);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (restrictionLevel) {
      query = query.eq("restriction_level", restrictionLevel);
    }

    if (search) {
      query = query.or(`suburb.ilike.%${search}%,postcode.ilike.%${search}%`);
    }

    const { data: areas, error } = await query;

    if (error) {
      console.error("Error fetching restricted areas:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(areas);
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
      suburb,
      postcode,
      state,
      restriction_level,
      category,
      reason,
      affected_lenders,
      max_lvr,
      notes,
    } = body;

    // Validate required fields
    if (!suburb || !postcode || !state || !restriction_level || !category || !reason) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    const { data: area, error } = await supabase
      .from("restricted_areas")
      .insert([
        {
          suburb,
          postcode,
          state,
          restriction_level,
          category,
          reason,
          affected_lenders: affected_lenders || [],
          max_lvr: max_lvr || null,
          notes: notes || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating restricted area:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(area, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
