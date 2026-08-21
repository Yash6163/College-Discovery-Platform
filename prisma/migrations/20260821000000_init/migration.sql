CREATE TYPE "CollegeType" AS ENUM ('GOVERNMENT', 'PRIVATE', 'DEEMED', 'AUTONOMOUS');
CREATE TYPE "ExamCode" AS ENUM ('JEE_MAIN', 'NEET_UG', 'CAT');
CREATE TYPE "Category" AS ENUM ('OPEN', 'OBC', 'SC', 'ST', 'EWS');

CREATE TABLE "College" (
  "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "name" TEXT NOT NULL, "city" TEXT NOT NULL, "state" TEXT NOT NULL, "address" TEXT NOT NULL, "type" "CollegeType" NOT NULL, "establishedYear" INTEGER NOT NULL, "description" TEXT NOT NULL, "annualFee" INTEGER NOT NULL, "rating" DOUBLE PRECISION NOT NULL, "ratingCount" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Course" (
  "id" TEXT NOT NULL, "collegeId" TEXT NOT NULL, "name" TEXT NOT NULL, "degree" TEXT NOT NULL, "durationMonths" INTEGER NOT NULL, "annualFee" INTEGER NOT NULL,
  CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Placement" (
  "id" TEXT NOT NULL, "collegeId" TEXT NOT NULL, "year" INTEGER NOT NULL, "averagePackage" INTEGER, "highestPackage" INTEGER, "placementPercentage" DOUBLE PRECISION, "recruiters" TEXT[],
  CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Review" (
  "id" TEXT NOT NULL, "collegeId" TEXT NOT NULL, "displayName" TEXT NOT NULL, "rating" DOUBLE PRECISION NOT NULL, "title" TEXT NOT NULL, "body" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Cutoff" (
  "id" TEXT NOT NULL, "collegeId" TEXT NOT NULL, "courseId" TEXT, "exam" "ExamCode" NOT NULL, "category" "Category" NOT NULL DEFAULT 'OPEN', "year" INTEGER NOT NULL, "openingRank" INTEGER NOT NULL, "closingRank" INTEGER NOT NULL,
  CONSTRAINT "Cutoff_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");
CREATE INDEX "College_name_idx" ON "College"("name");
CREATE INDEX "College_state_city_idx" ON "College"("state", "city");
CREATE INDEX "College_type_idx" ON "College"("type");
CREATE INDEX "College_annualFee_idx" ON "College"("annualFee");
CREATE INDEX "College_rating_idx" ON "College"("rating");
CREATE INDEX "Course_collegeId_idx" ON "Course"("collegeId");
CREATE UNIQUE INDEX "Placement_collegeId_year_key" ON "Placement"("collegeId", "year");
CREATE INDEX "Placement_collegeId_year_idx" ON "Placement"("collegeId", "year");
CREATE INDEX "Review_collegeId_createdAt_idx" ON "Review"("collegeId", "createdAt");
CREATE INDEX "Cutoff_exam_closingRank_idx" ON "Cutoff"("exam", "closingRank");
CREATE UNIQUE INDEX "Cutoff_collegeId_exam_courseId_category_year_key" ON "Cutoff"("collegeId", "exam", "courseId", "category", "year");
ALTER TABLE "Course" ADD CONSTRAINT "Course_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Cutoff" ADD CONSTRAINT "Cutoff_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Cutoff" ADD CONSTRAINT "Cutoff_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
