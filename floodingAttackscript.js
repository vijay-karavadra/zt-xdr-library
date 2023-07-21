// SDK.js
var count = 0;
const SDK = {

    init() {
        this.getIP();
        this.trackPageName();
        this.collectBrowserDetails();
        this.captureClickEvents();
        this.interceptXHRRequests();
        this.interceptHTTPRequests();
        this.collectLocationInformation();

        // var scriptElement = document.currentScript;
        // // Extract the id parameter from the src attribute
        // var src = scriptElement.src;
        // var url = new URL(src);
        // var id = url.searchParams.get('scr');
        // console.log(id); // Output: 123
    },

    getIP() {
        fetch('https://api64.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {

                console.log(`Client IP address: ${data.ip}`);
                localStorage.setItem("ip", data.ip);
            })
            .catch(error => console.error('Error:', error));

    },

    trackPageName() {
        const pageName = document.title;
        console.log(pageName)

        // Send pageName to your server or perform other actions
    },

    collectBrowserDetails() {
        const browserDetails = {
            title: document.title,
            userAgent: navigator.userAgent,
            browserName: navigator.appName,
            browserVersion: navigator.appVersion,
            remoteIpAddress: localStorage.getItem("ip"),
            timestamp: Date.now(),
            url: window.location.href,
            hostname: window.location.hostname,
            pathname: window.location.pathname
        };
        var data = JSON.stringify(browserDetails);
        console.log(browserDetails)

      for (let index = 0; index <150; index++) {
        $.ajax({
            url: 'http://137.135.102.227:2027/SDKLogs',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (response) {
                // Handle the successful response
                console.log(response);
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error(xhr.responseText);
            }
        });
      }
        // Send browserDetails to your server or perform other actions
    },

    captureClickEvents() {
        document.addEventListener('click', (event) => {
            const target = event.target;
            const clickData = {
                targetId: target.id,
                targetClass: target.className,
                timestamp: Date.now()
            };
            // Send clickData to your server or perform other actions
        });
    },




    interceptXHRRequests() {
        try {


            const originalOpen = XMLHttpRequest.prototype.open;

            XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                var xhrData = {
                    userAgent: navigator.userAgent,
                    browserName: navigator.appName,
                    browserVersion: navigator.appVersion,
                    title: document.title,
                    method: method,
                    remoteIpAddress: localStorage.getItem("ip"),
                    url: url,
                    headers: this.getAllResponseHeaders(),
                    timestamp: Date.now(),
                };


                // const xhrData = {
                //   userAgent: navigator.userAgent,
                //   browserName: navigator.appName,
                //   browserVersion: navigator.appVersion,
                //    title:document.title,
                //     method: method,
                //     url: url,
                //     headers: this.getAllResponseHeaders(),
                //     timestamp: Date.now(),
                //     url: window.location.href,
                //     hostname: window.location.hostname,
                //     pathname: window.location.pathname,
                //     targetId: target.id,
                //     targetClass: target.className,

                // };
                if (typeof xhrData !== 'undefined') {

                    var tempcount = localStorage.getItem("count");

                    if (xhrData.url !== "http://137.135.102.227:2027/SDKLogs") {

                        $.ajax({
                            url: 'http://137.135.102.227:2027/SDKLogs',
                            type: 'POST',
                            data: JSON.stringify(JSON.stringify(xhrData)),
                            contentType: 'application/json',
                            success: function (response) {
                                // Handle the successful response
                                console.log(response);
                            },
                            error: function (xhr, status, error) {
                                // Handle errors
                                console.error(xhr.responseText);
                            }
                        });

                    }

                }
                // Send xhrData to your server or perform other actions
                return originalOpen.apply(this, arguments);
            };

        }
        catch (error) {
            // Code to handle the exception
            // ...
            console.log(error)
        }

    },

    interceptHTTPRequests() {
        const originalFetch = window.fetch;

        window.fetch = function (url, options) {
            const method = options && options.method ? options.method : 'GET';
            const xhrData = {
                method: method,
                url: url,
                headers: options && options.headers ? options.headers : {},
                timestamp: Date.now()
            };
            if (typeof xhrData !== 'undefined') {
                console.log(xhrData)
            }
            // Send xhrData to your server or perform other actions
            return originalFetch.apply(this, arguments);
        };

    },

    collectLocationInformation() {
        const locationInfo = {
            url: window.location.href,
            hostname: window.location.hostname,
            pathname: window.location.pathname
        };
        console.log(locationInfo)
        // Send locationInfo to your server or perform other actions
    }
};

// Initialize the SDK
SDK.init();
