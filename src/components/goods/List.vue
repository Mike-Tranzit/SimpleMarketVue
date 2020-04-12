<template>
    <div>
        <div class="products-wrapper">
            <div class="products-group" v-for="(goods, index) in goodsData" :key="index">
                <div class="products-group__title">{{index}}</div>
                <div class="products-group__item" v-for="product of goods" :key="product.goodsId"
                     v-on:click="add(product, index)">
                    <div class="products-group__item-name">{{product.goodsName}} ({{product.availableCount}})</div>
                    <div class="products-group__item-price"
                         v-priceUpdateChecker="{price:product.price, previousPrice: product.previousPrice}">
                        {{product.price}}
                    </div>
                </div>
            </div>
        </div>
        <Cart/>
    </div>
</template>

<script>
    import Cart from "./Cart.vue";
    import {mapGetters} from 'vuex';
    import {GET_CATEGORIES, GET_DATA} from "@/store/actions/goods.actions";
    import {PriceFieldColors} from '@/utils/goods.utils';

    export default {
        name: 'GoodsList',
        components: {
            Cart
        },
        data() {
            return {
                data: {data: {}}
            };
        },
        computed: {
            ...mapGetters({
                goodsData: 'getGoodsData'
            })
        },
        directives: {
            priceUpdateChecker: {
                update: function (el, binding) {
                    const {value: {price: currentPrice}, oldValue: {price: previousPrice}} = binding;
                    if (currentPrice > previousPrice) {
                        PriceFieldColors.priceBecomeHigher(el);
                    } else {
                        PriceFieldColors.priceBecomeLower(el);
                    }
                    PriceFieldColors.setColorAfterChange(el);
                }
            }
        },
        async created() {
            await this.$store.dispatch(GET_CATEGORIES);
            await this.$store.dispatch(GET_DATA);
        },
    }
</script>
<style scoped>
    .products-wrapper {
        font-family: 'Arial', sens-selif;
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .products-group {
        flex: 0 49%;
        box-sizing: border-box;
        border: 1px solid #A8ADAF;
        border-radius: 3px;
        margin: 5px;
    }

    .products-group__title {
        background-color: #D2DEE2;
        padding: 5px 5px 5px 13px;
        font-weight: 600;
        color: #444445;
    }

    .products-group__item {
        padding: 5px;
        display: flex;
        justify-content: space-around;
    }

    .products-group__item-name {
        flex-basis: 80%;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .products-group__item-price {
        flex-basis: 10%;
        background-color: #F3F3F3;
        padding: 6px;

        color: #090754;
        text-align: center;
        font-weight: 600;
    }

    .products-group__item:hover {
        cursor: pointer;
        background-color: #ECDFA8;
    }

    .products-group__item + .products-group__item {
        margin-top: 3px;
    }
</style>
