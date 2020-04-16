Cypress.Commands.add("clickProductField", () => {
    cy.get('.products-wrapper > :nth-child(1) > :nth-child(2)').click();
});
