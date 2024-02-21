import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
   useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewForm tests", () => {
   test("renders correctly", async () => {

      render(
         <Router  >
            <MenuItemReviewForm />
         </Router>
      );
      await screen.findByText(/Item ID/);
      await screen.findByText(/Reviewer Email/);
      await screen.findByText(/Stars/);
      await screen.findByText(/Date Reviewed\(iso format\)/);
      await screen.findByText(/Comments/);
      await screen.findByText(/Create/);
   });


   test("renders correctly when passing in a MenuItemReview", async () => {

      render(
         <Router  >
            <MenuItemReviewForm initialContents={menuItemReviewsFixtures.oneMenuItemReview} />
         </Router>
      );
      await screen.findByTestId(/MenuItemReviewForm-id/);
      expect(screen.getByText(/Id/)).toBeInTheDocument();
      expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");
   });

   test("Correct Error messsages on bad input", async () => {

      render(
         <Router  >
            <MenuItemReviewForm />
         </Router>
      );
      await screen.findByTestId("MenuItemReviewForm-itemId");
      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      fireEvent.change(itemIdField, { target: { value: 'bad-input' } });
      fireEvent.change(reviewerEmailField, { target: { value: 'bad-input' } });
      fireEvent.change(starsField, { target: { value: 'bad-input' } });
      fireEvent.change(dateReviewedField, { target: { value: 'bad-input' } });
      fireEvent.change(commentsField, { target: { value: 'bad-input' } });

      fireEvent.click(submitButton);

      await screen.findByText(/DateReviewed is required./);
   });

   test("Correct Error messsages on missing input", async () => {

      render(
         <Router  >
            <MenuItemReviewForm />
         </Router>
      );
      await screen.findByTestId("MenuItemReviewForm-submit");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      fireEvent.click(submitButton);

      await screen.findByText(/ItemID is required./);
      expect(screen.getByText(/ReviewerEmail is required./)).toBeInTheDocument();
      expect(screen.getByText(/Stars is required./)).toBeInTheDocument();
      expect(screen.getByText(/DateReviewed is required./)).toBeInTheDocument();
      expect(screen.getByText(/Comments is required./)).toBeInTheDocument();
   });

   test("No Error messsages on good input", async () => {

      const mockSubmitAction = jest.fn();


      render(
         <Router  >
            <MenuItemReviewForm submitAction={mockSubmitAction} />
         </Router>
      );
      await screen.findByTestId("MenuItemReviewForm-itemId");

      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      fireEvent.change(itemIdField, { target: { value: '1' } });
      fireEvent.change(reviewerEmailField, { target: { value: 'email@gmail.com' } });
      fireEvent.change(starsField, { target: { value: '2' } });
      fireEvent.change(dateReviewedField, { target: { value: '2022-01-02T12:00' } });
      fireEvent.change(commentsField, { target: { value: 'comment1' } });
      
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

      expect(screen.queryByText(/ItemId is required./)).not.toBeInTheDocument();
      expect(screen.queryByText(/ReviewerEmail is required./)).not.toBeInTheDocument();
      expect(screen.queryByText(/Stars is required./)).not.toBeInTheDocument();
      expect(screen.queryByText(/DateReviewed is required./)).not.toBeInTheDocument();
      expect(screen.queryByText(/Comments is required./)).not.toBeInTheDocument();
   });

   test("that navigate(-1) is called when Cancel is clicked", async () => {

      render(
         <Router  >
            <MenuItemReviewForm />
         </Router>
      );
      await screen.findByTestId("MenuItemReviewForm-cancel");
      const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

      fireEvent.click(cancelButton);

      await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

   });
});