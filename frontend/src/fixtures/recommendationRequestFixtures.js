const recommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "requesterEmail": "requester1@ucsb.edu",
        "professorEmail": "professor1@ucsb.edu",
        "explanation": "explanation1",
        "dateRequested": "2022-01-02T12:00:00",
        "dateNeeded": "2022-01-02T12:00:00",
        "done": "false"
    },
    threeRecommendationRequests: [
        {
            "id": 2,
            "requesterEmail": "requester1@ucsb.edu",
            "professorEmail": "professor1@ucsb.edu",
            "explanation": "explanation1",
            "dateRequested": "2022-02-02T12:00:00",
            "dateNeeded": "2022-02-02T12:00:00",
            "done": "false"
        },
        {
            "id": 3,
            "requesterEmail": "requester2@ucsb.edu",
            "professorEmail": "professor2@ucsb.edu",
            "explanation": "explanation2",
            "dateRequested": "2022-03-02T12:00:00",
            "dateNeeded": "2022-03-02T12:00:00",
            "done": "true"
        },
        {
            "id": 4,
            "requesterEmail": "requester2@ucsb.edu",
            "professorEmail": "professor4@ucsb.edu",
            "explanation": "explanation4",
            "dateRequested": "2022-03-03T12:00:00",
            "dateNeeded": "2022-03-03T12:00:00",
            "done": "false"
        },
    ]
};


export { recommendationRequestFixtures };
