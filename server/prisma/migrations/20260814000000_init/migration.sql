-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "short_desc" VARCHAR(300) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "tech_stack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "thumbnail" TEXT NOT NULL DEFAULT '',
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "live_url" TEXT NOT NULL DEFAULT '',
    "repo_url" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" UUID NOT NULL,
    "company" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200),
    "short_desc_vi" VARCHAR(300) NOT NULL DEFAULT '',
    "short_desc_en" VARCHAR(300) NOT NULL DEFAULT '',
    "role_vi" VARCHAR(200) NOT NULL,
    "role_en" VARCHAR(200) NOT NULL DEFAULT '',
    "period_vi" VARCHAR(100) NOT NULL,
    "period_en" VARCHAR(100) NOT NULL DEFAULT '',
    "bullets_vi" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bullets_en" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "content" VARCHAR(2000) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_featured_idx" ON "projects"("featured");

-- CreateIndex
CREATE INDEX "projects_sort_order_created_at_idx" ON "projects"("sort_order", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "experiences_slug_key" ON "experiences"("slug");

-- CreateIndex
CREATE INDEX "experiences_sort_order_created_at_idx" ON "experiences"("sort_order", "created_at");

-- CreateIndex
CREATE INDEX "messages_created_at_idx" ON "messages"("created_at");
