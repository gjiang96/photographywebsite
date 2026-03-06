// Dynamically import web-optimised gallery images (web/ subfolder only)
const imageModules = import.meta.glob('/public/images/*/web/*.{jpg,JPG,jpeg,JPEG}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const galleries = {
  landscape: { title: 'Landscape' },
  portrait: { title: 'Portrait' },
  film: { title: 'Film' },
  animal: { title: 'Animal' },
  abstract: { title: 'Abstract' },
}

export function getGalleryImages(category) {
  const gallery = galleries[category]
  if (!gallery) return []

  // Filter images for this category and extract image info
  const images = []
  const basePath = `/public/images/${category}/web/`

  for (const [path] of Object.entries(imageModules)) {
    if (path.startsWith(basePath)) {
      // Extract filename and number (e.g., "1.jpg" -> 1)
      const filename = path.replace(basePath, '')
      const match = filename.match(/^(\d+)\.(jpg|JPG|jpeg|JPEG)$/)

      if (match) {
        const num = parseInt(match[1], 10)
        images.push({
          num,
          src: path.replace('/public', ''), // Remove /public prefix for actual URL
          alt: `${gallery.title} photo ${num}`,
        })
      }
    }
  }

  // Sort by number
  images.sort((a, b) => a.num - b.num)

  return images
}
