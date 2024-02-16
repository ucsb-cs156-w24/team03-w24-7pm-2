import RecommendationRequestTable from 'main/components/RecommendationRequests/RecommendationRequestTable';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { hasRole, useCurrentUser } from 'main/utils/currentUser';
import { Button } from 'react-bootstrap';

export default function RecommendationRequestIndexPage() {

   const currentUser = useCurrentUser();

   const createButton = () => {
      if (hasRole(currentUser, "ROLE_ADMIN")) {
         return (
            <Button
               variant="primary"
               href="/recommendationrequests/create"
               style={{ float: "right" }}
            >
               Create RecommendationRequest
            </Button>
         )
      }
   }

   const { data: recommendationRequests, error: _error, status: _status } =
      useBackend(
         // Stryker disable next-line all : don't test internal caching of React Query
         ["/api/recommendationrequests/all"],
         { method: "GET", url: "/api/recommendationrequests/all" },
         []
      );

   return (
      <BasicLayout>
         <div className="pt-2">
            {createButton()}
            <h1>RecommendationRequest</h1>
            <RecommendationRequestTable recommendationRequests ={recommendationRequests} currentUser={currentUser} />
         </div>
      </BasicLayout>
   )
}