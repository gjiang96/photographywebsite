import counts from 'virtual:gallery-counts'

export const galleries = {
  landscape: { title: 'Landscape' },
  portrait: { title: 'Portrait' },
  film: { title: 'Film' },
  animal: { title: 'Animal' },
  abstract: { title: 'Abstract' },
}

export function getGalleryImages(category) {
  const gallery = galleries[category]
  const count = counts[category]
  if (!gallery || !count) return []

  const images = []
  for (let i = count; i >= 1; i--) {
    images.push({
      num: i,
      src: `/images/${category}/web/${i}.jpg`,
      lightboxSrc: `/images/${category}/original/${i}.jpg`,
      alt: `${gallery.title} photo ${i}`,
    })
  }
  return images
}
