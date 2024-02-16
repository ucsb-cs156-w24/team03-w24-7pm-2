import { useBackend } from 'main/utils/useBackend';

import RecommendationRequestTable from 'main/components/RecommendationRequests/RecommendationRequestTable';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { hasRole, useCurrentUser } from 'main/utils/currentUser';
import { Button } from 'react-bootstrap';
export default function RecommendationRequestIndexPage() {

    const currentUser = useCurrentUser();

    const { data: recommendations, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/recommendationRequests/all"],
            { method: "GET", url: "/api/recommendationrequests/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

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

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>RecommendationRequest</h1>
                <RecommendationRequestTable recommendations={recommendations} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}