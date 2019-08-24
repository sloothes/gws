//  google webspace search sw.js

    self.version = 1.0;
    var debugMode = true;
/*
    self.importScripts(
        "/js/Objectid.js",
        "/js/zangodb.min.js",
        "/socketcluster.js",
        "/sc-codec-min-bin.js",
    );
*/

    self.addEventListener("fetch", function(e){
        if (e.request.url.startsWith( "https://cse.google.com/cse/element" ) ) {
            e.respondWith(
                caches.match(e.request).then(function(results){
                    return results || fetch(e.request).then(function(response){

                        caches.open("google").then(function(cache){
                            cache.put( e.request, response.clone() );
                        });

                        response.clone().json().then(function(data){
                            debugMode && console.log(data);
                        });

                        return response;
                    });

                }).catch(function(err){
                    console.error(err);
                    return fetch(e.request)
                    .then(function(response){
                        return response;
                    });
                })
            );
        }
    });


    self.addEventListener("install", function(e){

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
