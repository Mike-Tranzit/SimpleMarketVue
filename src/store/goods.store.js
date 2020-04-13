import Vue from "vue";
import {
    DELETE_FROM_CART,
    GET_CATEGORIES,
    GET_DATA,
    INIT_DATA,
    SET_CATEGORIES,
    UPDATE_CART,
    UPDATE_DATA,
    CHECK_CART_DATA
} from './actions/goods.actions';

import goodsService from "@/services/goods.service";
import currencyService from "@/services/currency.service";

import {CategoriesActionsHandler} from "@/utils/category-proxy.utils";
import {sortGoodsWithCategories} from "@/utils/goods.utils";
import {getProperty, findElement, findCb} from "@/utils/custom.utils";
import Cart from "@/utils/cart.utils";
import {ProductCountActionEnum} from "@/utils/vaiables";


export default {
    state: {
        goods: {},
        categories: {},
        cart: []
    },
    getters: {
        getGoodsData: state => state.goods,
        getCartData: state => state.cart,
    },
    actions: {
        [GET_CATEGORIES]: async ({commit}) => {
            const {data: categories} = await goodsService.loadCategories();

            commit(SET_CATEGORIES, categories.data);
        },
        [GET_DATA]: async ({dispatch}) => {
            const {data} = await goodsService.pollGoodsData();
            new Vue({
                watch: {
                    '$goodsList.data'(data) {
                        dispatch(INIT_DATA, { data, updateCart: true });
                    }
                }
            });
            dispatch(INIT_DATA, data);
        },
        [INIT_DATA]: async ({dispatch, commit}, {data, updateCart = false}) => {
            const exchangeRate = await currencyService.actualDollarExchangeRate();
            const {Value: {Goods: goods = []}} = data;
            await commit(INIT_DATA, {exchangeRate, goods, commit, updateCart});
        },
        [UPDATE_CART]({commit, state}, {product, groupName}) {
            const cart = new Cart({...product, groupName}, {
                cartState: state.cart,
                goodsState: state.goods
            });
            cart.setInitCartPosition();
            cart.increaseProductCount();
            cart.goodsCountActions(ProductCountActionEnum.DECREASE);
            commit(UPDATE_CART, {newState: cart.state.cartState});
            commit(UPDATE_DATA, {newState: cart.state.goodsState});
        },
        [DELETE_FROM_CART]({commit, state}, index) {
            const product = state.cart[index];
            if (product) {
                const cart = new Cart({...product}, {
                    cartState: state.cart,
                    goodsState: state.goods
                });
                cart.goodsCountActions(ProductCountActionEnum.INCREASE);
                cart.deleteProductFromCart(index);
                commit(UPDATE_CART, {newState: cart.state.cartState});
                commit(UPDATE_DATA, {newState: cart.state.goodsState});
            }
        }
    },
    mutations: {
        [SET_CATEGORIES]: (state, data) => {
            state.categories = data;
        },
        [INIT_DATA]: (state, {exchangeRate, goods, commit, updateCart = false}) => {
            const payload = {
                goodsData: goods,
                categories: new CategoriesActionsHandler({...state.categories}),
                exchangeRate: exchangeRate,
            };
            const newState = sortGoodsWithCategories(payload);

            commit(UPDATE_DATA, {newState});
        },
        [CHECK_CART_DATA]: (state, {dispatch, commit}) => {
            if(state.cart.length === 0) {
                return;
            }
            let cloneCartState = [...state.cart];
            let cloneGoodsState = {...state.goods};
            for (const key of Object.keys(cloneCartState)) {

                const itemOfCart = cloneCartState[key]; console.log(itemOfCart);
                const propertyName = getProperty(itemOfCart, 'groupName');
                const item = findElement(cloneGoodsState[propertyName], findCb(itemOfCart, 'goodsId'));

                if (item) {
                    const exceededLimit = itemOfCart.count > item.availableCount;
                    if (exceededLimit) {
                        itemOfCart.count = item.availableCount;
                    } else {
                        item.availableCount = item.availableCount - itemOfCart.count;
                    }
                    itemOfCart.price = item.price;
                } else {
                    dispatch(DELETE_FROM_CART, key);
                }
            }
            commit(UPDATE_CART, {newState: cloneCartState});
            commit(UPDATE_DATA, {newState: cloneGoodsState});
        },
        [UPDATE_DATA]: (state, {newState}) => {
            state.goods = {...newState};
        },
        [UPDATE_CART]: (state, {newState}) => {
            state.cart = [...newState];
        }
    }
}
