var SDK = {
    init() {

        this.getIP();
        this.getAppKey();
        this.collectBrowserDetails();
        this.interceptXHRRequests();

    },

    getAppKey() {
        try {
            var scriptElement = document.currentScript;
            var src = scriptElement.src;
            var url = new URL(src);
            localStorage.setItem("Appkey", url.search.split('=')[1]);
        }
        catch (exception) {
            console.log(exception);
            localStorage.setItem("Appkey", "");
        }
    },
    getIP() {
        fetch("https://api64.ipify.org?format=json")
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
            url: window.location.host == "" ? window.location.href : window.location.host,
            hostname: window.location.hostname,
            pathname: window.location.pathname,
            appKey: localStorage.getItem("Appkey")
        };

        var data = JSON.stringify(browserDetails);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "https://zt-central-vm.zta-gateway.com/SDKLogs", true);
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
            const originalSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                localStorage.setItem("url", url);
                localStorage.setItem("method", method);
                return originalOpen.apply(this, arguments);
            };
            XMLHttpRequest.prototype.send = function (data) {
                var xhrData = {
                userAgent: navigator.userAgent,
                browserName: navigator.appName,
                browserVersion: navigator.appVersion,
                title: document.title,
                method: localStorage.getItem("method"),
                remoteIpAddress: localStorage.getItem("ip"),
                url: window.location.host == "" ? window.location.href : window.location.host,
                RequestUrl:localStorage.getItem("url"),
                headers: this.getAllResponseHeaders(),
                timestamp: Date.now(),
                hostname: window.location.hostname,
                pathname: window.location.pathname,
                bodyData:data,
                appKey: localStorage.getItem("Appkey")
            };
           
            if (typeof xhrData !== 'undefined') {
                if (xhrData.url !== "https://zt-central-vm.zta-gateway.com/SDKLogs" &&
                 xhrData.RequestUrl !== "https://zt-central-vm.zta-gateway.com/SDKLogs") {
                    var xhr = new XMLHttpRequest();
                    debugger;
                    xhr.open('POST', "https://zt-central-vm.zta-gateway.com/SDKLogs", true);
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

                return originalSend.apply(this, arguments);
            };

           

            // var xhrData = {
            //     userAgent: navigator.userAgent,
            //     browserName: navigator.appName,
            //     browserVersion: navigator.appVersion,
            //     title: document.title,
            //     method: localStorage.getItem("method"),
            //     remoteIpAddress: localStorage.getItem("ip"),
            //     url: window.location.host == "" ? window.location.href : window.location.host,
            //     requestURL:localStorage.getItem("url"),
            //    // headers: this.getAllResponseHeaders(),
            //     timestamp: Date.now(),
            //     hostname: window.location.hostname,
            //     pathname: window.location.pathname,
            //     bodyData:localStorage.getItem("bodyData"),
            //     appKey: localStorage.getItem("Appkey")
            // };
            // debugger;
            // if (typeof xhrData !== 'undefined') {
            //     if (xhrData.url !== "https://zt-central-vm.zta-gateway.com/SDKLogs") {
            //         var xhr = new XMLHttpRequest();
            //         xhr.open('POST', "https://zt-central-vm.zta-gateway.com/SDKLogs", true);
            //         xhr.setRequestHeader('Content-Type', 'application/json');
            //         xhr.onreadystatechange = function () {
            //             if (xhr.readyState === XMLHttpRequest.DONE) {
            //                 if (xhr.status === 200) {
            //                     // Handle the successful response
            //                     console.log(xhr.responseText);
            //                 } else {
            //                     // Handle errors
            //                     console.error(xhr.responseText);
            //                 }
            //             }
            //         };
            //         xhr.send(JSON.stringify(JSON.stringify(xhrData)));
            //     }
            // }


        }
        catch (error) {
            // Code to handle the exception
            // ...
            console.log(error)
        }

    }
};

// Initialize the SDK
SDK.init();
