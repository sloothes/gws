//  google webspace search sw.js

    self.version = 3.5;
    var debugMode = true;

    self.importScripts(
        "/js/Objectid.js",
        "/js/zangodb.min.js",
    );










    self.addEventListener("fetch", function(e){
        e.respondWith(
            caches.match(e.request).then(function(results){

                return results || fetch(e.request)
                .then(function(response){
                    var cloneResponse = response.clone();
                    caches.open("google").then(function(cache){
                        cache.put(e.request, cloneResponse);
                    });

                    return response;
                });

            }).catch(function(){
                return caches.match("https://www.google.com/search?q=roll+a+die");
            })
        );
    });

    self.addEventListener("install", function(e){

        event.waitUntil(
            caches.open("google").then(function(cache){
                return cache.addAll([
                    "https://www.google.com/search?q=roll+a+die",

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
