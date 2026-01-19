"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Broker {
  id: string;
  name: string;
  email: string | null;
}

interface BrokerSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function BrokerSelect({ value, onChange }: BrokerSelectProps) {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchBrokers();
  }, []);

  const fetchBrokers = async () => {
    try {
      const response = await fetch("/api/brokers");
      if (!response.ok) throw new Error("Failed to fetch brokers");
      const data = await response.json();
      setBrokers(data);
    } catch (error) {
      console.error("Error fetching brokers:", error);
      toast.error("获取Broker列表失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBroker = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/brokers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "创建Broker失败");
      }

      const newBroker = await response.json();
      toast.success("Broker创建成功");

      // Add new broker to list and select it
      setBrokers((prev) => [...prev, newBroker].sort((a, b) => a.name.localeCompare(b.name)));
      onChange(newBroker.name);

      // Close dialog and reset form
      setIsDialogOpen(false);
      setFormData({ name: "", email: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "创建Broker失败");
    } finally {
      setIsSaving(false);
    }
  };

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === "__create_new__") {
      setIsDialogOpen(true);
    } else {
      onChange(selectedValue);
    }
  };

  return (
    <>
      <Select value={value || ""} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "加载中..." : "选择Broker"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__create_new__" className="text-primary">
            <div className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              添加新Broker
            </div>
          </SelectItem>
          {brokers.map((broker) => (
            <SelectItem key={broker.id} value={broker.name}>
              {broker.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加新Broker</DialogTitle>
            <DialogDescription>
              创建一个新的Broker用于经办案例
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateBroker}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="broker_name">姓名 *</Label>
                <Input
                  id="broker_name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="输入Broker姓名"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="broker_email">邮箱</Label>
                <Input
                  id="broker_email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="broker@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setFormData({ name: "", email: "" });
                }}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "创建中..." : "创建"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
