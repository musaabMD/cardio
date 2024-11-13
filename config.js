import themes from "daisyui/src/theming/themes";

const config = {
  // REQUIRED
  appName: "Telecardiology",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Advanced telemedicine platform for remote cardiac diagnosis, monitoring, and consultation services.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "telecardiology.com",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (mailgun.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h"
            : "price_456",
        name: "Basic Care",
        description: "Perfect for small clinics and individual practitioners",
        price: 199,
        priceAnchor: 299,
        features: [
          {
            name: "Secure patient portal",
          },
          { name: "Basic ECG analysis" },
          { name: "Patient records management" },
          { name: "Email support" },
        ],
      },
      {
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw"
            : "price_456",
        name: "Professional",
        description: "Complete solution for hospitals and medical centers",
        price: 499,
        priceAnchor: 699,
        features: [
          {
            name: "All Basic Care features",
          },
          { name: "Advanced ECG analysis" },
          { name: "Real-time monitoring" },
          { name: "Priority support" },
          { name: "Custom reporting" },
          { name: "24/7 emergency consultation" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "telecardiology-storage",
    bucketUrl: `https://telecardiology-storage.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  mailgun: {
    subdomain: "mg",
    fromNoReply: `Telecardiology <noreply@mg.telecardiology.com>`,
    fromAdmin: `Support Team at Telecardiology <support@mg.telecardiology.com>`,
    supportEmail: "support@mg.telecardiology.com",
    forwardRepliesTo: "medical.team@telecardiology.com",
  },
  colors: {
    theme: "light",
    main: themes["light"]["primary"],
  },
  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
  },
};

export default config;