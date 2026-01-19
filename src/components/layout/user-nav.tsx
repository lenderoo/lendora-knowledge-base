"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { LogOut, Users, UserPlus } from "lucide-react";
import Link from "next/link";

export function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <Link href="/brokers">
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          Broker
        </Button>
      </Link>
      <Link href="/users">
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          用户邀请
        </Button>
      </Link>
      <div className="flex items-center gap-2 ml-2">
        <span className="text-sm text-muted-foreground">
          {user.email}
        </span>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
