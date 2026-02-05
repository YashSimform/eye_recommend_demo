-- CreateEnum
CREATE TYPE "MfaMethodEnum" AS ENUM ('email_otp', 'sms_otp', 'authenticator_app', 'backup_codes');

-- CreateEnum
CREATE TYPE "MfaStatusEnum" AS ENUM ('pending', 'verified', 'expired', 'failed');

-- CreateTable
CREATE TABLE "user_mfa" (
    "mfa_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "mfa_method" "MfaMethodEnum" NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "secret_key" VARCHAR(255),
    "backup_codes" JSONB,
    "phone_number" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_mfa_pkey" PRIMARY KEY ("mfa_id")
);

-- CreateTable
CREATE TABLE "user_mfa_logs" (
    "log_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "mfa_method" "MfaMethodEnum" NOT NULL,
    "otp_code" VARCHAR(10),
    "status" "MfaStatusEnum" NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "user_mfa_logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateIndex
CREATE INDEX "user_mfa_user_id_idx" ON "user_mfa"("user_id");

-- CreateIndex
CREATE INDEX "user_mfa_logs_user_id_attempted_at_idx" ON "user_mfa_logs"("user_id", "attempted_at" DESC);

-- CreateIndex
CREATE INDEX "user_mfa_logs_status_attempted_at_idx" ON "user_mfa_logs"("status", "attempted_at" DESC);

-- AddForeignKey
ALTER TABLE "user_mfa" ADD CONSTRAINT "user_mfa_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_mfa_logs" ADD CONSTRAINT "user_mfa_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
