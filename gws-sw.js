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
        debugMode && console.log( e.request );

        if (e.request.url.startsWith( "https://cse.google.com/cse/element" ) ) {
            e.respondWith( caches.match(e.request).then(function(results){
                return results || fetch(e.request).then(function(response){

                    var clone1 = response.clone();
                    debugMode && console.log( "clone1:", clone1 );

                    var clone2 = response.clone();
                    caches.open("google").then(function(cache){
                        cache.put( e.request, clone2 );
                    });

                /*
                //  var clone3 = response.clone();
                //  clone3.arrayBuffer().then(function(data){
                //      debugMode && console.log(
                //          "clone3:", data); // is not arraybuffer.
                //  });
                */

                /*
                    var clone4 = response.clone();
                    clone4.blob().then(function(blob){
                        var reader = new FileReader();
                        reader.onload = function(){
                            debugMode && console.log(
                                "clone4 dataURL:", reader.result
                            ); // is not dataURL.
                        };
                        reader.readAsDataURL(blob);
                        return blob;
                    //  reader.readAsText(blob); // is not text.
                    //  reader.readAsArrayBuffer(blob); // is not arraybuffer.
                    }).then(function(blob){
                        var reader = new FileReader();
                        reader.onload = function(){
                            debugMode && console.log(
                                "clone4 binaryString:", reader.result
                            ); // is not binaryString.
                        };
                        reader.readAsBinaryString(blob);
                    }).catch(function(err){
                        console.error(err);
                    });
                */

                //  So what is it? // is a attached json.txt file with type "application/javascript.

                    return response;
                });

            }).catch(function(err){
                console.error(err);
                return fetch(e.request)
                    .then(function(response){
                    return response;
                });
            }));
        }
    });


    self.addEventListener("install", function(e){

        self.skipWaiting();

    });

    self.addEventListener("activate", function(e){

        self.clients.claim();

    });

    function send_message_to_client(client, msg){
        return new Promise(function(resolve, reject){
            var channel = new MessageChannel();

            channel.port1.onmessage = function(e){
                if (e.data.error) {
                    reject(e.data.error);
                } else {
                    resolve(e.data);
                }
            };

            client.postMessage("SW Says:", msg, [channel.port2]);
        });
    }

    function send_message_to_all_clients(msg){
        clients.matchAll().then(function(clients){
            clients.forEach(function(client){
                send_message_to_client(client, msg).then(function(msg){
                    console.log("SW Received Message:", msg));
                });
            });
        });
    }

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
