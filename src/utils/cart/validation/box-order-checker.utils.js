export default class BoxOrderChecker {
  productInGoodsList;
  productInBox;
  element;
  inputValue;
  availableCount;
  productCount;
  availableCountToOrder;

  constructor({productInGoodsList, productInBox, element}) {
    this.productInGoodsList = productInGoodsList;
    this.productInBox = productInBox;
    this.element = element;
  }

  convertAndSetParams() {
    this.availableCount = this.productInGoodsList.availableCount;
    this.productCount = +this.productInBox.count;
    this.inputValue = +this.element.value;
    this.availableCountToOrder = this.availableCount + this.productCount;
    return this;
  }

  checkValueBecameLow() {
    const countBecameUp = this.inputValue > this.productCount;
    if (countBecameUp) {
      return false;
    }
    const newProductInBoxCount = this.inputValue > 0 ? this.inputValue : '';
    const newAvailableCount = this.availableCount + (this.productCount - this.inputValue);
    this.setNewValuesOfCounts(newProductInBoxCount, newAvailableCount);
    return true;
  }

  checkValueExceededLimit() {
    const exceededLimit = this.availableCountToOrder > this.inputValue;
    if (exceededLimit) {
      return false;
    }
    this.element.value = String(this.availableCountToOrder);
    this.setNewValuesOfCounts(this.availableCountToOrder);
    return true;
  }

  setNewAvailableCount() {
    const countDiffValue = this.availableCountToOrder - this.inputValue;
    const newAvailableCount = countDiffValue < 0 ? 0 : countDiffValue;
    this.setNewValuesOfCounts(this.inputValue, newAvailableCount);
    return true;
  }

  setNewValuesOfCounts(productInBoxCount, productCount) {
    this.productInBox.count = productInBoxCount;
    this.productInGoodsList.availableCount = productCount;
  }
}
