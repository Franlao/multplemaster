"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdvancedSettings as AdvancedSettingsType } from "@/types/quiz";

interface AdvancedSettingsProps {
  settings: AdvancedSettingsType;
  onSettingsChange: (settings: AdvancedSettingsType) => void;
}

export function AdvancedSettings({
  settings,
  onSettingsChange,
}: AdvancedSettingsProps) {
  const [localSettings, setLocalSettings] =
    useState<AdvancedSettingsType>(settings);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSettingsChange(localSettings);
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setOpen(false);
  };

  const handleTableToggle = (table: number) => {
    const newTables = localSettings.specificTables.includes(table)
      ? localSettings.specificTables.filter((t) => t !== table)
      : [...localSettings.specificTables, table].sort((a, b) => a - b);
    setLocalSettings({ ...localSettings, specificTables: newTables });
  };

  const handleSelectAllTables = () => {
    const allTables = Array.from({ length: 100 }, (_, i) => i + 1);
    setLocalSettings({ ...localSettings, specificTables: allTables });
  };

  const handleClearAllTables = () => {
    setLocalSettings({ ...localSettings, specificTables: [] });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-8 sm:h-9"
        >
          <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Paramètres avancés</span>
          <span className="sm:hidden">Paramètres</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Paramètres avancés</DialogTitle>
          <DialogDescription>
            Configurez les plages de nombres et multiplicateurs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mode de sélection des tables */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Mode de sélection des nombres
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={
                  localSettings.tableSelectionMode === "range"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    tableSelectionMode: "range",
                  })
                }
                className="h-auto py-3"
              >
                <div className="text-center">
                  <div className="font-semibold">Plage</div>
                  <div className="text-xs opacity-80">Ex: 1 à 10</div>
                </div>
              </Button>
              <Button
                type="button"
                variant={
                  localSettings.tableSelectionMode === "specific"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    tableSelectionMode: "specific",
                  })
                }
                className="h-auto py-3"
              >
                <div className="text-center">
                  <div className="font-semibold">Sélection</div>
                  <div className="text-xs opacity-80">Ex: 2, 5, 15</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Plage de tables */}
          {localSettings.tableSelectionMode === "range" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Plage de nombres</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="table-min" className="text-xs">
                    Minimum
                  </Label>
                  <Input
                    id="table-min"
                    type="number"
                    min={0}
                    max={localSettings.tableRangeMax}
                    value={localSettings.tableRangeMin}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        tableRangeMin: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="table-max" className="text-xs">
                    Maximum
                  </Label>
                  <Input
                    id="table-max"
                    type="number"
                    min={localSettings.tableRangeMin}
                    max={100}
                    value={localSettings.tableRangeMax}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        tableRangeMax: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sélection spécifique de tables */}
          {localSettings.tableSelectionMode === "specific" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Sélectionner les nombres
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllTables}
                    className="h-7 text-xs"
                  >
                    Tout
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAllTables}
                    className="h-7 text-xs"
                  >
                    Aucun
                  </Button>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto border rounded-lg p-3">
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                  {Array.from({ length: 100 }, (_, i) => i + 1).map(
                    (table) => (
                      <div
                        key={table}
                        className="flex items-center space-x-1.5"
                      >
                        <Checkbox
                          id={`table-${table}`}
                          checked={localSettings.specificTables.includes(
                            table,
                          )}
                          onCheckedChange={() => handleTableToggle(table)}
                        />
                        <Label
                          htmlFor={`table-${table}`}
                          className="text-xs cursor-pointer"
                        >
                          {table}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {localSettings.specificTables.length} nombre(s) sélectionné(s)
              </div>
            </div>
          )}

          {/* Plage de multiplicateurs */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Plage de multiplicateurs
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="multiplier-min" className="text-xs">
                  Minimum
                </Label>
                <Input
                  id="multiplier-min"
                  type="number"
                  min={0}
                  max={localSettings.multiplierMax}
                  value={localSettings.multiplierMin}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      multiplierMin: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="multiplier-max" className="text-xs">
                  Maximum
                </Label>
                <Input
                  id="multiplier-max"
                  type="number"
                  min={localSettings.multiplierMin}
                  max={100}
                  value={localSettings.multiplierMax}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      multiplierMax: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
