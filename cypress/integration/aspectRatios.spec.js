describe("Aspect Ratios", () => {
  it("should only show four handles if an `aspectRatio` prop is specified", () => {
    cy.visit("/iframe.html?id=02-advanced--aspect-ratio");

    cy.getByTestId("image")
      .trigger("mousedown", 200, 200)
      .trigger("mousemove", 400, 300)
      .trigger("mouseup", { force: true });

    cy.get('[data-testid^="handle-"')
      .its("length")
      .should("equal", 4);
  });

  it("should respect the dimensions of the `aspectRatio` prop on draw", () => {
    const WIDTH = 200;
    const ASPECT_RATIO = [16, 9];

    cy.visit("/iframe.html?id=02-advanced--aspect-ratio");

    cy.getByTestId("image")
      .trigger("mousedown", 10, 10)
      .trigger("mousemove", 10 + WIDTH, 400)
      .trigger("mouseup", { force: true });

    cy.getByTestId("crop")
      .should("have.css", "width", `${WIDTH}px`)
      .should(
        "have.css",
        "height",
        `${(WIDTH / ASPECT_RATIO[0]) * ASPECT_RATIO[1]}px`
      );
  });
});
