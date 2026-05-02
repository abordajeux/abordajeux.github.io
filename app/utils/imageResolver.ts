export function resolveImage(src: string | undefined) {
    if (!src) {
        return ""
    }
  // external image (http, https, etc.)
  if (/^https?:\/\//.test(src)) {
    return src
  }

  // local asset (from /assets)
  return new URL(`../assets/images/${src}`, import.meta.url).href
}
