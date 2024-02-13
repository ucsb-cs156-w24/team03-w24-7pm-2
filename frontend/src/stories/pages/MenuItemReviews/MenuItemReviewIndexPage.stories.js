
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";
import { rest } from "msw";

import MenuItemReviewIndexPage from "main/pages/MenuItemReviews/MenuItemReviewIndexPage";

export default {
   title: 'pages/MenuItemReviews/menuItemReviewIndexPage',
   component: MenuItemReviewIndexPage
};

const Template = () => <MenuItemReviewIndexPage storybook={true} />;

export const Empty = Template.bind({});
Empty.parameters = {
   msw: [
      rest.get('/api/currentUser', (_req, res, ctx) => {
         return res(ctx.json(apiCurrentUserFixtures.userOnly));
      }),
      rest.get('/api/systemInfo', (_req, res, ctx) => {
         return res(ctx.json(systemInfoFixtures.showingNeither));
      }),
      rest.get('/api/menuitemreview/all', (_req, res, ctx) => {
         return res(ctx.json([]));
      }),
   ]
}

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
   msw: [
      rest.get('/api/currentUser', (_req, res, ctx) => {
         return res(ctx.json(apiCurrentUserFixtures.userOnly));
      }),
      rest.get('/api/systemInfo', (_req, res, ctx) => {
         return res(ctx.json(systemInfoFixtures.showingNeither));
      }),
      rest.get('/api/menuitemreview/all', (_req, res, ctx) => {
         return res(ctx.json(menuItemReviewsFixtures.threeMenuItemReviews));
      }),
   ],
}

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
   msw: [
      rest.get('/api/currentUser', (_req, res, ctx) => {
         return res(ctx.json(apiCurrentUserFixtures.adminUser));
      }),
      rest.get('/api/systemInfo', (_req, res, ctx) => {
         return res(ctx.json(systemInfoFixtures.showingNeither));
      }),
      rest.get('/api/menuitemreview/all', (_req, res, ctx) => {
         return res(ctx.json(menuItemReviewsFixtures.threeMenuItemReviews));
      }),
      rest.delete('/api/menuitemreview', (req, res, ctx) => {
         window.alert("DELETE: " + JSON.stringify(req.url));
         return res(ctx.status(200), ctx.json({}));
      }),
   ],
}
