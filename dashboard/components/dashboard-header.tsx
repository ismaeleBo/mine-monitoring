"use client";

import { Bell, Calendar, Download, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DatePickerWithRange } from "@/components/date-range-picker";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetHeader className="border-b pb-4">
            <SheetTitle>Mining Sustainability Dashboard</SheetTitle>
            <SheetDescription>
              Monitor environmental impact metrics
            </SheetDescription>
          </SheetHeader>
          <nav className="grid gap-2 py-4">
            <Button variant="ghost" className="justify-start gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <Download className="h-4 w-4" />
              Reports
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold md:text-xl">
          Mining Sustainability Dashboard
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Reports</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
