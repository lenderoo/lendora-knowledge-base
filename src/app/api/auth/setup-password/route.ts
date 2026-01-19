import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email, password, inviteCode } = await request.json();

    if (!email || !password || !inviteCode) {
      return NextResponse.json(
        { error: "所有字段都不能为空" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码长度至少为6位" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify invite code again
    const { data: invite, error: inviteError } = await supabase
      .from("user_invites")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("invite_code", inviteCode)
      .is("used_at", null)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: "邀请码验证失败" },
        { status: 400 }
      );
    }

    // Check if expired
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "邀请码已过期" },
        { status: 400 }
      );
    }

    // Use admin client to create user (requires service role key)
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: invite.name,
      },
    });

    if (authError) {
      // If user already exists, try to update password
      if (authError.message.includes("already been registered")) {
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.id,
            { password }
          );

          if (updateError) {
            console.error("Update password error:", updateError);
            return NextResponse.json(
              { error: "密码更新失败" },
              { status: 500 }
            );
          }
        }
      } else {
        console.error("Auth error:", authError);
        return NextResponse.json(
          { error: "创建账户失败: " + authError.message },
          { status: 500 }
        );
      }
    }

    // Mark invite as used
    const { error: updateError } = await supabase
      .from("user_invites")
      .update({
        used_at: new Date().toISOString(),
        auth_user_id: authData?.user?.id || null,
      })
      .eq("id", invite.id);

    if (updateError) {
      console.error("Update invite error:", updateError);
      // Don't fail the request, user can still log in
    }

    return NextResponse.json({
      success: true,
      message: "密码设置成功",
    });
  } catch (error) {
    console.error("Setup password error:", error);
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}
