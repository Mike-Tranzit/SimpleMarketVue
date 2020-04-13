
/*  Change available count of product */
export let ProductCountActionEnum;
(function (ProductCountActionEnum) {
    ProductCountActionEnum["INCREASE"] = "Increase";
    ProductCountActionEnum["DECREASE"] = "Decrease";
})(ProductCountActionEnum || (ProductCountActionEnum = {}));

/* Color of prices when update */
export let PriceFieldColors;
(function (PriceFieldColors) {
    PriceFieldColors["UP"] = "rgb(221, 79, 67)";
    PriceFieldColors["DOWN"] = "rgb(40, 195, 76)";
    PriceFieldColors["AFTER_CHANGE"] = "rgb(255, 255, 255)";
    PriceFieldColors.priceBecomeLower = (el) => el.style.backgroundColor = PriceFieldColors.DOWN;
    PriceFieldColors.priceBecomeHigher = (el) => el.style.backgroundColor = PriceFieldColors.UP;
    PriceFieldColors.setColorAfterChange = (el) => {
        if(el.style.color === PriceFieldColors.AFTER_CHANGE) {
            return;
        }
        el.style.color = PriceFieldColors.AFTER_CHANGE;
    }
    PriceFieldColors = Object.freeze({...PriceFieldColors});
})(PriceFieldColors || (PriceFieldColors = {}));
