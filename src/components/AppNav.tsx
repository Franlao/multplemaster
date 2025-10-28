"use client";

import * as React from "react";
import { Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdvancedSettings as AdvancedSettingsType } from "@/types/quiz";

const STORAGE_KEY = "ultrathink-settings";

const defaultSettings: AdvancedSettingsType = {
  tableSelectionMode: "range",
  tableRangeMin: 1,
  tableRangeMax: 10,
  specificTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  multiplierMin: 0,
  multiplierMax: 10,
};

export function AppNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [settings, setSettings] = React.useState<AdvancedSettingsType>(defaultSettings);
  const [localSettings, setLocalSettings] = React.useState<AdvancedSettingsType>(defaultSettings);
  const [open, setOpen] = React.useState(false);

  // Load settings from localStorage
  React.useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
        setLocalSettings(parsed);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: AdvancedSettingsType) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent("settingsChanged", { detail: newSettings }));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const handleSave = () => {
    saveSettings(localSettings);
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex gap-2">
      {/* Settings Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
            title="Paramètres"
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Paramètres</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Paramètres</DialogTitle>
            <DialogDescription>
              Configurez les plages de nombres et multiplicateurs disponibles
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

      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
        title={
          theme === "light"
            ? "Mode sombre"
            : theme === "dark"
            ? "Mode système"
            : "Mode clair"
        }
      >
        {theme === "dark" ? (
          <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
        <span className="sr-only">Changer de thème</span>
      </Button>
    </div>
  );
}
