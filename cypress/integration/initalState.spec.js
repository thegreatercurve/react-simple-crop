describe("Initial state", () => {
  it("should initialize the crop state if provided as a `value` prop", () => {
    cy.visit("/iframe.html?id=02-advanced--initial-state");

    cy.getByTestId("crop").should("exist");
  });
});
