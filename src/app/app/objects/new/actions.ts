'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb, isDatabaseConfigured } from '@/lib/db';

export type CreateObjectActionState = {
  status: 'idle' | 'error';
  message?: string;
};

const intakeSchema = z.object({
  title: z.string().trim().min(1, 'Working title is required.'),
  objectTypeSlug: z.string().trim().min(1, 'Object type is required.'),
  lifecycleStatus: z.string().trim().min(1, 'Lifecycle status is required.'),
  intakeStage: z.string().trim().min(1, 'Intake stage is required.'),
  routeIntent: z.string().trim().min(1, 'Route intent is required.'),
  visibility: z.string().trim().min(1, 'Visibility is required.'),
  primaryLocationSlug: z.string().trim().min(1, 'Primary location is required.'),
  acquisitionType: z.string().trim().optional(),
  acquisitionSource: z.string().trim().optional(),
  askingPrice: z.string().trim().optional(),
  descriptionShort: z.string().trim().optional(),
  materials: z.string().trim().optional(),
  conditionNotes: z.string().trim().optional(),
  tags: z.string().trim().optional(),
});

const initialState: CreateObjectActionState = { status: 'idle' };

function normalizeEmpty(value?: string) {
  return value && value.length > 0 ? value : undefined;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'object';
}

function parsePriceToCents(value?: string) {
  if (!value) return undefined;

  const normalized = value.replace(/[$,\s]/g, '');

  if (!normalized) return undefined;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error('Asking price must look like 285 or 285.00.');
  }

  return Math.round(Number(normalized) * 100);
}

async function buildUniqueSlug(db: ReturnType<typeof getDb>, title: string) {
  const baseSlug = slugify(title);

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
    const existing = await db.object.findUnique({ where: { slug: candidate }, select: { id: true } });

    if (!existing) {
      return candidate;
    }
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function createObjectAction(
  _previousState: CreateObjectActionState,
  formData: FormData,
): Promise<CreateObjectActionState> {
  if (!isDatabaseConfigured()) {
    return {
      status: 'error',
      message: 'DATABASE_URL is missing, so create stays demo-safe for now. Seed/configure the DB to make intake writes real.',
    };
  }

  const parsed = intakeSchema.safeParse({
    title: formData.get('title'),
    objectTypeSlug: formData.get('objectTypeSlug'),
    lifecycleStatus: formData.get('lifecycleStatus'),
    intakeStage: formData.get('intakeStage'),
    routeIntent: formData.get('routeIntent'),
    visibility: formData.get('visibility'),
    primaryLocationSlug: formData.get('primaryLocationSlug'),
    acquisitionType: formData.get('acquisitionType'),
    acquisitionSource: formData.get('acquisitionSource'),
    askingPrice: formData.get('askingPrice'),
    descriptionShort: formData.get('descriptionShort'),
    materials: formData.get('materials'),
    conditionNotes: formData.get('conditionNotes'),
    tags: formData.get('tags'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'The intake form is incomplete.',
    };
  }

  try {
    const db = getDb();
    const user = await getCurrentUser();
    const actorUserId = user?.source === 'database' ? user.id : undefined;

    const [objectType, location] = await Promise.all([
      db.objectType.findUnique({ where: { slug: parsed.data.objectTypeSlug }, select: { id: true } }),
      db.location.findUnique({ where: { slug: parsed.data.primaryLocationSlug }, select: { id: true, name: true } }),
    ]);

    if (!objectType) {
      return {
        status: 'error',
        message: `Object type “${parsed.data.objectTypeSlug}” was not found. Run the seed data first.`,
      };
    }

    if (!location) {
      return {
        status: 'error',
        message: `Location “${parsed.data.primaryLocationSlug}” was not found. Run the seed data first.`,
      };
    }

    const askingPriceCents = parsePriceToCents(parsed.data.askingPrice);
    const slug = await buildUniqueSlug(db, parsed.data.title);
    const now = new Date();

    const created = await db.$transaction(async (tx) => {
      const object = await tx.object.create({
        data: {
          slug,
          title: parsed.data.title,
          objectTypeId: objectType.id,
          lifecycleStatus: parsed.data.lifecycleStatus,
          intakeStage: parsed.data.intakeStage,
          routeIntent: parsed.data.routeIntent,
          visibility: parsed.data.visibility,
          primaryLocationId: location.id,
          acquisitionType: normalizeEmpty(parsed.data.acquisitionType),
          acquisitionSource: normalizeEmpty(parsed.data.acquisitionSource),
          askingPriceCents,
          descriptionShort: normalizeEmpty(parsed.data.descriptionShort),
          materials: normalizeEmpty(parsed.data.materials),
          conditionNotes: normalizeEmpty(parsed.data.conditionNotes),
          createdByUserId: actorUserId,
          updatedByUserId: actorUserId,
        },
        select: { id: true, slug: true },
      });

      await tx.workflowEvent.create({
        data: {
          objectId: object.id,
          eventType: 'intake_created',
          toState: parsed.data.lifecycleStatus,
          notes: `Initial intake created${location.name ? ` at ${location.name}` : ''}.`,
          eventAt: now,
          createdByUserId: actorUserId,
        },
      });

      await tx.objectLocationHistory.create({
        data: {
          objectId: object.id,
          locationId: location.id,
          enteredAt: now,
          reason: 'initial intake placement',
          recordedByUserId: actorUserId,
        },
      });

      // Create tag links from the comma-separated tags field
      if (parsed.data.tags) {
        const tagSlugs = parsed.data.tags
          .split(',')
          .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
          .filter(Boolean);

        if (tagSlugs.length > 0) {
          const existingTags = await tx.tag.findMany({
            where: { slug: { in: tagSlugs } },
            select: { id: true, slug: true },
          });

          const existingSlugs = new Set(existingTags.map((t) => t.slug));

          // Create any tags that don't exist yet
          const newTagSlugs = tagSlugs.filter((s) => !existingSlugs.has(s));
          if (newTagSlugs.length > 0) {
            await tx.tag.createMany({
              data: newTagSlugs.map((slug) => ({
                slug,
                name: slug.replace(/-/g, ' '),
              })),
              skipDuplicates: true,
            });
          }

          const allTags = await tx.tag.findMany({
            where: { slug: { in: tagSlugs } },
            select: { id: true },
          });

          await tx.objectTag.createMany({
            data: allTags.map((tag) => ({ objectId: object.id, tagId: tag.id })),
            skipDuplicates: true,
          });
        }
      }

      return object;
    });

    revalidatePath('/app/objects');
    revalidatePath(`/app/objects/${created.slug ?? created.id}`);
    const redirectSlug = created.slug ?? created.id;
    redirect(`/app/objects/${redirectSlug}`);
  } catch (error) {
    // Next.js redirect() throws a special error — rethrow it so it works correctly
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
    const message = error instanceof Error ? error.message : 'Object create failed.';

    return {
      status: 'error',
      message,
    };
  }
}

export { initialState as createObjectInitialState };
