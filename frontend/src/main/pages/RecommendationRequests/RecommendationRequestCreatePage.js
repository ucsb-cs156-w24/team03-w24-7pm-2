import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestForm";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useBackendMutation } from "main/utils/useBackend";
import { Navigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({ storybook = false }) {

   const objectToAxiosParams = (recommendationRequests) => ({
      url: "/api/recommendationrequests/post",
      method: "POST",
      params: {
        id: recommendationRequests.id,
        requesterEmail: recommendationRequests.requesterEmail,
        professorEmail: recommendationRequests.professorEmail,
        explanation: recommendationRequests.explanation,
        dateRequested: recommendationRequests.dateRequested,
        dateNeeded: recommendationRequests.dateNeeded,
        done: recommendationRequests.done
      }
   });

   const onSuccess = (recommendationRequests) => {
      toast(`New recommendationRequest Created - id: ${recommendationRequests.id} requesterEmail: ${recommendationRequests.requesterEmail}`);
   }

   const mutation = useBackendMutation(
      objectToAxiosParams,
      { onSuccess },
      // Stryker disable next-line all : hard to set up test for caching
      ["/api/recommendationrequests/all"]
   );

   const { isSuccess } = mutation

   const onSubmit = async (data) => {
      mutation.mutate(data);
   }

   if (isSuccess && !storybook) {
      return <Navigate to="/recommendationrequests" />
   }

   return (
      <BasicLayout>
         <div className="pt-2">
            <h1>Create New RecommendationRequest</h1>

            <RecommendationRequestForm submitAction={onSubmit} />

         </div>
      </BasicLayout>
   )
}