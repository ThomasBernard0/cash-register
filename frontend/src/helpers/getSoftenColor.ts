export const getSoftenColor = (hex: string, factor: number = 0.3): string => {
  factor = Math.max(0, Math.min(1, factor));

  hex = hex.replace(/^#/, "");

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const rSoft = Math.round(r + (255 - r) * factor);
  const gSoft = Math.round(g + (255 - g) * factor);
  const bSoft = Math.round(b + (255 - b) * factor);

  const toHex = (v: number) => v.toString(16).padStart(2, "0").toUpperCase();

  return `#${toHex(rSoft)}${toHex(gSoft)}${toHex(bSoft)}`;
};
