// ── Posts ────────────────────────────────────────────────────────────────────
/** Maximum number of characters allowed in a post body */
export const MAX_POST_CONTENT_LENGTH = 4096;

/** Maximum number of images that can be attached to a single post */
export const MAX_POST_IMAGES = 10;

// ── Profile ──────────────────────────────────────────────────────────────────
/** Maximum number of characters allowed in the "bio" / "about me" field */
export const MAX_BIO_LENGTH = 200;

// ── Auth / Password ──────────────────────────────────────────────────────────
/** Minimum password length required for registration */
export const MIN_PASSWORD_LENGTH = 12;

// ── Verification Code ────────────────────────────────────────────────────────
/** Number of digits in the email verification code */
export const VERIFICATION_CODE_LENGTH = 6;

/** Default cooldown (in seconds) before the user can request a new code */
export const VERIFICATION_RESEND_COOLDOWN_SECONDS = 60;
