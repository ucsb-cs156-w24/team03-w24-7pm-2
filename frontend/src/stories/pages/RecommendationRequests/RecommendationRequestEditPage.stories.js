import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { recommendationRequestFixtures } from 'fixtures/recommendationRequestFixtures';
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import RecommendationRequestEditPage from "main/pages/RecommendationRequests/RecommendationRequestEditPage";
import { rest } from "msw";

export default {
    title: 'pages/RecommendationRequests/RecommendationRequestEditPage',
    component: RecommendationRequestEditPage
};

const Template = () => <RecommendationRequestEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/recommendationrequests', (_req, res, ctx) => {
            return res(ctx.json(recommendationRequestFixtures.threeRecommendationRequests[0]));
        }),
        rest.put('/api/recommendationrequests', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}