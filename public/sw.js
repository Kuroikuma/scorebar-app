if(!self.define){let e,n={};const s=(s,t)=>(s=new URL(s+".js",t).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(t,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(n[c])return;let i={};const u=e=>s(e,c),r={module:{uri:c},exports:i,require:u};n[c]=Promise.all(t.map((e=>r[e]||u(e)))).then((e=>(a(...e),i)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"0948d1bcf98a748ce3535b53ecc27f8c"},{url:"/_next/static/Pt7GnNun7xZ_EXSRlEFem/_buildManifest.js",revision:"6310079bf1ae7bebeb6a2135896e4564"},{url:"/_next/static/Pt7GnNun7xZ_EXSRlEFem/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1411.586c80a744a2e4bd.js",revision:"586c80a744a2e4bd"},{url:"/_next/static/chunks/1445-e40530e894332c93.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/164f4fb6-98949b46f1774781.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/1982-b8a9c426fb8f7f45.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/1987-ca3f07d133b289ae.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/2117-2accad7134212a5f.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/2157-edc642723fd84664.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/2170a4aa-e29b7c3b1c79deca.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/2209-dfa2efb07d96f6dd.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/2403-75b663ba4d978235.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/3145-30fdec258c7ad3fc.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/3158-05eb54331ec3af6f.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/3245-842e2a4ad42159fd.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/3712-36daf1340da9fdd2.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/376.c5a8cc35b98bfdf3.js",revision:"c5a8cc35b98bfdf3"},{url:"/_next/static/chunks/3969.aa0d0d2fac8367a3.js",revision:"aa0d0d2fac8367a3"},{url:"/_next/static/chunks/4438-a74326fb72a344e7.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/5134-8d46961bbc042d0c.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/6085-167717be6e7a5c26.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/6137-03d2cd0024eec2f8.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/6398-10d1a3a7d82d0cd4.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/6411-fecd1608e10e72a8.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/6692-633586af1673c739.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/6732-ca562008afd1ea7a.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/7214-3de99c81480b8ab1.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/7641-63ab0cb74008ed34.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/7785-641f4deacbb01244.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/8134-ce6edcda89b088fe.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/8638-f3c49d9a7d5c7753.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/9170-b5f43f5de33976e2.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/9348-3b333e222f6c992c.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/9365-e7d0ffd516c12e85.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/9527-26152be92f776893.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/ad2866b8.1fd5edbd6b1bba26.js",revision:"1fd5edbd6b1bba26"},{url:"/_next/static/chunks/app/_not-found/page-befbff8306d0c298.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/dashboard/page-acb743a8c2f12f09.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/games/%5Bid%5D/page-56ec52fe423328d3.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/games/page-1599aa0c5a5c4978.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/layout-4008cdb7902a696f.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/login/page-5a8214e135cdcd05.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/match/%5Bid%5D/page-a32072414675e8f9.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/match/page-ccdcae3b47395ad5.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/overlay/game/%5Bid%5D/page-9f9188e24494b320.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/overlay/match/%5Bid%5D/page-b2d8a8dc71fe17c1.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/page-d6861b5b598313b1.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/profile/page-03186b12d4cd5f82.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/sponsor/%5Bid%5D/page-4a6dd04dd8c09474.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/sponsor/page-66d30b10c32f6cb1.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/app/transaction/page-69c6cfd7e96795c5.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/bc98253f.c840426592616c0c.js",revision:"c840426592616c0c"},{url:"/_next/static/chunks/ca377847-aaf3c6bac856869f.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/fd9d1056-f240fa192024dfa1.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/main-6842282f5cf97263.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/main-app-df4e3804ecee2f7d.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/pages/_app-3c9ca398d360b709.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/pages/_error-cf5ca766ac8f493f.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-66c100efbf6efb72.js",revision:"Pt7GnNun7xZ_EXSRlEFem"},{url:"/_next/static/css/2504a49af5d9bd08.css",revision:"2504a49af5d9bd08"},{url:"/_next/static/css/a175123e57151280.css",revision:"a175123e57151280"},{url:"/_next/static/css/f464c441af8a267c.css",revision:"f464c441af8a267c"},{url:"/_next/static/media/StrikeBoarLogo.d97cf684.png",revision:"89b24ef0bd4fa48e9ea8887663cd1cf6"},{url:"/baseball-field.png",revision:"b639b6e6c3258c2ede6b8a00b67ae218"},{url:"/dashover.png",revision:"59871bb2d538813182eab75881e3b66c"},{url:"/dashovericon.png",revision:"404ba71e39924dcb6042ea866e5b5da5"},{url:"/favicon.png",revision:"6e1fda1f0c0048aca90f0d7c1d7ccb05"},{url:"/field-2.JPG",revision:"b07e76ba58343c379bd506db50c0d6bd"},{url:"/field-vectorizado.svg",revision:"83d582f5754d2983e7743a6dac8cd887"},{url:"/hombre.png",revision:"61bb59ff0922e216b927fc706b098c85"},{url:"/logo-st-activo.png",revision:"32c0bf3a16c70529535a5eac0f03d52b"},{url:"/manifest.json",revision:"ae2bac2da72e48a0252d9da27489ac74"},{url:"/pattern-overlay.svg",revision:"b0a60d49af0d940e2a40745473b26b5c"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:n,event:s,state:t})=>n&&"opaqueredirect"===n.type?new Response(n.body,{status:200,statusText:"OK",headers:n.headers}):n}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const n=e.pathname;return!n.startsWith("/api/auth/")&&!!n.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
