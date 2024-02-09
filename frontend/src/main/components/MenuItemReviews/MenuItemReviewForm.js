import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

   // Stryker disable all
   const {
      register,
      formState: { errors },
      handleSubmit,
   } = useForm(
      { defaultValues: initialContents || {}, }
   );
   // Stryker restore all

   const navigate = useNavigate();

   // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
   // Note that even this complex regex may still need some tweaks

   // Stryker disable next-line Regex
   const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
   
   const email_regex = /^\S+@\S+\.\S+$/;
   const stars_regex = /^[1-5]$/;

   return (

      <Form onSubmit={handleSubmit(submitAction)}>


         <Row>

            {initialContents && (
               <Col>
                  <Form.Group className="mb-3" >
                     <Form.Label htmlFor="id">Id</Form.Label>
                     <Form.Control
                        data-testid="MenuItemReviewForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                     />
                  </Form.Group>
               </Col>
            )}

            <Col>
               <Form.Group className="mb-3" >
                  <Form.Label htmlFor="itemId">Item ID </Form.Label>
                  <Form.Control
                     data-testid="MenuItemReviewForm-itemId"
                     id="itemId"
                     type="text"
                     isInvalid={Boolean(errors.itemId)}
                     {...register("itemId", { required: true,})}
                  />
                  <Form.Control.Feedback type="invalid">
                     {errors.itemId && 'ItemID is required. '}
                  </Form.Control.Feedback>
               </Form.Group>
            </Col>
            <Col>
               <Form.Group className="mb-3" >
                  <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
                  <Form.Control
                     data-testid="MenuItemReviewForm-reviewerEmail"
                     id="reviewerEmail"
                     type="text"
                     isInvalid={Boolean(errors.reviewerEmail)}
                     {...register("reviewerEmail", { required: true, pattern: email_regex})}
                  />
                  <Form.Control.Feedback type="invalid">
                     {errors.reviewerEmail && 'ReviewerEmail is required. '}
                  </Form.Control.Feedback>
               </Form.Group>
            </Col>
            <Col>
               <Form.Group className="mb-3" >
                  <Form.Label htmlFor="stars"> Stars </Form.Label>
                  <Form.Control
                     data-testid="MenuItemReviewForm-stars"
                     id="stars"
                     type="number"
                     isInvalid={Boolean(errors.stars)}
                     {...register("stars", { required: true, pattern: stars_regex})}
                  />
                  <Form.Control.Feedback type="invalid">
                     {errors.stars && 'stars is required. '}
                  </Form.Control.Feedback>
               </Form.Group>
            </Col>
            <Col>
               <Form.Group className="mb-3" >
                  <Form.Label htmlFor="dateReviewed">Date Reviewed(iso format)</Form.Label>
                  <Form.Control
                     data-testid="MenuItemReviewForm-dateReviewed"
                     id="dateReviewed"
                     type="datetime-local"
                     isInvalid={Boolean(errors.dateReviewed)}
                     {...register("dateReviewed", { required: true, pattern: isodate_regex })}
                  />
                  <Form.Control.Feedback type="invalid">
                     {errors.dateReviewed && 'DateReviewed is required. '}
                  </Form.Control.Feedback>
               </Form.Group>
            </Col>
            <Col>
               <Form.Group className="mb-3" >
                  <Form.Label htmlFor="comments">Comments</Form.Label>
                  <Form.Control
                     data-testid="MenuItemReviewForm-comments"
                     id="comments"
                     type="text"
                     isInvalid={Boolean(errors.comments)}
                     {...register("comments", { required: true, })}
                  />
                  <Form.Control.Feedback type="invalid">
                     {errors.comments && 'Comments is required. '}
                  </Form.Control.Feedback>
               </Form.Group>
            </Col>
         </Row>
{/* 
         <Row>
            <Col>
               <Form.Group className="mb-3" >
                  <Form.Label htmlFor="name">Name</Form.Label>
                  <Form.Control
                     data-testid="UCSBDateForm-name"
                     id="name"
                     type="text"
                     isInvalid={Boolean(errors.name)}
                     {...register("name", {
                        required: "Name is required."
                     })}
                  />
                  <Form.Control.Feedback type="invalid">
                     {errors.name?.message}
                  </Form.Control.Feedback>
               </Form.Group>
            </Col>
         </Row> */}

         <Row>
            <Col>
               <Button
                  type="submit"
                  data-testid="MenuItemReview-submit"
               >
                  {buttonLabel}
               </Button>
               <Button
                  variant="Secondary"
                  onClick={() => navigate(-1)}
                  data-testid="MenuItemReview-cancel"
               >
                  Cancel
               </Button>
            </Col>
         </Row>
      </Form>

   )
}

export default MenuItemReviewForm;
