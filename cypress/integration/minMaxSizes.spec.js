describe("Minimum and maximum sizes", () => {
  it("should not allow the crop area to be less than the `minWidth` prop on draw", () => {
    const IMAGE_WIDTH = 500;
    const MIN_WIDTH_PERCENT = 20;

    const MIN_WIDTH_PIXELS = (MIN_WIDTH_PERCENT / 100) * IMAGE_WIDTH;

    cy.visit("/iframe.html?id=02-advanced--min-and-max-width");

    cy.getByTestId("image")
      .trigger("mousedown", 10, 10)
      .trigger("mousemove", 11, 11)
      .trigger("mouseup", { force: true });

    cy.getByTestId("crop").should("have.css", "width", `${MIN_WIDTH_PIXELS}px`);
  });

  it("should not allow the crop area to be greater than the `maxWidth` prop on draw", () => {
    const IMAGE_WIDTH = 500;
    const MAX_WIDTH_PERCENT = 50;

    const MAX_WIDTH_PIXELS = (MAX_WIDTH_PERCENT / 100) * IMAGE_WIDTH;

    cy.visit("/iframe.html?id=02-advanced--min-and-max-width");

    cy.getByTestId("image")
      .trigger("mousedown", 10, 10)
      .trigger("mousemove", 400, 400)
      .trigger("mouseup", { force: true });

    cy.getByTestId("crop").should("have.css", "width", `${MAX_WIDTH_PIXELS}px`);
  });

  it("should not allow the crop area to be less than the `minHeight` prop on draw", () => {
    const IMAGE_HEIGHT = 500;
    const MIN_HEIGHT_PERCENT = 10;

    const MIN_HEIGHT_PIXELS = (MIN_HEIGHT_PERCENT / 100) * IMAGE_HEIGHT;

    cy.visit("/iframe.html?id=02-advanced--min-and-max-height");

    cy.getByTestId("image")
      .trigger("mousedown", 10, 10)
      .trigger("mousemove", 11, 11)
      .trigger("mouseup", { force: true });

    cy.getByTestId("crop").should(
      "have.css",
      "height",
      `${MIN_HEIGHT_PIXELS}px`
    );
  });

  it("should not allow the crop area to be greater than the `maxHeight` prop on draw", () => {
    const IMAGE_HEIGHT = 500;
    const MAX_HEIGHT_PERCENT = 60;

    const MAX_HEIGHT_PIXELS = (MAX_HEIGHT_PERCENT / 100) * IMAGE_HEIGHT;

    cy.visit("/iframe.html?id=02-advanced--min-and-max-height");

    cy.getByTestId("image")
      .trigger("mousedown", 10, 10)
      .trigger("mousemove", 400, 400)
      .trigger("mouseup", { force: true });

    cy.getByTestId("crop").should(
      "have.css",
      "height",
      `${MAX_HEIGHT_PIXELS}px`
    );
  });
});
