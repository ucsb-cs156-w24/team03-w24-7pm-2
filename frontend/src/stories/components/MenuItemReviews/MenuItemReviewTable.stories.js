import React from 'react';
import MenuItemReviewsTable from "main/components/MenuItemReviews/MenuItemReviewsTable";
import { menuItemReviewsFixtures } from 'fixtures/menuItemReviewsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
   title: 'components/MenuItemReviews/MenuItemReviewsTable',
   component: MenuItemReviewsTable
};

const Template = (args) => {
   return (
      <MenuItemReviewsTable {...args} />
   )
};

export const Empty = Template.bind({});

Empty.args = {
   menuItemReviews: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
   menuItemReviews: MenuItemReviewsFixtures.threeMenuItemReviews,
   currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
   menuItemReviews: menuItemReviewsFixtures.threeMenuItemReviews,
   currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
   msw: [
      rest.delete('/api/menuitemreview', (req, res, ctx) => {
         window.alert("DELETE: " + JSON.stringify(req.url));
         return res(ctx.status(200), ctx.json({}));
      }),
   ]
};

