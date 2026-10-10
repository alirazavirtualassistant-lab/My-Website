"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ModuleSettingsForm } from "./module-settings-form";
import { suggestModuleCode } from "./codes";

function AddModuleDialog({ courseId, existingCodes }: { courseId: string; existingCodes: string[] }) {
  const [open, setOpen] = React.useState(false);
  const onSaved = React.useCallback(() => setOpen(false), []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <Plus /> Add module
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add a module</DialogTitle>
          <DialogDescription>Modules group lessons and set when they unlock. You can reorder them afterwards.</DialogDescription>
        </DialogHeader>
        <ModuleSettingsForm
          courseId={courseId}
          values={{
            code: suggestModuleCode(existingCodes.map((code) => ({ code }))),
            kind: "core",
            title: "",
            description: "",
            notes: "",
            drip_days: 0,
            completion_xp: 10,
            required_for_certificate: true,
            illustration: null,
          }}
          submitLabel="Create module"
          onSaved={onSaved}
        />
      </DialogContent>
    </Dialog>
  );
}

export { AddModuleDialog };
