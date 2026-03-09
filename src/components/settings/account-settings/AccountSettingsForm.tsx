"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserSettings } from "@/lib/supabase/settings-actions";
import { COUNTRIES, CURRENCIES, DATE_FORMATS, DEFAULT_SETTINGS } from "@/types/database";
import type { Currency, DistanceUnit, VolumeUnit, DateFormat } from "@/types/database";
import { Save } from "lucide-react";

interface AccountSettingsFormProps {
  initialSettings: {
    country: string | null;
    currency: Currency | null;
    distance_unit: DistanceUnit | null;
    volume_unit: VolumeUnit | null;
    date_format: DateFormat | null;
  } | null;
}

export function AccountSettingsForm({ initialSettings }: AccountSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Use defaults if settings are null
  const settings = {
    country: initialSettings?.country || DEFAULT_SETTINGS.country,
    currency: initialSettings?.currency || DEFAULT_SETTINGS.currency,
    distance_unit: initialSettings?.distance_unit || DEFAULT_SETTINGS.distance_unit,
    volume_unit: initialSettings?.volume_unit || DEFAULT_SETTINGS.volume_unit,
    date_format: initialSettings?.date_format || DEFAULT_SETTINGS.date_format,
  };

  const [formData, setFormData] = useState(settings);

  const handleSubmit = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await updateUserSettings(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else if (result.success) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      }
    });
  };

  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRIES.find((c) => c.code === countryCode);
    if (country) {
      setFormData({
        country: countryCode,
        currency: country.currency,
        distance_unit: country.distance,
        volume_unit: country.volume,
        date_format: country.dateFormat,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Defaults</CardTitle>
        <CardDescription>
          Set your default preferences. These will be used as defaults for new vehicles.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={formData.country}
            onValueChange={handleCountryChange}
            disabled={isPending}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) =>
              setFormData({ ...formData, currency: value as Currency })
            }
            disabled={isPending}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr.value} value={curr.value}>
                  {curr.label} ({curr.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Distance Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="distance_unit">Distance Unit</Label>
            <Select
              value={formData.distance_unit}
              onValueChange={(value) =>
                setFormData({ ...formData, distance_unit: value as DistanceUnit })
              }
              disabled={isPending}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mi">Miles (mi)</SelectItem>
                <SelectItem value="km">Kilometers (km)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume_unit">Volume Unit</Label>
            <Select
              value={formData.volume_unit}
              onValueChange={(value) =>
                setFormData({ ...formData, volume_unit: value as VolumeUnit })
              }
              disabled={isPending}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gal">Gallons (gal)</SelectItem>
                <SelectItem value="l">Liters (l)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Format */}
        <div className="space-y-2">
          <Label htmlFor="date_format">Date Format</Label>
          <Select
            value={formData.date_format}
            onValueChange={(value) =>
              setFormData({ ...formData, date_format: value as DateFormat })
            }
            disabled={isPending}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_FORMATS.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label} (e.g., {format.example})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-sm ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Save Button */}
        <Button onClick={handleSubmit} disabled={isPending} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
