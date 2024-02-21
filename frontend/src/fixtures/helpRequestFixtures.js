const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requesterEmail": "kavyaverma@ucsb.edu",
        "teamId": "w24-7pm-2",
        "tableOrBreakoutRoom": "7",
        "requestTime": "2024-02-05T00:00:00",
        "explanation": "need help with swagger-ui",
        "solved": true
    },
    threeHelpRequests: [
        {
            "id": 2,
            "requesterEmail": "cgaucho@ucsb.edu",
            "teamId": "w24-7pm-3",
            "tableOrBreakoutRoom": "6",
            "requestTime": "2024-02-05T00:00:00",
            "explanation": "dokku help",
            "solved": false
        },
        {
            "id": 3,
            "requesterEmail": "catskin@ucsb.edu",
            "teamId": "w24-7pm-4",
            "tableOrBreakoutRoom": "5",
            "requestTime": "2024-02-07T00:00:00",
            "explanation": "liquibase error",
            "solved": true
        },
        {
            "id": 4,
            "requesterEmail": "beaver@ucsb.edu",
            "teamId": "w24-7pm-5",
            "tableOrBreakoutRoom": "4",
            "requestTime": "2024-02-08T00:00:00",
            "explanation": "errors with team03",
            "solved": false
        }
    ]
};


export { helpRequestFixtures };