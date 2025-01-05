import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface ControlsProps {
  selectedEyes: {
    left: boolean;
    right: boolean;
  };
  onEyeSelectionChange: (selection: { left: boolean; right: boolean }) => void;
  sigilSize: number;
  onSigilSizeChange: (size: number) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  selectedSigil: string;
  onSigilChange: (sigil: string) => void;
  onSigilUpload: (file: File) => void;
}

export function Controls({
  selectedEyes,
  onEyeSelectionChange,
  sigilSize,
  onSigilSizeChange,
  opacity,
  onOpacityChange,
  selectedSigil,
  onSigilChange,
  onSigilUpload,
}: ControlsProps) {
  const [sizeInput, setSizeInput] = useState(sigilSize.toString());
  const [opacityInput, setOpacityInput] = useState(opacity.toString());
  const [availableSigils, setAvailableSigils] = useState<string[]>([]);

  useEffect(() => {
    // Fetch available sigils from the API
    fetch("/api/sigils")
      .then(res => res.json())
      .then(data => setAvailableSigils(data))
      .catch(console.error);
  }, []);

  const handleSizeInputChange = (value: string) => {
    setSizeInput(value);
    const size = Number(value);
    if (!isNaN(size) && size >= 0 && size <= 300) {
      onSigilSizeChange(size);
    }
  };

  const handleOpacityInputChange = (value: string) => {
    setOpacityInput(value);
    const opacityValue = Number(value);
    if (!isNaN(opacityValue) && opacityValue >= 0 && opacityValue <= 100) {
      onOpacityChange(opacityValue);
    }
  };

  const handleSigilUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSigilUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Eye Selection</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="left-eye">Left Eye</Label>
            <Switch
              id="left-eye"
              checked={selectedEyes.left}
              onCheckedChange={(checked) =>
                onEyeSelectionChange({ ...selectedEyes, left: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="right-eye">Right Eye</Label>
            <Switch
              id="right-eye"
              checked={selectedEyes.right}
              onCheckedChange={(checked) =>
                onEyeSelectionChange({ ...selectedEyes, right: checked })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Sigil Size</h3>
        <div className="flex items-center gap-4">
          <Slider
            min={0}
            max={300}
            step={1}
            value={[sigilSize]}
            onValueChange={([value]) => handleSizeInputChange(value.toString())}
            className="flex-1"
          />
          <Input
            type="number"
            min={0}
            max={300}
            value={sizeInput}
            onChange={(e) => handleSizeInputChange(e.target.value)}
            className="w-20"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Opacity</h3>
        <div className="flex items-center gap-4">
          <Slider
            min={0}
            max={100}
            step={1}
            defaultValue={[35]}
            value={[opacity]}
            onValueChange={([value]) => handleOpacityInputChange(value.toString())}
            className="flex-1"
          />
          <Input
            type="number"
            min={0}
            max={100}
            value={opacityInput}
            onChange={(e) => handleOpacityInputChange(e.target.value)}
            className="w-20"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Select Sigil</h3>
        <div className="grid grid-cols-2 gap-2">
          {availableSigils.map((sigil) => (
            <Card
              key={sigil}
              className={`p-2 cursor-pointer transition-colors ${
                selectedSigil === sigil ? "border-primary" : ""
              }`}
              onClick={() => onSigilChange(sigil)}
            >
              <img
                src={`/api/sigils/${sigil}`}
                alt={sigil}
                className="w-full h-auto"
              />
            </Card>
          ))}
        </div>

        <div className="pt-4">
          <Label htmlFor="sigil-upload">Upload Custom Sigil</Label>
          <Input
            id="sigil-upload"
            type="file"
            accept="image/*"
            onChange={handleSigilUpload}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}