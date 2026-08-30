const imageModules = import.meta.glob<string>(
  [
    '../assets/images/*.{jpg,jpeg,png,webp,avif,gif,svg}',
    '../assets/images/nifff/**/*.{jpg,jpeg,png,webp,avif,gif,svg}',
    '../assets/images/games-carousel/**/*.{jpg,jpeg,png,webp,avif,gif,svg}',
    '../assets/images/presque/**/*.{jpg,jpeg,png,webp,avif,gif,svg}',
    '../assets/images/videos/**/*.{jpg,jpeg,png,webp,avif,gif,svg}',
  ],
  { eager: true, import: 'default' },
)

const imageByKey = new Map<string, string>()
for (const [globPath, url] of Object.entries(imageModules)) {
  const marker = 'assets/images/'
  const idx = globPath.lastIndexOf(marker)
  if (idx !== -1) {
    imageByKey.set(globPath.slice(idx + marker.length), url)
  }
}

const PATH_TRAVERSAL = /(^|\/)\.\.(\/|$)/

export function resolveImage(src: string | undefined) {
  if (!src) {
    return ''
  }
  if (/^https?:\/\//.test(src)) {
    return src
  }
  if (PATH_TRAVERSAL.test(src)) {
    return ''
  }

  const key = src.replace(/^\//, '')
  return imageByKey.get(key) ?? ''
}

export function resolveFile(src: string | undefined) {
  if (!src) {
    return ''
  }
  if (/^https?:\/\//.test(src)) {
    return src
  }
  return new URL(`../assets/files/${src}`, import.meta.url).href
}
