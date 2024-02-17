import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { recommendationRequestFixtures } from 'fixtures/recommendationRequestFixtures';
import RecommendationRequestTable from "main/components/RecommendationRequests/RecommendationRequestTable";
import { rest } from "msw";

export default {
    title: 'components/RecommendationRequests/RecommendationRequestTable',
    component: RecommendationRequestTable
};

const Template = (args) => {
    return (
        <RecommendationRequestTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    recommendations: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    recommendations: recommendationRequestFixtures.threeRecommendationRequests,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    recommendations: recommendationRequestFixtures.threeRecommendationRequests,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/recommendationrequests', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};