export const getDarkerColor = (hexColor: string, facteur = 0.8) => {
  hexColor = hexColor.replace(/^#/, "");

  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  const rFonce = Math.max(0, Math.floor(r * facteur));
  const gFonce = Math.max(0, Math.floor(g * facteur));
  const bFonce = Math.max(0, Math.floor(b * facteur));

  const toHex = (value: number) => value.toString(16).padStart(2, "0");

  return `#${toHex(rFonce)}${toHex(gFonce)}${toHex(bFonce)}`;
};
