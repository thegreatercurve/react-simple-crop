Cypress.Commands.add("getByTestId", (id, options) =>
  cy.get(`[data-testid=${id}]`, options)
);
