// SDK.js

var count = 0;
var hostUrl="https://zt-central-vm.zta-gateway.com/SDKLogs";
var ipurl = "https://api64.ipify.org?format=json"
const SDK = {

    init() {
        this.getIP();
        this.collectBrowserDetails();
        this.interceptXHRRequests();

        var scriptElement = document.currentScript;
        // Extract the id parameter from the src attribute
        var src = scriptElement.src;
        var url = new URL(src);
        debugger;
      
    },

    getIP() {
        fetch(ipurl)
            .then(response => response.json())
            .then(data => {
                console.log(`Client IP address: ${data.ip}`);
                localStorage.setItem("ip", data.ip);
            })
            .catch(error => console.error('Error:', error));
    },

    collectBrowserDetails() {
        const browserDetails = {
            title: document.title,
            userAgent: navigator.userAgent,
            browserName: navigator.appName,
            browserVersion: navigator.appVersion,
            remoteIpAddress: localStorage.getItem("ip"),
            timestamp: Date.now(),
            url: window.location.host == ""? window.location.href: window.location.host,
            hostname: window.location.hostname,
            pathname: window.location.pathname
        };
        
        var data = JSON.stringify(browserDetails);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', hostUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Handle the successful response
                    console.log(xhr.responseText);
                } else {
                    // Handle errors
                    console.error(xhr.responseText);
                }
            }
        };
        xhr.send(JSON.stringify(data));

        // Send browserDetails to your server or perform other actions
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

                if (typeof xhrData !== 'undefined') {
                    if (xhrData.url !== hostUrl) {

                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', hostUrl, true);
                        xhr.setRequestHeader('Content-Type', 'application/json');

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                if (xhr.status === 200) {
                                    // Handle the successful response
                                    console.log(xhr.responseText);
                                } else {
                                    // Handle errors
                                    console.error(xhr.responseText);
                                }
                            }
                        };
                        xhr.send(JSON.stringify(JSON.stringify(xhrData)));
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
};

// Initialize the SDK
SDK.init();
