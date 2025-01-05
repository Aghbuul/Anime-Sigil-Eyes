import { useState, useRef, useEffect } from "react";
import { ImageUpload } from "./ImageUpload";
import { Controls } from "./Controls";
import { DraggableSigil } from "./DraggableSigil";
import { setupCanvas, drawImage, overlaySignal, type SigilPosition } from "@/lib/canvas";
import { detectFaceLandmarks } from "@/lib/face-detection";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Crosshair, Plus } from "lucide-react";

export function ImageEditor() {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [sigilImage, setSigilImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEyes, setSelectedEyes] = useState<{left: boolean, right: boolean}>({
    left: true,
    right: true
  });
  const [sigilPositions, setSigilPositions] = useState<Array<SigilPosition>>([]);
  const [selectedSigilIndex, setSelectedSigilIndex] = useState<number | null>(null);
  const [sigilSize, setSigilSize] = useState(25);
  const [opacity, setOpacity] = useState(35);
  const [selectedSigil, setSelectedSigil] = useState("sigil1.png");
  const [scale, setScale] = useState(1);
  const [isManualMode, setIsManualMode] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadSigil = async (filename: string) => {
      try {
        const img = new Image();
        img.onload = () => setSigilImage(img);
        img.onerror = () => toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load sigil image"
        });
        img.src = `/api/sigils/${filename}`;
      } catch (error) {
        console.error("Error loading sigil:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load sigil image"
        });
      }
    };

    loadSigil(selectedSigil);
  }, [selectedSigil]);

  useEffect(() => {
    if (!sourceImage || !canvasRef.current || !containerRef.current) return;

    const processImage = async () => {
      setLoading(true);
      try {
        const canvas = canvasRef.current!;
        const container = containerRef.current!;

        // Set initial canvas size to match image
        canvas.width = sourceImage.width;
        canvas.height = sourceImage.height;

        // Calculate scale to fit container
        const containerWidth = container.clientWidth;
        const scale = containerWidth / sourceImage.width;
        setScale(scale);

        // Set display size
        canvas.style.width = `${sourceImage.width * scale}px`;
        canvas.style.height = `${sourceImage.height * scale}px`;

        const landmarks = await detectFaceLandmarks(sourceImage);
        if (landmarks && landmarks.length > 0) {
          setSigilPositions(landmarks.map(l => ({
            x: l.x * sourceImage.width * scale,
            y: l.y * sourceImage.height * scale,
            rotation: 0
          })));
          setIsManualMode(false);
          toast({
            title: "Success",
            description: `Found ${landmarks.length} eye${landmarks.length > 1 ? 's' : ''}`
          });
        } else {
          toast({
            variant: "destructive",
            title: "No faces detected",
            description: "Try manual placement or adjust the image"
          });
        }
      } catch (error) {
        console.error("Face detection error:", error);
        toast({
          variant: "destructive",
          title: "Detection failed",
          description: "Try manual placement or a different image"
        });
      } finally {
        setLoading(false);
      }
    };

    processImage();
  }, [sourceImage]);

  useEffect(() => {
    if (!canvasRef.current || !sourceImage || !sigilImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw base image
    drawImage(ctx, sourceImage);

    // Overlay sigils based on selection
    sigilPositions.forEach((position, idx) => {
      overlaySignal(
        ctx,
        sigilImage,
        position.x / scale,
        position.y / scale,
        sigilSize,
        opacity,
        position.rotation
      );
    });
  }, [sourceImage, sigilImage, sigilPositions, scale, sigilSize, opacity]);

  const handlePositionChange = (index: number, newPosition: SigilPosition) => {
    setSigilPositions(positions =>
      positions.map((pos, i) => i === index ? newPosition : pos)
    );
  };

  const handleSigilUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("sigil", file);

    try {
      const response = await fetch("/api/sigils", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload sigil");

      const { filename } = await response.json();
      setSelectedSigil(filename);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload custom sigil"
      });
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'sigil-overlay.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const helpText = (
    <div className="space-y-2 max-w-xs">
      <p><strong>Mouse Controls:</strong></p>
      <ul className="list-disc list-inside">
        <li>Click a sigil to select it</li>
        <li>Drag to move selected sigil</li>
      </ul>
      <p><strong>Keyboard Controls:</strong></p>
      <ul className="list-disc list-inside">
        <li>Arrow keys: Fine position adjustment</li>
        <li>Hold Shift + Arrow keys: Smaller adjustments</li>
        <li>[ and ] keys: Rotate selected sigil</li>
        <li>Click canvas to deselect</li>
      </ul>
    </div>
  );

  const detectFaces = async () => {
    if (!sourceImage || !canvasRef.current || !containerRef.current) return;

    setLoading(true);
    try {
      const canvas = canvasRef.current;
      const container = containerRef.current;

      // Set initial canvas size to match image
      canvas.width = sourceImage.width;
      canvas.height = sourceImage.height;

      // Calculate scale to fit container
      const containerWidth = container.clientWidth;
      const scale = containerWidth / sourceImage.width;
      setScale(scale);

      // Set display size
      canvas.style.width = `${sourceImage.width * scale}px`;
      canvas.style.height = `${sourceImage.height * scale}px`;

      const landmarks = await detectFaceLandmarks(sourceImage);
      if (landmarks && landmarks.length > 0) {
        setSigilPositions(landmarks.map(l => ({
          x: l.x * sourceImage.width * scale,
          y: l.y * sourceImage.height * scale,
          rotation: 0
        })));
        setIsManualMode(false);
        toast({
          title: "Success",
          description: `Found ${landmarks.length} eye${landmarks.length > 1 ? 's' : ''}`
        });
      } else {
        toast({
          variant: "destructive",
          title: "No faces detected",
          description: "Try manual placement or adjust the image"
        });
      }
    } catch (error) {
      console.error("Face detection error:", error);
      toast({
        variant: "destructive",
        title: "Detection failed",
        description: "Try manual placement or a different image"
      });
    } finally {
      setLoading(false);
    }
  };

  const addManualSigil = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const newPosition = {
      x: canvas.width * scale / 2,
      y: canvas.height * scale / 2,
      rotation: 0
    };

    setSigilPositions(prev => [...prev, newPosition]);
    setSelectedSigilIndex(sigilPositions.length);
    setIsManualMode(true);
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Processing image...</p>
        </div>
      )}

      {!sourceImage ? (
        <ImageUpload onImageLoaded={setSourceImage} />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="relative" ref={containerRef}>
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" align="start" className="p-4">
                      {helpText}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={detectFaces}
                  disabled={loading}
                >
                  <Crosshair className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addManualSigil}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <canvas
                ref={canvasRef}
                className="w-full h-auto border rounded-lg shadow-sm"
                onClick={() => setSelectedSigilIndex(null)}
              />
              {sigilPositions.map((position, idx) => (
                <DraggableSigil
                  key={idx}
                  position={position}
                  onPositionChange={(pos) => handlePositionChange(idx, pos)}
                  isSelected={selectedSigilIndex === idx}
                  onSelect={() => setSelectedSigilIndex(idx)}
                />
              ))}
            </div>
          </div>

          <div className="w-full md:w-64 space-y-4">
            <Controls
              selectedEyes={selectedEyes}
              onEyeSelectionChange={setSelectedEyes}
              sigilSize={sigilSize}
              onSigilSizeChange={setSigilSize}
              opacity={opacity}
              onOpacityChange={setOpacity}
              selectedSigil={selectedSigil}
              onSigilChange={setSelectedSigil}
              onSigilUpload={handleSigilUpload}
            />

            <Button
              className="w-full"
              onClick={handleDownload}
              disabled={loading}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Result
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSourceImage(null)}
              disabled={loading}
            >
              Upload New Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}