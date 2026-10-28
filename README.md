# NEXUS PC — Power Your Next Build

A responsive PC hardware storefront built with React, Vite, Tailwind CSS, Firebase Authentication, Cloud Firestore, Firebase Storage, and optional callable Cloud Functions. The storefront reads its catalog from Firestore. Customers submit order requests; an authorized admin checks current catalog prices and stock in a Firestore transaction before creating the final order and reserving inventory.

> Product prices and starting stock are demo data in Philippine pesos, not verified live retailer offers. GCash is a manual demo option only: no GCash payment is accepted or processed.

## Local setup

1. Install Node.js 22 or newer and the Firebase CLI. The product seed also requires the Google Cloud CLI (`gcloud`).
2. From the project root, install the storefront dependencies:

   ```sh
   npm install
   ```

3. Install Cloud Functions dependencies:

   ```sh
   npm --prefix functions install
   ```

4. Copy `.env.example` to `.env.local`. The Firebase web-app configuration is included for project `nexus-pc-7046b`; `.env.local` is ignored by Git. Keep it local and restart Vite after changing environment values.
5. Start the storefront:

   ```sh
   npm run dev
   ```

6. Make a production build:

   ```sh
   npm run build
   ```

## Firebase configuration

The app is configured for the existing Firebase project `nexus-pc-7046b`; it does not create or replace a Firebase project. The browser configuration is read from these Vite variables:

```env
VITE_FIREBASE_API_KEY=AIzaSyBbQ1Dd2gZB4ea8FLw1OwVvVOTUvWE5f0o
VITE_FIREBASE_AUTH_DOMAIN=nexus-pc-7046b.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nexus-pc-7046b
VITE_FIREBASE_STORAGE_BUCKET=nexus-pc-7046b.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=104623643788
VITE_FIREBASE_APP_ID=1:104623643788:web:8bef57357d6e9a1c0fafa9
VITE_FIREBASE_MEASUREMENT_ID=G-TZV30TG5JY
```

In Firebase Console, select **nexus-pc-7046b** and:

1. Under **Authentication → Sign-in method**, enable **Email/Password**.
2. Under **Firestore Database**, create the production database in the region you intend to use. Do not enable test mode.
3. Optional image uploads: open **Storage → Get started** to initialize the existing project's bucket before deploying `storage.rules`. Firebase Storage is not yet initialized for this project.
4. In **Project settings → General → Your apps**, verify that the supplied web-app configuration matches the existing web app.
5. (Recommended) Configure Firebase App Check before public production traffic. The callable functions do not require App Check yet.

Firebase Analytics starts only after `isSupported()` resolves and is deliberately non-blocking.

## Firestore data and product seeding

The store uses:

- `products/{productId}` — published catalog entries, price in whole PHP, stock, specifications, `soldCount`, and timestamps.
- `users/{uid}` — customer profile fields only; permissions are not stored here.
- `carts/{uid}` — the signed-in user's cart item quantities. Guest carts stay in browser local storage.
- `orderRequests/{requestId}` — customer-submitted product IDs, quantities, delivery details, and approval status. Requests do not set prices or reserve stock.
- `orders/{orderId}` — admin-approved order snapshots and status history, created with current product prices in the same transaction that reserves inventory.
- `newsletterSubscribers/{sha256(email)}` — sign-ups received by a callable function. No marketing email is sent.

Create a Google Application Default Credentials session for an account authorized to write to the project's Firestore, then seed the catalog:

```sh
gcloud auth application-default login
gcloud config set project nexus-pc-7046b
npm run seed:products
```

The seed script creates the 20 demo catalog documents only when their IDs do not already exist. It skips existing products rather than overwriting price, stock, or product edits. The catalog source is `data/products.json`.

## Firestore and Storage rules

Review the rules, then deploy Firestore rules and required indexes:

```sh
firebase login
firebase use nexus-pc-7046b
firebase deploy --only firestore:rules,firestore:indexes
```

Public clients can read only published products. Customer profile and cart access is scoped to the signed-in UID. Customers can create an order request only for themselves; requests contain no trusted prices or totals and cannot be changed by customers after submission. Only the signed-in Firebase account with UID `Fwt7JA6ln2cf5BZC4e9kb9GR6yE2` can review requests, create final orders, or change stock. No email verification is required. Changing a Firestore profile document cannot grant access; keep control of this account and use a strong, unique password.

After completing **Storage → Get started** in Firebase Console, deploy the optional image-upload rules separately:

```sh
firebase deploy --only storage
```

## Order approval and Cloud Functions

Checkout writes a price-free request to `orderRequests/{requestId}`. In **Admin → Orders**, approving a request re-reads each published product and current stock inside a Firestore transaction, calculates prices and shipping from Firestore data, decrements inventory, creates the final `orders/{orderId}` document, and marks the request approved atomically. If stock changed or a product is no longer available, approval fails without creating an order or changing inventory. Rejecting a request does not reserve stock.

The Functions in `functions/src/index.ts` include an optional newsletter callable. Order requests, approvals, and order status changes use Firestore rules and transactions and do not require Cloud Functions.

Cloud Functions deployment requires the Firebase **Blaze** billing plan and enabled Google Cloud APIs. They are not required for order checkout or approval. To deploy optional newsletter functionality:

```sh
npm --prefix functions run build
firebase deploy --only functions --project nexus-pc-7046b
```

Approved orders under ₱5,000 have a ₱150 sample shipping fee; orders at or above ₱5,000 have free sample shipping. GCash is a manual demo option only; no payment is processed.

## Administrator access

The Firebase Authentication UID `Fwt7JA6ln2cf5BZC4e9kb9GR6yE2` is the single administrator identity used consistently by Firestore rules, Storage rules, the admin UI, and Cloud Functions. Email verification is not required. Only the authenticated account with this UID receives administrator access; do not store passwords in rules or profiles.

## Vercel deployment

1. Import this project into Vercel with the repository root as the project root. Firestore rules deployment does not deploy frontend code; redeploy the Vercel app after frontend changes.
2. `vercel.json` configures the `npm run build` command, `dist` output directory, dependency installation, and SPA route rewrites.
3. Add the seven `VITE_FIREBASE_*` variables from `.env.example` to the Vercel project's environment settings for each deployment environment. Do not upload `.env.local`.
4. Deploy Firestore rules and indexes. Initialize Storage in Firebase Console before deploying its optional rules. Upgrade the project to Blaze only if you want to deploy the optional Cloud Functions.

`vercel.json` rewrites application routes to the Vite SPA entry point. Firestore rules and the authenticated administrator UID gate order approvals and stock changes.
