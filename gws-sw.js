//  google webspace search sw.js

    self.version = 3.5;
    var debugMode = true;

    self.importScripts(
        "/js/Objectid.js",
        "/js/zangodb.min.js",
        "/socketcluster.js",
        "/sc-codec-min-bin.js",
    );

//  IMPORTANT: service worker socket "authState" always is
//  "unauthenticated" as dont have access to localStorage.

    var socket = socketCluster.create({
        hostname: "anywhere3d.com",
        codecEngine: scCodecMinBin,
    });

    socket.on("connect", function(status){
        debugMode && console.log("[service-worker]:", {"status": status});
    });

    socket.on("error", function (err) {
        console.error( "[service-worker]:", err );
    });

    socket.on("authStateChange", function( state ){
        debugMode && console.log("[service-worker]:", {"authStateChange": state});
    });

/*
    self.addEventListener("fetch", function(e){
        e.respondWith(
            caches.match(e.request).then(function(results){
                return results || fetch(e.request)
                .then(function(response){

                    caches.open("google").then(function(cache){
                        cache.put( e.request, response.clone() );
                    });

                    return response.text().then(function(data){
                        debugMode && console.log(data);
                        return data;
                    });

                });

            }).catch(function(){
                return new Response("Sorry! an error occurred.", {
                    "Content-Type": "text/html",
                });
            })
        );
    });
*/

    self.addEventListener("install", function(e){

        e.waitUntil(
            caches.open("google").then(function(cache){
                return cache.addAll([

                 //  include resources 
                 //  for the new version...

                ]);
            })
        );

        self.skipWaiting();

    });

    self.addEventListener("activate", function(e){

        self.clients.claim();

    });

    function unistall(){
        self.registration.unregister().then(function(){
            return self.clients.matchAll();
        }).then(function(clients) {
            clients.forEach(function(client){
                client.navigate(client.url);  // it will re-install on reload!
                console.log(`service worker unistalled from client "${client.url}"`);
            });
        });
    }
