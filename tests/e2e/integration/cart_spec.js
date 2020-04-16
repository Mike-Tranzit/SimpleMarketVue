describe("List", () => {

    beforeEach(() => {
        cy.visit("/");
    });

    it('Box should be visible', function () {
        cy.clickProductField();
        cy.get(".box-wrapper").should("be.visible");
    });

    it('Box should\'t be visible', function () {
        cy.clickProductField();
        cy.wait(1000);
        cy.get('.box-inner__body > .box-inner__action').find("a").click();
        cy.get('.box-wrapper').should('not.be.visible');
    });
});
