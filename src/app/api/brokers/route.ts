import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: brokers, error } = await supabase
      .from("brokers")
      .select("id, email, name, created_at")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching brokers:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(brokers);
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

    const { email, name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "姓名不能为空" },
        { status: 400 }
      );
    }

    const { data: broker, error } = await supabase
      .from("brokers")
      .insert([{ email: email || null, name }])
      .select()
      .single();

    if (error) {
      console.error("Error creating broker:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "该邮箱已存在" },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(broker, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
