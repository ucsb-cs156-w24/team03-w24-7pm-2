import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequests/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
   const originalModule = jest.requireActual('react-toastify');
   return {
      __esModule: true,
      ...originalModule,
      toast: (x) => mockToast(x)
   };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
   const originalModule = jest.requireActual('react-router-dom');
   return {
      __esModule: true,
      ...originalModule,
      Navigate: (x) => { mockNavigate(x); return null; }
   };
});

describe("RecommendationRequestsCreatePage tests", () => {

   const axiosMock = new AxiosMockAdapter(axios);

   beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
   });

   test("renders without crashing", () => {
      const queryClient = new QueryClient();
      render(
         <QueryClientProvider client={queryClient}>
            <MemoryRouter>
               <RecommenationRequestCreatePage/>
            </MemoryRouter>
         </QueryClientProvider>
      );
   });

   test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

      const queryClient = new QueryClient();
      const recommendationRequests = {
         id: 1,
        requesterEmail: "requester1@ucsb.edu", 
         professorEmail: "professor1@ucsb.edu",
         explanation: "explain1", 
          dateRequested: "2022-01-03T00:00",
          dateNeeded: "2022-01-03T00:00",
         done: "false"
      };

      axiosMock.onPost("/api/recommendationrequests/post").reply(202, recommendationRequests);

      render(
         <QueryClientProvider client={queryClient}>
            <MemoryRouter>
               <RecommendationRequestCreatePage />
            </MemoryRouter>
         </QueryClientProvider>
      );

      await waitFor(() => {
         expect(screen.getByTestId("RecommendationRequestForm-id")).toBeInTheDocument();
      });

      const requeserEmailField = screen.getByTestId("RecommenationRequestForm-requesterEmail");
       const professorEmailField = screen.getByTestId("RecommenationRequestForm-professorEmail")
       const explanationField = screen.getByTestId("RecommenationRequestForm-explanation");
       const dateRequestedField = screen.getByTestId("RecommenationRequestForm-dateRequested");
       const dateNeededField = screen.getByTestId("RecommenationRequestForm-dateNeeded");
       const doneField = screen.getByTestId("RecommenationRequestForm-done");

      const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

      fireEvent.change(requesterEmailField, { target: { value: 'requester1@ucsb.edu' } });
      fireEvent.change(professorEmailField, { target: { value: 'professor1@ucsb.edu' } });
      fireEvent.change(explanationField, { target: { value: 'explain1' } });
       fireEvent.change(dateRequestedField, { target: { value: '2022-01-03T00:00' } });
       fireEvent.change(dateNeededField, { target: { value: '2022-01-03T00:00' } });
      fireEvent.change(doneField, { target: { value: 'false' } });

      expect(submitButton).toBeInTheDocument();

      fireEvent.click(submitButton);

      await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

      expect(axiosMock.history.post[0].params).toEqual(
         {
            "requesterEmail": "requester1@ucsb.edu",
            "professorEmail": "professor1@ucsb.edu",
            "explanation": "explain1",
              "dateRequested": "2022-01-03T00:00",
              "dateNeeded": "2022-01-03T00:00",
            "done": "false"
         });

      expect(mockToast).toBeCalledWith("New recommendationRequest Created - id: 1 requesterEmail:requester1@ucsb.edu");
      expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequests" });
   });


});