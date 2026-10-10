"use client";

import * as React from "react";
import { Info, Mail, Settings, UserRound, LogOut } from "lucide-react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Slider,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
  CurrencyDisplay,
  DisplayCurrencyProvider,
  useDisplayCurrency,
  type DisplayCurrencyCode,
} from "@/components/ui";
import { site } from "@/lib/config/site";

export function OverlayDemos() {
  const [notify, setNotify] = React.useState(true);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Before your first lesson</DialogTitle>
            <DialogDescription>{site.medicalDisclaimer}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Not now</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>I understand</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open sheet</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Lessons</SheetTitle>
            <SheetDescription>Module 1 · Baby Steps</SheetDescription>
          </SheetHeader>
          <ul className="space-y-1 px-4 text-sm">
            {["Welcome", "Why cravings happen", "Your first baby step"].map((t, i) => (
              <li key={t} className="rounded-md px-3 py-2 hover:bg-rose-soft/50">
                {i + 1}. {t}
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Dropdown</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserRound /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings /> Settings
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked={notify} onCheckedChange={(v) => setNotify(v === true)}>
            Email nudges
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOut /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="font-serif text-lg">Streak: 4 days</p>
          <p className="text-sm text-muted-foreground">Showing up counts. Even a two-minute lesson keeps the streak alive.</p>
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="What is XP?">
            <Info />
          </Button>
        </TooltipTrigger>
        <TooltipContent>XP is earned for each action step you complete.</TooltipContent>
      </Tooltip>
    </div>
  );
}

export function ToastDemos() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => toast("Saved your note.")}>
        Default
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast.success("Lesson complete", { description: "+25 XP · Nicely done." })}>
        Success
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast.info("Module 2 unlocks on Thursday.")}>
        Info
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast.warning("Your session expires in 5 minutes.")}>
        Warning
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast.error("We couldn’t save that. Please try again.")}>
        Error
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast.promise(new Promise((r) => setTimeout(r, 1500)), { loading: "Uploading…", success: "Uploaded", error: "Upload failed" })
        }
      >
        Promise
      </Button>
    </div>
  );
}

export function FormDemos() {
  const [vol, setVol] = React.useState([40]);
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label htmlFor="demo-select">Topic</Label>
        <Select defaultValue="cravings">
          <SelectTrigger id="demo-select" className="w-full">
            <SelectValue placeholder="Choose a topic" />
          </SelectTrigger>
          <SelectContent>
            {site.topics.map((t) => (
              <SelectItem key={t.key} value={t.key}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-3">
        <Label>Checkboxes</Label>
        <div className="flex items-center gap-2">
          <Checkbox id="c1" defaultChecked />
          <Label htmlFor="c1" className="font-normal">
            I read the lesson notes
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="c2" />
          <Label htmlFor="c2" className="font-normal">
            I did the action step
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="c3" checked="indeterminate" aria-label="Partially done" />
          <Label htmlFor="c3" className="font-normal">
            Partly done
          </Label>
        </div>
      </div>
      <div className="grid gap-3">
        <Label>Switches</Label>
        <div className="flex items-center gap-3">
          <Switch id="s1" defaultChecked />
          <Label htmlFor="s1" className="font-normal">
            Weekly progress nudges
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="s2" />
          <Label htmlFor="s2" className="font-normal">
            Community digest
          </Label>
        </div>
      </div>
      <div className="grid gap-3">
        <Label>Radio group</Label>
        <RadioGroup defaultValue="monthly">
          {[
            ["monthly", "Monthly · $29"],
            ["annual", "Annual · $249"],
            ["once", "One-time · $197"],
          ].map(([v, l]) => (
            <div key={v} className="flex items-center gap-2">
              <RadioGroupItem id={`r-${v}`} value={v} />
              <Label htmlFor={`r-${v}`} className="font-normal">
                {l}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="grid gap-3 sm:col-span-2">
        <Label htmlFor="demo-slider">How are you feeling today? ({vol[0]})</Label>
        <Slider id="demo-slider" value={vol} onValueChange={setVol} max={100} step={1} aria-label="Mood" />
      </div>
    </div>
  );
}

function CurrencyPicker() {
  const { code, setCode } = useDisplayCurrency();
  return (
    <Select value={code} onValueChange={(v) => setCode(v as DisplayCurrencyCode)}>
      <SelectTrigger size="sm" aria-label="Display currency">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {site.displayCurrencies.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CurrencyDemo() {
  return (
    <DisplayCurrencyProvider>
      <div className="flex flex-wrap items-center gap-4">
        <CurrencyPicker />
        <p className="text-sm">
          Baby Steps: <CurrencyDisplay cents={19700} className="font-semibold" /> ·{" "}
          <CurrencyDisplay cents={24900} strike /> <CurrencyDisplay cents={14700} className="font-semibold text-rose-strong" /> ·{" "}
          <CurrencyDisplay cents={0} /> · <CurrencyDisplay cents={2900} displayAs="USD" />
          /mo
        </p>
      </div>
    </DisplayCurrencyProvider>
  );
}

export function ButtonStates() {
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      loading={loading}
      variant="gold"
      onClick={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
      }}
    >
      <Mail /> Send magic link
    </Button>
  );
}
