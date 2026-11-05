import { prisma } from "../src/client"

const shortDescription =
  "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit."
const description =
  `${shortDescription} ${shortDescription} ${shortDescription}`

const sampleProducts = [
  {
    name: "Adidas CoreFit T-Shirt",
    shortDescription,
    description,
    price: 39.9,
    sizes: ["s", "m", "l", "xl", "xxl"],
    colors: ["gray", "purple", "green"],
    images: {
      gray: "/products/1g.png",
      purple: "/products/1p.png",
      green: "/products/1gr.png",
    },
  },
  {
    name: "Puma Ultra Warm Zip",
    shortDescription,
    description,
    price: 59.9,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "green"],
    images: { gray: "/products/2g.png", green: "/products/2gr.png" },
  },
  {
    name: "Nike Air Essentials Pullover",
    shortDescription,
    description,
    price: 69.9,
    sizes: ["s", "m", "l"],
    colors: ["green", "blue", "black"],
    images: {
      green: "/products/3gr.png",
      blue: "/products/3b.png",
      black: "/products/3bl.png",
    },
  },
  {
    name: "Nike Dri Flex T-Shirt",
    shortDescription,
    description,
    price: 29.9,
    sizes: ["s", "m", "l"],
    colors: ["white", "pink"],
    images: { white: "/products/4w.png", pink: "/products/4p.png" },
  },
  {
    name: "Under Armour StormFleece",
    shortDescription,
    description,
    price: 49.9,
    sizes: ["s", "m", "l"],
    colors: ["red", "orange", "black"],
    images: {
      red: "/products/5r.png",
      orange: "/products/5o.png",
      black: "/products/5bl.png",
    },
  },
  {
    name: "Nike Air Max 270",
    shortDescription,
    description,
    price: 59.9,
    sizes: ["40", "42", "43", "44"],
    colors: ["gray", "white"],
    images: { gray: "/products/6g.png", white: "/products/6w.png" },
  },
  {
    name: "Nike Ultraboost Pulse ",
    shortDescription,
    description,
    price: 69.9,
    sizes: ["40", "42", "43"],
    colors: ["gray", "pink"],
    images: { gray: "/products/7g.png", pink: "/products/7p.png" },
  },
  {
    name: "Levi’s Classic Denim",
    shortDescription,
    description,
    price: 59.9,
    sizes: ["s", "m", "l"],
    colors: ["blue", "green"],
    images: { blue: "/products/8b.png", green: "/products/8gr.png" },
  },
]

const seed = async () => {
  const category = await prisma.category.upsert({
    where: { slug: "test" },
    update: {},
    create: { name: "Test", slug: "test" },
  })

  for (const product of sampleProducts) {
    const existingProduct = await prisma.product.findFirst({
      where: { categorySlug: category.slug, name: product.name },
      select: { id: true },
    })

    if (!existingProduct) {
      await prisma.product.create({
        data: { ...product, categorySlug: category.slug },
      })
    }
  }
}

try {
  await seed()
} finally {
  await prisma.$disconnect()
}
