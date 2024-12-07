// utils/generateImage.ts
export const generateComplimentImage = async (
  text: string,
  category: string
): Promise<string> => {
  // Create canvas with higher resolution
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Double the dimensions for retina displays
  const scale = window.devicePixelRatio || 2;
  const width = 1200 * scale;
  const height = 630 * scale;

  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = "1200px";
  canvas.style.height = "630px";

  // Enable better text rendering
  ctx.textRendering = "optimizeLegibility";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Scale all rendering operations
  ctx.scale(scale, scale);

  // Clear canvas with white background first
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, "#f3e8ff"); // purple-100
  gradient.addColorStop(0.5, "#f5f3ff"); // violet-50
  gradient.addColorStop(1, "#fae8ff"); // fuchsia-100
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Add subtle texture/noise
  ctx.globalAlpha = 0.02;
  for (let i = 0; i < 1200; i += 4) {
    for (let j = 0; j < 630; j += 4) {
      if (Math.random() > 0.5) {
        ctx.fillStyle = "#000";
        ctx.fillRect(i, j, 2, 2);
      }
    }
  }
  ctx.globalAlpha = 1;

  // Draw card background
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  ctx.beginPath();
  ctx.roundRect(60, 60, 1080, 510, 20);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Add category text
  ctx.font = `700 32px "Geist"`;
  ctx.fillStyle = "#6b7280";
  ctx.textAlign = "left";
  ctx.fillText(category.toUpperCase(), 100, 120);

  // Add main compliment text with word wrap
  ctx.font = `600 56px "Geist"`;
  ctx.fillStyle = "#1f2937";
  const words = text.split(" ");
  let line = "";
  let y = 240;
  const maxWidth = 1000;

  words.forEach((word) => {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth) {
      ctx.fillText(line, 100, y);
      line = word + " ";
      y += 80;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, 100, y);

  // Add footer with logo/branding
  ctx.font = `500 28px "Geist"`;
  ctx.fillStyle = "#6b7280";
  ctx.fillText("oddlyspecific.com", 100, 520);

  // Use PNG format with maximum quality
  return canvas.toDataURL("image/png", 1.0);
};
