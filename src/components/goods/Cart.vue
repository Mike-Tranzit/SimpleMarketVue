<template>
    <div class="box-wrapper" v-if="cartIsNotEmpty">
        <div class="box-inner">
            <div>
                <div class="box-inner__name box-inner__title">Наименование товара и описание</div>
                <div class="box-inner__count box-inner__title">Количество</div>
                <div class="box-inner__price box-inner__title">Цена</div>
                <div class="box-inner__action box-inner__title"></div>
            </div>

            <div class="box-inner__body" v-for="(product, index) in cartData" :key="index">
                <div class="box-inner__name">{{product.goodsName}}</div>
                <div class="box-inner__count"><input class="box-inner__count-input" type="text"
                                                     :value="product.count"
                                                     v-on:keyup="checkAvailableCount(product, $event)"> шт
                </div>
                <div class="box-inner__price">{{product.price}} руб./шт</div>
                <div class="box-inner__action"><a href="#" v-on:click.prevent="deleteProduct(index)">Удалить</a></div>
            </div>
        </div>

        <div class="total-price">
            <div>Общая стоимость <span>{{totalAmount}} руб.</span></div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {DELETE_FROM_CART, UPDATE_CART, UPDATE_DATA} from "@/store/actions/goods.actions";
    import {inputValueNotNull} from "@/utils/cart/validation/input-not-null.utils";
    import {debounce, findCb, findElement, getProperty} from "@/utils/custom.utils";
    import BoxOrderChecker from "@/utils/cart/validation/box-order-checker.utils";

    export default {
        name: 'Cart',
        computed: {
            ...mapGetters({
                cartData: 'getCartData',
                goodsData: 'getGoodsData'
            }),
            cartIsNotEmpty() {
                return this.cartData.length > 0;
            },
            totalAmount() {
                const totalAmount = this.cartData.reduce((acc, current) => {
                    return acc + (current.price * +current.count);
                }, 0);
                const fractionDigits = 2;
                return +totalAmount.toFixed(fractionDigits);
            }
        },
        methods: {
            addProduct(product, index) {
                const {availableCount} = product;
                const productIsAvailable = availableCount > 0;
                if (productIsAvailable) {
                    this.$store.dispatch(UPDATE_CART, {
                        groupName: index,
                        product
                    });
                }
            },
            deleteProduct(index) {
                this.$store.dispatch(DELETE_FROM_CART, index);
            },
            checkAvailableCount(product, event) {
                const CHANGE_DEBOUNCE = 100;
                debounce(CHANGE_DEBOUNCE, () => {
                    const checker = this.countChecker;
                    inputValueNotNull(checker, {product, event});
                })();
            },
            countChecker(product, event) {
                const cloneGoodsStore = {...this.goodsData};
                const propertyName = getProperty(product, 'groupName');
                const productInGoodsList = findElement(cloneGoodsStore[propertyName], findCb(product, 'goodsId'));

                const payload = {
                    productInGoodsList,
                    product,
                    element: event,
                };

                const model = new BoxOrderChecker(payload).convertAndSetParams();
                const actions = model.checkValueBecameLow() || model.checkValueExceededLimit() || model.setNewAvailableCount();
                if (actions) {
                    this.$store.commit(UPDATE_DATA, {
                        newState: cloneGoodsStore
                    });
                }
            }
        }
    }
</script>
<style scoped>
    .box-wrapper {
        font-family: "Arial", sens-selif;
        max-width: 1000px;
        margin: 20px auto 0 auto;
        padding: 0 20px;
    }

    .box-wrapper .box-inner {
        box-sizing: border-box;
        border: 1px solid #A8ADAF;
        border-radius: 3px;
        margin: 5px;
    }

    .box-wrapper .box-inner > div {
        display: flex;
        justify-content: space-between;
    }

    .box-wrapper .box-inner > div div {
        padding: 5px;
    }

    .box-wrapper .box-inner > div .box-inner__title:first-child {
        padding-left: 11px;
    }

    .box-wrapper .box-inner > div .box-inner__title:not(:first-child) {
        padding-left: 1px;
    }

    .box-wrapper .box-inner__body {
        padding: 6px;
    }

    .box-wrapper .box-inner__title {
        background-color: #D2DEE2;
        font-weight: 600;
        color: #444445;
    }

    .box-wrapper .box-inner__name {
        flex-basis: 45%;
        display: table-cell;
        vertical-align: middle;
    }

    .box-wrapper .box-inner__count {
        flex-basis: 20%;
    }

    .box-wrapper .box-inner__count-input {
        padding: 2px;
        width: 2em;
    }

    .box-wrapper .box-inner__price {
        flex-basis: 20%;
    }

    .box-wrapper .box-inner__action {
        flex-basis: 20%;
    }

    .box-wrapper .total-price {
        text-align: right;
    }

    .box-wrapper .total-price div {
        padding: 10px;
    }

    .box-wrapper .total-price div span {
        color: #FF6600;
    }
</style>
