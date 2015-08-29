// browser policy
BrowserPolicy.content.allowFrameOrigin("*");
BrowserPolicy.content.allowImageOrigin("*");
BrowserPolicy.content.allowEval();
BrowserPolicy.content.allowInlineScripts();
BrowserPolicy.content.allowScriptOrigin("cdn.optimizely.com");
BrowserPolicy.content.allowScriptOrigin("ssl.google-analytics.com");
BrowserPolicy.content.allowScriptOrigin("www.google-analytics.com");
BrowserPolicy.content.allowScriptOrigin("www.googletagmanager.com");
BrowserPolicy.content.allowScriptOrigin("api.mixpanel.com");
BrowserPolicy.content.allowScriptOrigin("cdn.mxpnl.com");
BrowserPolicy.content.allowScriptOrigin("cdn.segment.com");
BrowserPolicy.content.allowScriptOrigin("js.hs-analytics.net");
BrowserPolicy.content.allowOriginForAll("platform.twitter.com");
BrowserPolicy.content.allowOriginForAll("syndication.twitter.com");
BrowserPolicy.content.allowScriptOrigin("tag.perfectaudience.com");
BrowserPolicy.content.allowScriptOrigin("pixel-geo.prfct.co");
BrowserPolicy.content.allowScriptOrigin("js.hsforms.net");
BrowserPolicy.content.allowScriptOrigin("forms.hubspot.com");


// let phantomjs run for up to 60 seconds when googlebot crawls our
// page. a lower ranking because of slow pageload is better than not
// being indexed at all.
Spiderable.requestTimeoutMs = 60 * 1000;
