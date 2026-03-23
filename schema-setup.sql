-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "auth_provider_user_id" TEXT,
    "email" TEXT,
    "display_name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'operator',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_types" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "object_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objects" (
    "id" UUID NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "object_type_id" UUID,
    "lifecycle_status" TEXT NOT NULL DEFAULT 'acquired',
    "route_intent" TEXT NOT NULL DEFAULT 'undecided',
    "visibility" TEXT NOT NULL DEFAULT 'internal',
    "description_short" TEXT,
    "description_long" TEXT,
    "materials" TEXT,
    "dimensions" JSONB,
    "condition_notes" TEXT,
    "is_one_of_a_kind" BOOLEAN NOT NULL DEFAULT true,
    "is_batch_item" BOOLEAN NOT NULL DEFAULT false,
    "is_archival" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "intake_stage" TEXT NOT NULL DEFAULT 'draft',
    "date_acquired" TIMESTAMPTZ,
    "acquisition_type" TEXT,
    "acquisition_source" TEXT,
    "cost_basis_cents" INTEGER,
    "asking_price_cents" INTEGER,
    "sold_price_cents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "primary_location_id" UUID,
    "primary_image_id" UUID,
    "square_item_id" TEXT,
    "square_variation_id" TEXT,
    "published_at" TIMESTAMPTZ,
    "sold_at" TIMESTAMPTZ,
    "archived_at" TIMESTAMPTZ,
    "created_by_user_id" UUID,
    "updated_by_user_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag_type" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_tags" (
    "object_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "object_tags_pkey" PRIMARY KEY ("object_id","tag_id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "parent_location_id" UUID,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location_type" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_location_history" (
    "id" UUID NOT NULL,
    "object_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "entered_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMPTZ,
    "reason" TEXT,
    "notes" TEXT,
    "recorded_by_user_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "object_location_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_events" (
    "id" UUID NOT NULL,
    "object_id" UUID NOT NULL,
    "event_type" TEXT NOT NULL,
    "from_state" TEXT,
    "to_state" TEXT,
    "notes" TEXT,
    "event_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "object_id" UUID,
    "storage_provider" TEXT NOT NULL DEFAULT 'supabase',
    "storage_path" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "mime_type" TEXT,
    "original_filename" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "duration_seconds" DECIMAL(10,2),
    "file_size_bytes" BIGINT,
    "checksum_sha256" TEXT,
    "caption" TEXT,
    "alt_text" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'internal',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "shot_at" TIMESTAMPTZ,
    "shot_by_user_id" UUID,
    "derivative_of_asset_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_entries" (
    "id" UUID NOT NULL,
    "object_id" UUID NOT NULL,
    "source_type" TEXT,
    "source_url" TEXT,
    "citation" TEXT,
    "summary" TEXT,
    "confidence" TEXT,
    "notes" TEXT,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "research_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'internal',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "starts_at" TIMESTAMPTZ,
    "ends_at" TIMESTAMPTZ,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_objects" (
    "collection_id" UUID NOT NULL,
    "object_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_objects_pkey" PRIMARY KEY ("collection_id","object_id")
);

-- CreateTable
CREATE TABLE "sales_records" (
    "id" UUID NOT NULL,
    "object_id" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "square_sale_id" TEXT,
    "square_order_id" TEXT,
    "sold_at" TIMESTAMPTZ NOT NULL,
    "sale_price_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "fees_cents" INTEGER,
    "tax_cents" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "sales_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publish_profiles" (
    "id" UUID NOT NULL,
    "object_id" UUID NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "is_featured_home" BOOLEAN NOT NULL DEFAULT false,
    "is_featured_gallery" BOOLEAN NOT NULL DEFAULT false,
    "public_title" TEXT,
    "public_excerpt" TEXT,
    "public_description" TEXT,
    "public_price_mode" TEXT NOT NULL DEFAULT 'hidden',
    "public_status_label" TEXT,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "publish_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" UUID NOT NULL,
    "object_id" UUID,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "inventory_type" TEXT NOT NULL DEFAULT 'merch',
    "sku" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "quantity_on_hand" INTEGER NOT NULL DEFAULT 0,
    "quantity_reserved" INTEGER NOT NULL DEFAULT 0,
    "reorder_threshold" INTEGER,
    "price_cents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "square_item_id" TEXT,
    "square_variation_id" TEXT,
    "primary_image_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_variants" (
    "id" UUID NOT NULL,
    "inventory_item_id" UUID NOT NULL,
    "sku" TEXT,
    "variant_name" TEXT NOT NULL,
    "option_values" JSONB,
    "quantity_on_hand" INTEGER NOT NULL DEFAULT 0,
    "quantity_reserved" INTEGER NOT NULL DEFAULT 0,
    "price_cents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "square_variation_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "inventory_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_relationships" (
    "id" UUID NOT NULL,
    "source_object_id" UUID NOT NULL,
    "target_object_id" UUID NOT NULL,
    "relationship_type" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "object_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "object_valuations" (
    "id" UUID NOT NULL,
    "object_id" UUID NOT NULL,
    "valuation_type" TEXT NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "object_valuations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_provider_user_id_key" ON "users"("auth_provider_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "object_types_slug_key" ON "object_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "objects_slug_key" ON "objects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "objects_primary_image_id_key" ON "objects"("primary_image_id");

-- CreateIndex
CREATE INDEX "objects_lifecycle_status_idx" ON "objects"("lifecycle_status");

-- CreateIndex
CREATE INDEX "objects_route_intent_idx" ON "objects"("route_intent");

-- CreateIndex
CREATE INDEX "objects_visibility_idx" ON "objects"("visibility");

-- CreateIndex
CREATE INDEX "objects_primary_location_id_idx" ON "objects"("primary_location_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "locations_slug_key" ON "locations"("slug");

-- CreateIndex
CREATE INDEX "object_location_history_object_id_left_at_idx" ON "object_location_history"("object_id", "left_at");

-- CreateIndex
CREATE INDEX "object_location_history_location_id_idx" ON "object_location_history"("location_id");

-- CreateIndex
CREATE INDEX "workflow_events_object_id_event_at_idx" ON "workflow_events"("object_id", "event_at");

-- CreateIndex
CREATE INDEX "workflow_events_event_type_idx" ON "workflow_events"("event_type");

-- CreateIndex
CREATE INDEX "media_assets_object_id_idx" ON "media_assets"("object_id");

-- CreateIndex
CREATE INDEX "media_assets_visibility_idx" ON "media_assets"("visibility");

-- CreateIndex
CREATE INDEX "research_entries_object_id_idx" ON "research_entries"("object_id");

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_key" ON "collections"("slug");

-- CreateIndex
CREATE INDEX "sales_records_object_id_sold_at_idx" ON "sales_records"("object_id", "sold_at");

-- CreateIndex
CREATE UNIQUE INDEX "publish_profiles_object_id_key" ON "publish_profiles"("object_id");

-- CreateIndex
CREATE INDEX "publish_profiles_is_public_idx" ON "publish_profiles"("is_public");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_slug_key" ON "inventory_items"("slug");

-- CreateIndex
CREATE INDEX "inventory_items_status_idx" ON "inventory_items"("status");

-- CreateIndex
CREATE INDEX "inventory_variants_inventory_item_id_idx" ON "inventory_variants"("inventory_item_id");

-- CreateIndex
CREATE INDEX "object_relationships_source_object_id_idx" ON "object_relationships"("source_object_id");

-- CreateIndex
CREATE INDEX "object_relationships_target_object_id_idx" ON "object_relationships"("target_object_id");

-- CreateIndex
CREATE INDEX "object_valuations_object_id_idx" ON "object_valuations"("object_id");

-- AddForeignKey
ALTER TABLE "objects" ADD CONSTRAINT "objects_object_type_id_fkey" FOREIGN KEY ("object_type_id") REFERENCES "object_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objects" ADD CONSTRAINT "objects_primary_location_id_fkey" FOREIGN KEY ("primary_location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objects" ADD CONSTRAINT "objects_primary_image_id_fkey" FOREIGN KEY ("primary_image_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objects" ADD CONSTRAINT "objects_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objects" ADD CONSTRAINT "objects_updated_by_user_id_fkey" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_tags" ADD CONSTRAINT "object_tags_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_tags" ADD CONSTRAINT "object_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_location_id_fkey" FOREIGN KEY ("parent_location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_location_history" ADD CONSTRAINT "object_location_history_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_location_history" ADD CONSTRAINT "object_location_history_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_location_history" ADD CONSTRAINT "object_location_history_recorded_by_user_id_fkey" FOREIGN KEY ("recorded_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_events" ADD CONSTRAINT "workflow_events_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_events" ADD CONSTRAINT "workflow_events_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_shot_by_user_id_fkey" FOREIGN KEY ("shot_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_derivative_of_asset_id_fkey" FOREIGN KEY ("derivative_of_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_entries" ADD CONSTRAINT "research_entries_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_entries" ADD CONSTRAINT "research_entries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_objects" ADD CONSTRAINT "collection_objects_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_objects" ADD CONSTRAINT "collection_objects_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_records" ADD CONSTRAINT "sales_records_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publish_profiles" ADD CONSTRAINT "publish_profiles_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_primary_image_id_fkey" FOREIGN KEY ("primary_image_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_variants" ADD CONSTRAINT "inventory_variants_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_relationships" ADD CONSTRAINT "object_relationships_source_object_id_fkey" FOREIGN KEY ("source_object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_relationships" ADD CONSTRAINT "object_relationships_target_object_id_fkey" FOREIGN KEY ("target_object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_valuations" ADD CONSTRAINT "object_valuations_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_valuations" ADD CONSTRAINT "object_valuations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

