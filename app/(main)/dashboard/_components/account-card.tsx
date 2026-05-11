"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount } from "@/app/(main)/_actions/account";
import { toast } from "sonner";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: string;
  isDefault: boolean;
}

export function AccountCard({ account }: { account: Account }) {
  const { name, type, balance, id, isDefault } = account;
  const [isLoading, setIsLoading] = useState(false);

  const handleDefaultChange = async () => {
    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateDefaultAccount(id);
      if (result?.success) {
        toast.success("Default account updated successfully");
      } else {
        throw new Error(result?.error || "Failed to update");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update default account";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <Link href={`/account/${id}`}>
            <CardTitle className="text-sm font-medium capitalize cursor-pointer hover:underline">
              {name}
            </CardTitle>
          </Link>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={isDefault}
            onCheckedChange={handleDefaultChange}
            disabled={isLoading}
          />
        </div>
      </CardHeader>

      <Link href={`/account/${id}`} className="block">
        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
