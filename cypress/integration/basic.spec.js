describe("Basic crop", () => {
  it("should draw a crop area on click and drag", () => {
    cy.visit("/iframe.html?id=01-basic--crop-only");

    cy.getByTestId("crop").should("not.exist");

    cy.getByTestId("image")
      .trigger("mousedown", 200, 200)
      .trigger("mousemove", 400, 300)
      .trigger("mouseup", { force: true });

    cy.getByTestId("crop").should("exist");
  });

  it("should move a crop area on click and drag of an existing crop area", () => {
    const X = 200;
    const Y = 100;
    const WIDTH = 200;
    const HEIGHT = 200;
    const MOVEMENT_SIZE = 30;
    const INNER_OFFSET = 10;

    cy.visit("/iframe.html?id=01-basic--crop-only");

    cy.getByTestId("image")
      .trigger("mousedown", X, Y)
      .trigger("mousemove", X + WIDTH, Y + HEIGHT)
      .trigger("mouseup", { force: true });

    cy.getByTestId("crop")
      .should("have.css", "left", `${X}px`)
      .should("have.css", "top", `${Y}px`);

    cy.getByTestId("crop")
      .trigger("mousedown", INNER_OFFSET, INNER_OFFSET)
      .trigger(
        "mousemove",
        INNER_OFFSET + MOVEMENT_SIZE,
        INNER_OFFSET + MOVEMENT_SIZE
      )
      .trigger("mouseup", { force: true });

    cy.getByTestId("crop")
      .should("have.css", "left", `${X + MOVEMENT_SIZE}px`)
      .should("have.css", "top", `${Y + MOVEMENT_SIZE}px`);
  });

  it("should resize a crop area on click and drag of a handle", () => {
    const X = 200;
    const Y = 100;
    const WIDTH = 200;
    const HEIGHT = 200;
    const RESIZE_SIZE = 50;
    const ICON_OFFSET = 5;

    cy.visit("/iframe.html?id=01-basic--crop-only");

    cy.getByTestId("image")
      .trigger("mousedown", X, Y)
      .trigger("mousemove", X + WIDTH, Y + HEIGHT)
      .trigger("mouseup", { force: true });

    cy.getByTestId("crop")
      .should("have.css", "width", `${WIDTH}px`)
      .should("have.css", "height", `${HEIGHT}px`);

    cy.getByTestId("handle-se")
      .trigger("mousedown")
      .trigger("mousemove", RESIZE_SIZE, RESIZE_SIZE, { force: true })
      .trigger("mouseup", { force: true });

    cy.getByTestId("crop")
      .should("have.css", "width", `${WIDTH + RESIZE_SIZE - ICON_OFFSET}px`)
      .should("have.css", "height", `${HEIGHT + RESIZE_SIZE - ICON_OFFSET}px`);
  });
});
