'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb, isDatabaseConfigured } from '@/lib/db';

export type UpdateObjectActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

const updateObjectSchema = z.object({
  objectId: z.string().trim().min(1, 'Object id is required.'),
  slug: z.string().trim().min(1, 'Object slug is required.'),
  title: z.string().trim().min(1, 'Title is required.'),
  objectTypeSlug: z.string().trim().min(1, 'Object type is required.'),
  lifecycleStatus: z.string().trim().min(1, 'Lifecycle status is required.'),
  routeIntent: z.string().trim().min(1, 'Route/disposition is required.'),
  primaryLocationSlug: z.string().trim().min(1, 'Location is required.'),
  askingPrice: z.string().trim().optional(),
  conditionNotes: z.string().trim().optional(),
});

const initialState: UpdateObjectActionState = { status: 'idle' };

function normalizeEmpty(value?: string) {
  return value && value.length > 0 ? value : null;
}

function parsePriceToCents(value?: string) {
  if (!value) return null;

  const normalized = value.replace(/[$,\s]/g, '');

  if (!normalized) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error('Asking price must look like 285 or 285.00.');
  }

  return Math.round(Number(normalized) * 100);
}

export async function updateObjectAction(
  _previousState: UpdateObjectActionState,
  formData: FormData,
): Promise<UpdateObjectActionState> {
  if (!isDatabaseConfigured()) {
    return {
      status: 'error',
      message: 'DATABASE_URL is missing, so object edits stay demo-safe for now. Configure the DB to make detail edits persist.',
    };
  }

  const parsed = updateObjectSchema.safeParse({
    objectId: formData.get('objectId'),
    slug: formData.get('slug'),
    title: formData.get('title'),
    objectTypeSlug: formData.get('objectTypeSlug'),
    lifecycleStatus: formData.get('lifecycleStatus'),
    routeIntent: formData.get('routeIntent'),
    primaryLocationSlug: formData.get('primaryLocationSlug'),
    askingPrice: formData.get('askingPrice'),
    conditionNotes: formData.get('conditionNotes'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'The edit form is incomplete.',
    };
  }

  try {
    const db = getDb();
    const user = await getCurrentUser();
    const actorUserId = user?.source === 'database' ? user.id : undefined;

    const existingObject = await db.object.findUnique({
      where: { id: parsed.data.objectId },
      select: {
        id: true,
        slug: true,
        primaryLocationId: true,
        primaryLocation: { select: { name: true, slug: true } },
      },
    });

    if (!existingObject) {
      return {
        status: 'error',
        message: 'That object record no longer exists.',
      };
    }

    const [objectType, location] = await Promise.all([
      db.objectType.findUnique({ where: { slug: parsed.data.objectTypeSlug }, select: { id: true, name: true } }),
      db.location.findUnique({ where: { slug: parsed.data.primaryLocationSlug }, select: { id: true, name: true, slug: true } }),
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
    const locationChanged = existingObject.primaryLocationId !== location.id;
    const now = new Date();

    await db.$transaction(async (tx) => {
      await tx.object.update({
        where: { id: existingObject.id },
        data: {
          title: parsed.data.title,
          objectTypeId: objectType.id,
          lifecycleStatus: parsed.data.lifecycleStatus,
          routeIntent: parsed.data.routeIntent,
          primaryLocationId: location.id,
          askingPriceCents,
          conditionNotes: normalizeEmpty(parsed.data.conditionNotes),
          updatedByUserId: actorUserId,
        },
      });

      if (locationChanged) {
        await tx.objectLocationHistory.updateMany({
          where: {
            objectId: existingObject.id,
            leftAt: null,
          },
          data: {
            leftAt: now,
          },
        });

        await tx.objectLocationHistory.create({
          data: {
            objectId: existingObject.id,
            locationId: location.id,
            enteredAt: now,
            reason: `detail edit move from ${existingObject.primaryLocation?.name ?? 'unknown location'} to ${location.name}`,
            recordedByUserId: actorUserId,
          },
        });
      }
    });

    const detailPath = `/app/objects/${existingObject.slug ?? parsed.data.slug}`;
    revalidatePath('/app/objects');
    revalidatePath(detailPath);

    return {
      status: 'success',
      message: locationChanged ? 'Object updated. Location history was recorded.' : 'Object updated.',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Object update failed.';

    return {
      status: 'error',
      message,
    };
  }
}

export { initialState as updateObjectInitialState };

export type LogWorkflowEventActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

const logWorkflowEventSchema = z.object({
  objectId: z.string().trim().min(1, 'Object id is required.'),
  eventType: z.string().trim().min(1, 'Event type is required.'),
  fromState: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

const logWorkflowEventInitialStateValue: LogWorkflowEventActionState = { status: 'idle' };

export async function logWorkflowEventAction(
  _previousState: LogWorkflowEventActionState,
  formData: FormData,
): Promise<LogWorkflowEventActionState> {
  if (!isDatabaseConfigured()) {
    return {
      status: 'error',
      message: 'DATABASE_URL is missing, so workflow events stay demo-safe for now. Configure the DB to persist events.',
    };
  }

  const parsed = logWorkflowEventSchema.safeParse({
    objectId: formData.get('objectId'),
    eventType: formData.get('eventType'),
    fromState: formData.get('fromState'),
    notes: formData.get('notes'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'The event form is incomplete.',
    };
  }

  try {
    const db = getDb();
    const user = await getCurrentUser();
    const actorUserId = user?.source === 'database' ? user.id : undefined;

    const existingObject = await db.object.findUnique({
      where: { id: parsed.data.objectId },
      select: { id: true, slug: true, lifecycleStatus: true },
    });

    if (!existingObject) {
      return {
        status: 'error',
        message: 'That object record no longer exists.',
      };
    }

    const fromState = parsed.data.fromState?.length ? parsed.data.fromState : existingObject.lifecycleStatus;

    await db.workflowEvent.create({
      data: {
        objectId: existingObject.id,
        eventType: parsed.data.eventType,
        fromState,
        notes: parsed.data.notes?.length ? parsed.data.notes : null,
        createdByUserId: actorUserId,
      },
    });

    const detailPath = `/app/objects/${existingObject.slug}`;
    revalidatePath('/app/objects');
    revalidatePath(detailPath);

    return {
      status: 'success',
      message: `Event "${parsed.data.eventType}" logged.`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Event logging failed.';

    return {
      status: 'error',
      message,
    };
  }
}

export { logWorkflowEventInitialStateValue as logWorkflowEventInitialState };

export type UpdateObjectTagsActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

const updateObjectTagsSchema = z.object({
  objectId: z.string().trim().min(1, 'Object id is required.'),
  tags: z.string().trim(),
});

const updateObjectTagsInitialStateValue: UpdateObjectTagsActionState = { status: 'idle' };

export async function updateObjectTagsAction(
  _previousState: UpdateObjectTagsActionState,
  formData: FormData,
): Promise<UpdateObjectTagsActionState> {
  if (!isDatabaseConfigured()) {
    return {
      status: 'error',
      message: 'DATABASE_URL is missing, so tag edits stay demo-safe for now. Configure the DB to persist tags.',
    };
  }

  const parsed = updateObjectTagsSchema.safeParse({
    objectId: formData.get('objectId'),
    tags: formData.get('tags') ?? '',
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Tag update is incomplete.',
    };
  }

  try {
    const db = getDb();

    const existingObject = await db.object.findUnique({
      where: { id: parsed.data.objectId },
      select: { id: true, slug: true },
    });

    if (!existingObject) {
      return { status: 'error', message: 'That object record no longer exists.' };
    }

    const tagSlugs = parsed.data.tags
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
      .filter(Boolean);

    await db.$transaction(async (tx) => {
      await tx.objectTag.deleteMany({ where: { objectId: existingObject.id } });

      if (tagSlugs.length > 0) {
        await tx.tag.createMany({
          data: tagSlugs.map((slug) => ({ slug, name: slug.replace(/-/g, ' ') })),
          skipDuplicates: true,
        });

        const allTags = await tx.tag.findMany({
          where: { slug: { in: tagSlugs } },
          select: { id: true },
        });

        await tx.objectTag.createMany({
          data: allTags.map((tag) => ({ objectId: existingObject.id, tagId: tag.id })),
          skipDuplicates: true,
        });
      }
    });

    revalidatePath('/app/objects');
    revalidatePath(`/app/objects/${existingObject.slug}`);

    return {
      status: 'success',
      message: tagSlugs.length > 0 ? `Tags updated: ${tagSlugs.join(', ')}.` : 'All tags removed.',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Tag update failed.';
    return { status: 'error', message };
  }
}

export { updateObjectTagsInitialStateValue as updateObjectTagsInitialState };
