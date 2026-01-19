"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

type LoginMode = "password" | "invite";
type Step = "login" | "set-password";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>("password");
  const [step, setStep] = useState<Step>("login");
  const [tempEmail, setTempEmail] = useState("");

  const supabase = createClient();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.href = "/";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登录失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verify invite code
      const response = await fetch("/api/auth/verify-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, inviteCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "邀请码验证失败");
      }

      if (data.needsPasswordSetup) {
        // User needs to set password
        setTempEmail(email);
        setStep("set-password");
        toast.success("邀请码验证成功，请设置您的密码");
      } else {
        // User already has password, shouldn't use invite code
        toast.error("该账户已设置密码，请使用密码登录");
        setLoginMode("password");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "邀请码验证失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("密码长度至少为6位");
      return;
    }

    setIsLoading(true);

    try {
      // Create user account with password
      const response = await fetch("/api/auth/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: tempEmail,
          password: newPassword,
          inviteCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "密码设置失败");
      }

      // Sign in with the new password
      const { error } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: newPassword,
      });

      if (error) throw error;

      toast.success("密码设置成功！");
      window.location.href = "/";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "密码设置失败");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "set-password") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">设置密码</CardTitle>
            <CardDescription>
              首次登录，请设置您的账户密码
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label>邮箱</Label>
                <Input
                  type="email"
                  value={tempEmail}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">新密码</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="请输入密码（至少6位）"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "处理中..." : "设置密码并登录"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep("login");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                disabled={isLoading}
              >
                返回
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">贷款知识库管理系统</CardTitle>
          <CardDescription>登录您的账户</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loginMode === "password" ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleInviteCodeLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">邮箱</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteCode">邀请码</Label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="请输入邀请码"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "验证中..." : "验证邀请码"}
              </Button>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">或</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setLoginMode(loginMode === "password" ? "invite" : "password");
              setEmail("");
              setPassword("");
              setInviteCode("");
            }}
            disabled={isLoading}
          >
            {loginMode === "password" ? "使用邀请码登录" : "使用密码登录"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {loginMode === "password"
              ? "没有密码？请联系管理员获取邀请码"
              : "首次登录需要使用管理员提供的邀请码"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
