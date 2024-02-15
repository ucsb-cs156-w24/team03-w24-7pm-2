import { recommendationRequestFixtures } from 'fixtures/recommendationRequestFixtures';
import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestForm";

export default {
    title: 'components/RecommendationRequests/RecommendationRequestForm',
    component: RecommendationRequestForm
};


const Template = (args) => {
    return (
        <RecommendationRequestForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: recommendationRequestFixtures.oneRecommendationRequest,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};