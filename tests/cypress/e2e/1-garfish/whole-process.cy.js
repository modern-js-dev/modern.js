// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-undef */
/// <reference types="cypress" />
import { getPublicPath, getAppInfo } from '../../../utils/testCase';

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress
const mainAppName = '@cypress-test/garfish-main';

describe('render sub app', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit(getPublicPath(mainAppName));
  });

  it('render sub application', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.contains(getAppInfo(mainAppName).homeTitle).should('exist');
    cy.get('[data-test=link-dashboard]').click();
    cy.contains('dashboard loading').should('exist');
    cy.contains('Dashboard Home page').should('exist');
    cy.contains('main app info: hello world from main app').should('exist');
    cy.get('[data-test=link-dashboard-detail]').click();
    cy.contains('Dashboard detail page').should('exist');

    cy.get('[data-test=link-tablelist]').click();
    cy.contains('tablelist empty placeholder').should('exist');
    cy.contains('main app info: hello world tablelist').should('exist');
    cy.contains('Tablelist home page').should('exist');

    cy.get('[data-test=link-dashboard]').click();
    cy.get('[data-test=sub-link-dashboard]').click();
    cy.contains('Dashboard detail page').should('exist');
  });
});
