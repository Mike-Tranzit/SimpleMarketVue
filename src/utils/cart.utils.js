import {findElement, findCb, getProperty} from "@/utils/custom.utils";
import {ProductCountActionEnum} from "./vaiables";

export class Cart {

    constructor(product, {cartState, goodsState}) {
        this.product = product;
        this.cartState = [...cartState];
        this.goodsState = {...goodsState};
        this.existingShoppingItem = {};
    }

    setInitCartPosition() {
        let existingShoppingItem = findElement(this.cartState, findCb(this.product, 'goodsId'));
        this.existingShoppingItem = existingShoppingItem || this.addInitValueToCart();
    }

    get INIT_COUNT_IN_SHOPPING_CARD() {
        return 0;
    }

    get state() {
        return {
            cartState: this.cartState,
            goodsState: this.goodsState
        }
    }

    increaseProductCount() {
        this.existingShoppingItem.count++;
    }

    addInitValueToCart() {
        const {goodsId, price, goodsName, groupName} = this.product;
        const initBoxProductState = {
            goodsId,
            price,
            count: this.INIT_COUNT_IN_SHOPPING_CARD,
            goodsName,
            groupName
        };
        this.cartState.push(initBoxProductState);
        return initBoxProductState;
    }

    goodsCountActions(action) {
        const cb = product => product.goodsId === this.product.goodsId;
        const item = findElement(this.goodsState[this.product.groupName], cb);
        if (item) {
            switch (action) {
                case ProductCountActionEnum.INCREASE: {
                    item.availableCount = item.availableCount + this.product.count;
                    break;
                }
                case ProductCountActionEnum.DECREASE: {
                    item.availableCount--;
                    break;
                }
                default:
            }
        }
    }

    deleteProductFromCart(index) {
        this.cartState.splice(index, 1);
    }
}

export class CartPollingUpdater {
    constructor({cartState, goodsState, updateCart}) {
        this.cartState = [...cartState];
        this.goodsState = {...goodsState};
        this.updateCart = updateCart;
    }

    cartIsNotEmpty() {
        return this.updateCart && this.cartState.length > 0;
    }

    checkDiffCartAndGoodsList() {

        if (!this.cartIsNotEmpty()) {
            return false;
        }

        for (const index of Object.keys(this.cartState)) {
            const itemOfCart = this.cartState[index];
            const propertyName = getProperty(itemOfCart, 'groupName');
            const item = findElement(this.goodsState[propertyName], findCb(itemOfCart, 'goodsId'));

            if (item) {
                const exceededLimit = itemOfCart.count > item.availableCount;
                if (exceededLimit) {
                    itemOfCart.count = item.availableCount;
                } else {
                    item.availableCount = item.availableCount - itemOfCart.count;
                }
                itemOfCart.price = item.price;
            } else {
                this.cartState.splice(index, 1);
            }
        }

        return true;
    }

    get newStates() {
        return {
            newCartState: this.cartState,
            newGoodsState: this.goodsState
        }
    }
}
