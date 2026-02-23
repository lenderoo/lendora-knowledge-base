import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: area, error } = await supabase
      .from("restricted_areas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching restricted area:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!area) {
      return NextResponse.json({ error: "Area not found" }, { status: 404 });
    }

    return NextResponse.json(area);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
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

    const { data: area, error } = await supabase
      .from("restricted_areas")
      .update({
        suburb,
        postcode,
        state,
        restriction_level,
        category,
        reason,
        affected_lenders: affected_lenders || [],
        max_lvr: max_lvr || null,
        notes: notes || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating restricted area:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(area);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { error } = await supabase
      .from("restricted_areas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting restricted area:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
