import * as React from "react";
import Form from "next/form";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CommunitySearchProps extends Omit<React.ComponentProps<typeof Form>, "action"> {
  /** Page that handles ?q= (the course community home). */
  action: string;
  defaultValue?: string;
}

/** GET form via next/form: client-side navigation to ?q=…, still works without JavaScript. */
function CommunitySearch({ action, defaultValue = "", className, ...props }: CommunitySearchProps) {
  return (
    <Form role="search" action={action} className={cn("flex w-full items-end gap-2", className)} {...props}>
      <div className="relative min-w-0 flex-1">
        <Label htmlFor="community-q" className="sr-only">
          Search posts
        </Label>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input id="community-q" name="q" type="search" defaultValue={defaultValue} placeholder="Search posts" maxLength={120} className="pl-9" />
      </div>
      <Button type="submit" variant="outline">
        Search
      </Button>
    </Form>
  );
}

export { CommunitySearch };
