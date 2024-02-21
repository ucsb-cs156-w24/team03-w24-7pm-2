import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RecommendationRequestEditPage from "main/pages/RecommendationRequests/RecommendationRequestEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import mockConsole from "jest-mock-console";

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
      useParams: () => ({
         id: 17
      }),
      Navigate: (x) => { mockNavigate(x); return null; }
   };
});

describe("RecommendationRequestEditPage tests", () => {

   describe("when the backend doesn't return data", () => {

      const axiosMock = new AxiosMockAdapter(axios);

      beforeEach(() => {
         axiosMock.reset();
         axiosMock.resetHistory();
         axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
         axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
         axiosMock.onGet("/api/recommendationrequests", { params: { id: 17 } }).timeout();
      });

      const queryClient = new QueryClient();
      test("renders header but table is not present", async () => {

         const restoreConsole = mockConsole();

         render(
            <QueryClientProvider client={queryClient}>
               <MemoryRouter>
                  <RecommendationRequestEditPage />
               </MemoryRouter>
            </QueryClientProvider>
         );
         await screen.findByText("Edit RecommendationRequests");
         expect(screen.queryByTestId("RecommendationRequest-requesterEmail")).not.toBeInTheDocument();
         restoreConsole();
      });
   });

   describe("tests where backend is working normally", () => {

      const axiosMock = new AxiosMockAdapter(axios);

      beforeEach(() => {
         axiosMock.reset();
         axiosMock.resetHistory();
         axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
         axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
         axiosMock.onGet("/api/recommendationrequests", { params: { id: 17 } }).reply(200, {
            // id: 17,
            // quarterYYYYQ: '20221',
            // name: "Pi Day",
            // localDateTime: "2022-03-14T15:00"
            id: "17", //might just be a number
            requesterEmail: "requester17@ucsb.edu",
            professorEmail: "professor17@ucsb.edu",
            explanation: "explain17",
            dateRequested: "2022-03-17T00:00:00",
             dateNeeded: "2022-03-17T00:00:00",
            done: "false"
         });
         axiosMock.onPut('/api/recommendationrequests').reply(200, {
            // id: "17",
            // quarterYYYYQ: '20224',
            // name: "Christmas Morning",
            // localDateTime: "2022-12-25T08:00"
            id: "17",
            requesterEmail: "requester@ucsb.edu",
            professorEmail: "professor@ucsb.edu",
            explanation: "explain",
             dateReviewed: "2022-03-01T00:00:00",
             dateNeeded: "2022-03-01T00:00:00",
            done: "true"
         });
      });

      const queryClient = new QueryClient();
      test("renders without crashing", () => {
         render(
            <QueryClientProvider client={queryClient}>
               <MemoryRouter>
                  <RecommendationRequestEditPage />
               </MemoryRouter>
            </QueryClientProvider>
         );
      });

      test("Is populated with the data provided", async () => {

         render(
            <QueryClientProvider client={queryClient}>
               <MemoryRouter>
                  <RecommendationRequestEditPage />
               </MemoryRouter>
            </QueryClientProvider>
         );

         await screen.findByTestId("RecommendationRequestForm-requesterEmail");

         const idField = screen.getByTestId("RecommendationRequestForm-id");
         const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
         const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
         const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
         const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
          const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
          const doneField = screen.getByTestId("RecommendationRequestForm-done");

         const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

         expect(idField).toHaveValue("17");
         expect(requesterEmailField).toHaveValue("requester17@ucsb.edu");
         expect(professorEmailField).toHaveValue("professor17@ucsb.edu");
         expect(explanationField).toHaveValue("explain17");
          expect(dateRequestedField).toHaveValue("2022-03-17T00:00");
          expect(dateNeededField).toHaveValue("2022-03-17T00:00");
         expect(doneField).toHaveValue("false");

          /*
             id: "17",
            requesterEmail: "requester@ucsb.edu",
            professorEmail: "professor@ucsb.edu",
            explanation: "explain",
             dateReviewed: "2022-03-01T00:00:00",
             dateNeeded: "2022-03-01T00:00:00",
            done: "true"
          */
          
         expect(submitButton).toBeInTheDocument();
      });

      test("Changes when you click Update", async () => {

         render(
            <QueryClientProvider client={queryClient}>
               <MemoryRouter>
                  <RecommendationRequestEditPage />
               </MemoryRouter>
            </QueryClientProvider>
         );

         await screen.findByTestId("RecommendationRequestForm-id");//might be requesterEmail
         
         const idField = screen.getByTestId("RecommendationRequestForm-id");
         const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
         const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
         const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
         const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
          const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
          const doneField = screen.getByTestId("RecommendationRequestForm-done")
         const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

         expect(idField).toHaveValue("17");
         expect(requesterEmailField).toHaveValue("requester17@ucsb.edu");
         expect(professorEmailField).toHaveValue("professor17@ucsb.edu");
         expect(explanationField).toHaveValue("explain17");
         expect(dateRequestedField).toHaveValue("2022-03-17T00:00");
          expect(dateNeededField).toHaveValue("2022-03-17T00:00");
          expect(doneField).toHaveValue("false");
         
         expect(submitButton).toBeInTheDocument();

         fireEvent.change(requesterEmailField, { target: { value: 'requester@ucsb.edu' } })
         fireEvent.change(professorEmailField, { target: { value: 'professor@ucsb.edu' } })
         fireEvent.change(explanationField, { target: { value: 'explain' } })
          fireEvent.change(dateRequestedField, { target: { value: '2022-03-01T00:00:00' } })
          fireEvent.change(dateNeededField, { target: { value: '2022-03-01T00:00:00' } })
         fireEvent.change(doneField, { target: { value: "true" } })

         fireEvent.click(submitButton);

         await waitFor(() => expect(mockToast).toBeCalled());
         expect(mockToast).toBeCalledWith("RecommendationRequests Updated - id: 17 requesterEmail: requester@ucsb.edu");
         expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequests" });

         expect(axiosMock.history.put.length).toBe(1); // times called
         expect(axiosMock.history.put[0].params).toEqual({ id: "17" });
         expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
            requesterEmail: "requester@ucsb.edu",
            professorEmail: "professor@ucsb.edu",
            explanation: "explain",
             dateRequested: "2022-03-01T00:00",
             dateNeeded: "2022-03-01T00:00",
            done: "true"
         })); // posted object
      });
   });
});