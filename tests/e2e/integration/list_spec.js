import {POLLING_TIMEOUT, PriceFieldColors} from "../../../src/utils/variables";

describe("List", () => {

    beforeEach(() => {
        cy.visit("/");
    });

    it('List should be visible', function () {
        cy.get(".products-group").should("be.visible");
    });

    it('Should change color of price field', async function () {
        cy.wait(POLLING_TIMEOUT + 10);
        cy.get(':nth-child(1) > :nth-child(2) > .products-group__item-price').should('have.css', 'color', PriceFieldColors.AFTER_CHANGE);
    });

});
