import Vue from "vue";
import {
    DELETE_FROM_CART,
    GET_CATEGORIES,
    GET_DATA,
    INIT_DATA,
    SET_CATEGORIES,
    UPDATE_CART,
    UPDATE_DATA,
    UPDATE_ALL
} from './actions/goods.actions';

import goodsService from "@/services/goods.service";
import currencyService from "@/services/currency.service";

import {CategoriesActionsHandler} from "@/utils/category-proxy.utils";
import {sortGoodsWithCategories} from "@/utils/goods/goods.utils";
import {Cart, CartPollingUpdater} from "@/utils/cart/cart.utils";
import {ProductCountActionEnum} from "@/utils/variables";


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
                        dispatch(INIT_DATA, {data, updateCart: true});
                    }
                }
            });
            dispatch(INIT_DATA, {data, updateCart: false});
        },
        [INIT_DATA]: async ({dispatch, commit}, {data: {data}, updateCart}) => {
            const exchangeRate = await currencyService.actualDollarExchangeRate();
            const {Value: {Goods: goods = []}} = data;
            const stateActions = {commit, dispatch};
            await commit(INIT_DATA, {exchangeRate, goods, updateCart, stateActions});
        },
        [UPDATE_CART]({dispatch, state}, {product, groupName}) {
            const cart = new Cart({...product, groupName}, {
                cartState: state.cart,
                goodsState: state.goods
            });

            cart.setInitCartPosition();
            cart.increaseProductCount();
            cart.goodsCountActions(ProductCountActionEnum.DECREASE);

            dispatch(UPDATE_ALL, {
                cartState: cart.state.cartState,
                goodsState: cart.state.goodsState
            });
        },
        [DELETE_FROM_CART]({dispatch, state}, index) {
            const product = state.cart[index];
            if (product) {
                const cart = new Cart({...product}, {
                    cartState: state.cart,
                    goodsState: state.goods
                });

                cart.goodsCountActions(ProductCountActionEnum.INCREASE);
                cart.deleteProductFromCart(index);

                dispatch(UPDATE_ALL, {
                    cartState: cart.state.cartState,
                    goodsState: cart.state.goodsState
                });
            }
        },
        [UPDATE_ALL]: ({commit}, {cartState, goodsState}) => {
            commit(UPDATE_CART, {newState: cartState});
            commit(UPDATE_DATA, {newState: goodsState});
        }
    },
    mutations: {
        [SET_CATEGORIES]: (state, data) => {
            state.categories = data;
        },
        [INIT_DATA]: (state, {exchangeRate, goods, updateCart, stateActions}) => {
            const payload = {
                goodsData: goods,
                categories: new CategoriesActionsHandler({...state.categories}),
                exchangeRate: exchangeRate,
            };
            let newState = sortGoodsWithCategories(payload);

            const cartPollingUpdater = new CartPollingUpdater({
                cartState: state.cart,
                goodsState: newState,
                updateCart
            });

            if (cartPollingUpdater.checkDiffCartAndGoodsList()) {
                const {newCartState, newGoodsState} = cartPollingUpdater.newStates;
                stateActions.commit(UPDATE_CART, {newState: newCartState});
                newState = {...newGoodsState}
            }

            stateActions.commit(UPDATE_DATA, {newState});
        },
        [UPDATE_DATA]: (state, {newState}) => {
            state.goods = {...newState};
        },
        [UPDATE_CART]: (state, {newState}) => {
            state.cart = [...newState];
        }
    }
}
