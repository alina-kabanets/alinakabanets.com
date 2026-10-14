import Script from "next/script";

// The Website ID is a UUID. Pull it out of whatever was saved, so pasting
// Umami's whole <script> snippet into the variable still works.
const websiteId = process.env.UMAMI_WEBSITE_ID?.match(
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
)?.[0];

// Visiting any page with ?not-me stops this browser being counted; ?count-me
// undoes it. Uses Umami's own opt-out flag, set before the tracker loads so
// the visit that sets it isn't counted either. Not linked anywhere.
const optOut = `(function(){try{
var q=location.search,off=/[?&]not-me(&|=|$)/.test(q),on=/[?&]count-me(&|=|$)/.test(q);
if(!off&&!on)return;
if(off)localStorage.setItem("umami.disabled","1");else localStorage.removeItem("umami.disabled");
history.replaceState(null,"",location.pathname+location.hash);
var n=document.createElement("div");
n.setAttribute("role","status");
n.textContent=off?"Analytics off for this browser":"Analytics on for this browser";
n.style.cssText="position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:300;background:#111;color:#f1f0ec;font:14px/1.4 system-ui,sans-serif;padding:10px 16px;border-radius:999px";
document.body.appendChild(n);setTimeout(function(){n.remove()},4000);
}catch(e){}})();`;

// Umami Cloud: cookieless, so no consent banner is needed. Loads only on the
// production deployment and only once UMAMI_WEBSITE_ID is set in Vercel.
// Custom events are tracked with data-umami-event attributes on links.
export function Analytics() {
  if (!websiteId || process.env.VERCEL_ENV !== "production") return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: optOut }} />
      <Script src="https://cloud.umami.is/script.js" data-website-id={websiteId} strategy="afterInteractive" />
    </>
  );
}
