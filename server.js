const http = require("http");
const axios = require("axios");
const cron = require("node-cron");
const testList = require("./configuration_external");

const httpServer = http.createServer();
let port = 3000;
const cronSchedule = process.env.SCHEDULE || "*/1 * * * *";

// axios configurations
axios.defaults.validateStatus = function () {
    // handle all status codes including http server errors (500)
    return true;
}

// https://stackoverflow.com/questions/49874594/how-to-get-response-times-from-axios
axios.interceptors.request.use(function (config) {
    config.metadata = { startTime: new Date()}
    return config;
  }, function (error) {
    return Promise.reject(error);
  });  
axios.interceptors.response.use(function (response) {
    response.config.metadata.endTime = new Date()
    response.duration = response.config.metadata.endTime - response.config.metadata.startTime
    return response;
    }, function (error) {
    error.config.metadata.endTime = new Date();
    error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
    return Promise.reject(error);
});

if (process.env.NODE_ENV === "production") {
    port = process.env.HTTP_PORT || 80;
}

httpServer.listen(port, () => {
    console.log(`server running on port ${port}`);
});

function sendRequests() {
    const allRequests = [];
    for (let test of testList) {
        allRequests.push(axios.get(test.url));
    }

    // make requests in parallel
    axios.all(allRequests)
    .then(axios.spread((...responses) => {
        for(let i = 0; i < responses.length; i++) {
            if (responses[i].status && responses[i].status === 200) {
                if (responses[i].data && typeof(responses[i].data) === "string" && responses[i].data.includes(testList[i].content)) {
                    console.log(`url: ${testList[i].url}, status: 200, took: ${responses[i].duration} ms, content found: ${testList[i].content}`)
                } else {
                    console.log(`url: ${testList[i].url}, status: 200, took: ${responses[i].duration} ms, content not found: ${testList[i].content}`)
                }
            } else {
                console.log(`url: ${testList[i].url}, returned an error with status: ${responses[i].status}, took: ${responses[i].duration} ms`)
            }
        }
    })).catch(errors => {
        console.error(errors);
    })
}

console.log(`Monitoring web pages with cron schedule: ${cronSchedule}`);
cron.schedule(cronSchedule, () => {
    console.log("Requests are being sent...")
    sendRequests();
})
