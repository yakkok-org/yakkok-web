/**
 * Firebase 사용자에게 admin custom claim을 부여/해제하는 일회성 스크립트.
 *
 * 사용법:
 *   1) Firebase Console → 프로젝트 설정 → 서비스 계정 → "새 비공개 키 생성" 으로 JSON 다운로드.
 *   2) 다운받은 JSON을 ./.secrets/service-account.json 으로 두기. (.gitignore에 .secrets/ 포함됨)
 *   3) 실행:
 *      node scripts/grant-admin.mjs ygim36204@gmail.com           # 부여
 *      node scripts/grant-admin.mjs ygim36204@gmail.com --revoke  # 해제
 *   4) yakkok-web에서 로그아웃 → 다시 로그인 (토큰 재발급)
 *
 * 환경변수로 키 경로를 바꾸려면: GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import admin from "firebase-admin";

const __dirname = dirname(fileURLToPath(import.meta.url));

const email = process.argv[2];
const revoke = process.argv.includes("--revoke");

if (!email) {
  console.error("사용법: node scripts/grant-admin.mjs <email> [--revoke]");
  process.exit(1);
}

const keyPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ??
  resolve(__dirname, "..", ".secrets", "service-account.json");

if (!existsSync(keyPath)) {
  console.error(
    `service account key를 찾을 수 없어요: ${keyPath}\nFirebase Console → 프로젝트 설정 → 서비스 계정에서 키를 발급받아 위 경로에 두세요.`
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

try {
  const user = await admin.auth().getUserByEmail(email);
  const currentClaims = user.customClaims ?? {};
  const nextClaims = revoke
    ? { ...currentClaims, admin: false }
    : { ...currentClaims, admin: true };

  await admin.auth().setCustomUserClaims(user.uid, nextClaims);

  console.log(
    `✓ ${email} (uid=${user.uid}) 에 admin=${revoke ? "false" : "true"} 적용됨`
  );
  console.log("→ 어드민 페이지에서 로그아웃 후 다시 로그인하면 적용됩니다.");
} catch (err) {
  console.error("실패:", err.message ?? err);
  process.exit(1);
}
