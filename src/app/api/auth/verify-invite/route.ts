import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, inviteCode } = await request.json();

    if (!email || !inviteCode) {
      return NextResponse.json(
        { error: "邮箱和邀请码不能为空" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Find invite with matching email and invite code
    const { data: invite, error } = await supabase
      .from("user_invites")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("invite_code", inviteCode)
      .single();

    if (error || !invite) {
      return NextResponse.json(
        { error: "邀请码无效或邮箱不匹配" },
        { status: 400 }
      );
    }

    // Check if invite code has expired
    if (invite.expires_at) {
      const expiresAt = new Date(invite.expires_at);
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { error: "邀请码已过期，请联系管理员重新获取" },
          { status: 400 }
        );
      }
    }

    // Check if already used
    if (invite.used_at) {
      return NextResponse.json(
        { error: "该邀请码已被使用" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      needsPasswordSetup: true,
      userName: invite.name,
    });
  } catch (error) {
    console.error("Verify invite error:", error);
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}
