import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import { articlesFixtures } from "fixtures/articlesFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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

// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => {
//     const originalModule = jest.requireActual('react-router-dom');
//     return {
//         __esModule: true,
//         ...originalModule,
//         useParams: () => ({
//             id: 17
//         }),
//         Navigate: (x) => { mockNavigate(x); return null; }
//     };
// });

describe("ArticlesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Articles");
            expect(screen.queryByTestId("ArticlesForm-title")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: "article one",
                email: "articleone@gmail.com",
                url: "https://articleone.com",
                explanation: "article one explanation",
                dateAdded: "2022-02-02T00:00"
            });
            axiosMock.onPut('/api/articles').reply(200, {
                id: "17",
                title: "article one",
                email: "articleone@gmail.com",
                url: "https://articleone.com",
                explanation: "article one explanation",
                dateAdded: "2022-02-02T00:00"
            });
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-title");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("article one");
            expect(urlField).toHaveValue("https://articleone.com");
            expect(emailField).toHaveValue("articleone@gmail.com");
            expect(explanationField).toHaveValue("article one explanation");
            expect(dateAddedField).toHaveValue("2022-02-02T00:00");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-title");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("article one");
            expect(urlField).toHaveValue("https://articleone.com");
            expect(emailField).toHaveValue("articleone@gmail.com");
            expect(explanationField).toHaveValue("article one explanation");
            expect(dateAddedField).toHaveValue("2022-02-02T00:00");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: 'article two' } });
            fireEvent.change(emailField, { target: { value: 'articletwo@gmail.com' } });
            fireEvent.change(urlField, { target: { value: 'https://articletwo.com' } });
            fireEvent.change(explanationField, { target: { value: 'article two explanation' } });
            fireEvent.change(dateAddedField, { target: { value: '2022-02-02T00:01' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Article Updated - id: 17 title: title1");
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: "article two",
                email: "articletwo@gmail.com",
                url: "https://articletwo.com",
                explanation: "article two explanation",
                dateAdded: "2022-02-02T00:01"
            })); // posted object

        });

       
    });
});