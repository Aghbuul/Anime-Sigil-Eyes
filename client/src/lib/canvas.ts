export function setupCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement
) {
  canvas.width = image.width;
  canvas.height = image.height;
}

export function drawImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(image, 0, 0);
}

export function overlaySignal(
  ctx: CanvasRenderingContext2D,
  sigil: HTMLImageElement,
  x: number,
  y: number,
  sizePercent: number,
  opacity: number,
  rotation: number = 0
) {
  const size = (sizePercent / 100) * Math.min(ctx.canvas.width, ctx.canvas.height) / 4;
  const halfSize = size / 2;

  ctx.save();
  ctx.globalAlpha = opacity / 100;
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180); // Convert degrees to radians
  ctx.drawImage(
    sigil,
    -halfSize,
    -halfSize,
    size,
    size
  );
  ctx.restore();
}

export type SigilPosition = {
  x: number;
  y: number;
  rotation: number;
};

export function adjustPosition(position: SigilPosition, key: string, amount: number): SigilPosition {
  switch (key) {
    case 'ArrowLeft':
      return { ...position, x: position.x - amount };
    case 'ArrowRight':
      return { ...position, x: position.x + amount };
    case 'ArrowUp':
      return { ...position, y: position.y - amount };
    case 'ArrowDown':
      return { ...position, y: position.y + amount };
    case '[':
      return { ...position, rotation: position.rotation - amount };
    case ']':
      return { ...position, rotation: position.rotation + amount };
    default:
      return position;
  }
}