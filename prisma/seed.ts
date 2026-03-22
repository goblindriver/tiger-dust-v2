import { PrismaClient } from '@prisma/client';
import {
  collectionsSeed,
  locationsSeed,
  objectTypesSeed,
  starterTagsSeed,
} from '../src/features/domain/seed-data';

const prisma = new PrismaClient();

async function upsertObjectTypes() {
  for (const [slug, name] of objectTypesSeed) {
    await prisma.objectType.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
  }
}

async function upsertLocations() {
  const locationIdsBySlug = new Map<string, string>();

  for (const [slug, name, locationType] of locationsSeed.filter(([, , , parent]) => parent === null)) {
    const record = await prisma.location.upsert({
      where: { slug },
      update: { name, locationType },
      create: { slug, name, locationType },
    });

    locationIdsBySlug.set(slug, record.id);
  }

  for (const [slug, name, locationType, parentSlug] of locationsSeed.filter(([, , , parent]) => parent !== null)) {
    const parentLocationId = parentSlug ? locationIdsBySlug.get(parentSlug) : null;

    const record = await prisma.location.upsert({
      where: { slug },
      update: { name, locationType, parentLocationId },
      create: { slug, name, locationType, parentLocationId },
    });

    locationIdsBySlug.set(slug, record.id);
  }
}

async function upsertTags() {
  for (const [slug, name, tagType] of starterTagsSeed) {
    await prisma.tag.upsert({
      where: { slug },
      update: { name, tagType },
      create: { slug, name, tagType },
    });
  }
}

async function upsertCollections() {
  for (const [slug, name, visibility] of collectionsSeed) {
    await prisma.collection.upsert({
      where: { slug },
      update: { name, visibility },
      create: { slug, name, visibility },
    });
  }
}

async function upsertPlaceholderUsers() {
  await prisma.user.upsert({
    where: { email: 'jason@jasongronvold.com' },
    update: { displayName: 'Jason Gronvold', role: 'admin' },
    create: { email: 'jason@jasongronvold.com', displayName: 'Jason Gronvold', role: 'admin' },
  });

  await prisma.user.upsert({
    where: { email: 'laura@tigerdust.local' },
    update: { displayName: 'Laura Sefkow', role: 'admin' },
    create: { email: 'laura@tigerdust.local', displayName: 'Laura Sefkow', role: 'admin' },
  });

  await prisma.user.upsert({
    where: { email: 'sarah@tigerdust.local' },
    update: { displayName: 'Sarah', role: 'operator' },
    create: { email: 'sarah@tigerdust.local', displayName: 'Sarah', role: 'operator' },
  });
}

async function main() {
  await upsertObjectTypes();
  await upsertLocations();
  await upsertTags();
  await upsertCollections();
  await upsertPlaceholderUsers();

  console.log('Tiger Dust v2 seed scaffold complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
