const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || "nexus-pc-7046b",
});

async function resetSoldCounts() {
  const db = admin.firestore();
  const products = await db.collection("products").get();
  if (!process.argv.includes("--apply")) {
    console.log(`Dry run: ${products.size} product sold counts would be reset. Use -- --apply to apply.`);
    return;
  }

  let updated = 0;
  for (let offset = 0; offset < products.docs.length; offset += 500) {
    const batch = db.batch();
    const chunk = products.docs.slice(offset, offset + 500);
    chunk.forEach((product) => {
      batch.update(product.ref, {
        soldCount: 0,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
    updated += chunk.length;
  }
  console.log(`Reset sold counts for ${updated} products.`);
}

resetSoldCounts().catch((error) => {
  console.error("Failed to reset product sold counts:", error);
  process.exitCode = 1;
});
