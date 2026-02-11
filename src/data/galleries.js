export const galleries = {
  landscape: {
    title: 'Landscape',
    count: 10,
    extensions: {},
  },
  portrait: {
    title: 'Portrait',
    count: 14,
    extensions: { 2: 'JPG', 6: 'JPG', 9: 'JPG' },
  },
  film: {
    title: 'Film',
    count: 8,
    extensions: {},
  },
  animal: {
    title: 'Animal',
    count: 10,
    extensions: {},
  },
  abstract: {
    title: 'Abstract',
    count: 0,
    extensions: {},
  },
}

export function getGalleryImages(category) {
  const gallery = galleries[category]
  if (!gallery || gallery.count === 0) return []

  return Array.from({ length: gallery.count }, (_, i) => {
    const num = i + 1
    const ext = gallery.extensions[num] || 'jpg'
    return {
      src: `/images/${category}/${num}.${ext}`,
      alt: `${gallery.title} photo ${num}`,
    }
  })
}
