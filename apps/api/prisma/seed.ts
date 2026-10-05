import { PrismaClient, Role, OrderStatus, PaymentStatus, PaymentProvider } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing records in reverse dependency order
  await prisma.review.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.profile.deleteMany();

  console.log("🧹 Cleaned old seed records");

  // 1. Seed Profiles (Admin & Customer)
  const adminProfile = await prisma.profile.create({
    data: {
      userId: "11111111-1111-1111-1111-111111111111",
      email: "admin@client-ecommerce.com",
      fullName: "Admin Store Manager",
      phone: "+1-555-0199",
      role: Role.ADMIN,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  const customerProfile = await prisma.profile.create({
    data: {
      userId: "22222222-2222-2222-2222-222222222222",
      email: "customer@example.com",
      fullName: "John Doe",
      phone: "+1-555-0144",
      role: Role.CUSTOMER,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
  });

  console.log("👤 Created Admin and Customer profiles");

  // 2. Seed Customer Address
  const customerAddress = await prisma.address.create({
    data: {
      profileId: customerProfile.id,
      recipient: "John Doe",
      street: "742 Evergreen Terrace",
      city: "Springfield",
      state: "IL",
      postalCode: "62704",
      country: "USA",
      isDefault: true,
    },
  });

  console.log("🏠 Created Customer Shipping Address");

  // 3. Seed Categories & Subcategories
  const electronicsCategory = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
      description: "Cutting-edge gadgets, computing, and high-fidelity audio equipment.",
      imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600",
      subcategories: {
        create: [
          {
            name: "Laptops & Computers",
            slug: "laptops-computers",
            description: "High-performance laptops, workstations, and ultrabooks.",
          },
          {
            name: "Audio & Headphones",
            slug: "audio-headphones",
            description: "Noise-canceling headphones, wireless earbuds, and studio monitors.",
          },
          {
            name: "Smartphones & Wearables",
            slug: "smartphones-wearables",
            description: "Next-gen flagship phones and smartwatches.",
          },
        ],
      },
    },
    include: { subcategories: true },
  });

  const fashionCategory = await prisma.category.create({
    data: {
      name: "Fashion & Apparel",
      slug: "fashion-apparel",
      description: "Premium clothing, footwear, and designer accessories.",
      imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600",
      subcategories: {
        create: [
          {
            name: "Men's Apparel",
            slug: "mens-apparel",
            description: "Jackets, shirts, trousers, and casual wear for men.",
          },
          {
            name: "Footwear & Sneakers",
            slug: "footwear-sneakers",
            description: "Athletic running shoes, boots, and luxury sneakers.",
          },
        ],
      },
    },
    include: { subcategories: true },
  });

  console.log("📦 Created Categories & Subcategories");

  // Get subcategory IDs
  const laptopSubcategory = electronicsCategory.subcategories.find(
    (s) => s.slug === "laptops-computers"
  )!;
  const audioSubcategory = electronicsCategory.subcategories.find(
    (s) => s.slug === "audio-headphones"
  )!;
  const mensSubcategory = fashionCategory.subcategories.find(
    (s) => s.slug === "mens-apparel"
  )!;

  // 4. Seed Products with Variants & Images

  // Product 1: Pro Studio Laptop 16"
  const laptopProduct = await prisma.product.create({
    data: {
      subcategoryId: laptopSubcategory.id,
      title: "Pro Studio Laptop 16",
      slug: "pro-studio-laptop-16",
      description:
        "The ultimate workstation laptop engineered for creators, software architects, and power users. Featuring a Liquid Retina display, 12-core CPU, and up to 22 hours of battery life.",
      basePrice: 2499.99,
      isFeatured: true,
      isActive: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
            altText: "Pro Studio Laptop 16 front view",
            isPrimary: true,
            sortOrder: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800",
            altText: "Pro Studio Laptop 16 side profile",
            isPrimary: false,
            sortOrder: 2,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "LAP-16-16-512-SLV",
            name: "16GB RAM / 512GB SSD - Space Silver",
            price: 2499.99,
            stockCount: 15,
            attributes: { ram: "16GB", storage: "512GB", color: "Space Silver" },
          },
          {
            sku: "LAP-16-32-1TB-GRY",
            name: "32GB RAM / 1TB SSD - Space Gray",
            price: 2999.99,
            stockCount: 8,
            attributes: { ram: "32GB", storage: "1TB", color: "Space Gray" },
          },
        ],
      },
    },
  });

  // Product 2: AcousticMax Wireless ANC Headphones
  const audioProduct = await prisma.product.create({
    data: {
      subcategoryId: audioSubcategory.id,
      title: "AcousticMax Wireless ANC Headphones",
      slug: "acousticmax-wireless-anc-headphones",
      description:
        "Immerse yourself in pristine audio purity with Active Noise Cancellation, custom 40mm beryllium drivers, and 40-hour playback duration.",
      basePrice: 349.99,
      isFeatured: true,
      isActive: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
            altText: "AcousticMax Headphones Matte Black",
            isPrimary: true,
            sortOrder: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
            altText: "AcousticMax Headphones on wooden stand",
            isPrimary: false,
            sortOrder: 2,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "AUD-ANC-BLK",
            name: "Matte Black",
            price: 349.99,
            stockCount: 45,
            attributes: { color: "Matte Black" },
          },
          {
            sku: "AUD-ANC-SLV",
            name: "Brushed Silver",
            price: 349.99,
            stockCount: 22,
            attributes: { color: "Brushed Silver" },
          },
        ],
      },
    },
  });

  // Product 3: Executive Wool Blend Blazer
  const blazerProduct = await prisma.product.create({
    data: {
      subcategoryId: mensSubcategory.id,
      title: "Executive Wool Blend Blazer",
      slug: "executive-wool-blend-blazer",
      description:
        "Tailored modern-fit blazer crafted from Italian wool blend fabric. Perfect for professional executive meetings and formal evening engagements.",
      basePrice: 289.00,
      isFeatured: false,
      isActive: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
            altText: "Executive Wool Blazer Navy",
            isPrimary: true,
            sortOrder: 1,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "BLZ-NAV-M",
            name: "Navy Blue / Medium",
            price: 289.00,
            stockCount: 12,
            attributes: { color: "Navy Blue", size: "M" },
          },
          {
            sku: "BLZ-NAV-L",
            name: "Navy Blue / Large",
            price: 289.00,
            stockCount: 18,
            attributes: { color: "Navy Blue", size: "L" },
          },
        ],
      },
    },
  });

  console.log("💻 Seeded Products with Variants & Images");

  // 5. Seed Reviews for Audio Headphones
  await prisma.review.create({
    data: {
      productId: audioProduct.id,
      profileId: customerProfile.id,
      rating: 5,
      comment: "Incredible soundstage and the ANC isolates bus noise completely! Battery life lasts all week.",
    },
  });

  console.log("⭐ Seeded Customer Product Review");

  // 6. Seed Sample Order
  const laptopVariant = await prisma.productVariant.findFirst({
    where: { productId: laptopProduct.id },
  })!;

  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: "ORD-20261005-0001",
      profileId: customerProfile.id,
      addressId: customerAddress.id,
      status: OrderStatus.PAID,
      subtotal: 2499.99,
      tax: 200.00,
      shippingCost: 0.00,
      totalAmount: 2699.99,
      trackingNumber: "TRK-987654321-US",
      items: {
        create: [
          {
            productVariantId: laptopVariant!.id,
            unitPrice: 2499.99,
            quantity: 1,
            totalPrice: 2499.99,
          },
        ],
      },
      transactions: {
        create: [
          {
            provider: PaymentProvider.STRIPE,
            transactionId: "ch_3N1234567890abcdef",
            status: PaymentStatus.COMPLETED,
            amount: 2699.99,
            rawResponse: { stripePaymentIntentId: "pi_3N1234567890abcdef" },
          },
        ],
      },
    },
  });

  console.log(`🧾 Seeded Sample Order ${sampleOrder.orderNumber}`);
  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
