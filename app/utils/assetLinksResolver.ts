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

export function resolveFile(src: string | undefined) {
    if(!src) {
        return ""
    }
    if (/^https?:\/\//.test(src)) {
    return src
  }
    return new URL(`../assets/files/${src}`, import.meta.url).href

}
