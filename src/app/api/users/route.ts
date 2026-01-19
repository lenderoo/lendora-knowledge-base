import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

function generateInviteCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: invites, error } = await supabase
      .from("user_invites")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching invites:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(invites);
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

    if (!email) {
      return NextResponse.json(
        { error: "邮箱不能为空" },
        { status: 400 }
      );
    }

    // Check if there's already an unused invite for this email
    const { data: existingInvite } = await supabase
      .from("user_invites")
      .select("*")
      .eq("email", email.toLowerCase())
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (existingInvite) {
      return NextResponse.json(
        { error: "该邮箱已有未使用的有效邀请码" },
        { status: 400 }
      );
    }

    // Generate invite code and set expiration (7 days)
    const inviteCode = generateInviteCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data: invite, error } = await supabase
      .from("user_invites")
      .insert([{
        email: email.toLowerCase(),
        name,
        invite_code: inviteCode,
        expires_at: expiresAt.toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating invite:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
