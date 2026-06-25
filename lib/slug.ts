export function generateSlug(name: string, country: string): string {
  const base = `${name} ${country}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return base || "resort";
}
