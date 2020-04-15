import {createLocalVue, shallowMount} from '@vue/test-utils'
import Cart from "@/components/goods/Cart.vue";
import Vuex from 'vuex';

import {DELETE_FROM_CART, UPDATE_CART, UPDATE_DATA} from "@/store/actions/goods.actions";

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Cart.vue', () => {
    let wrapper;
    let store;

    /* Vuex properties */
    let actions = {
        [DELETE_FROM_CART]: jest.fn(),
        [UPDATE_CART]: jest.fn((groupName, product) => {
          state.cart.push(product);
        }),
        [UPDATE_DATA]: jest.fn(),
    };
    let getters = {
        getGoodsData: () => {
        },
        getCartData: () => []
    };
    let state = {
        goods: {},
        categories: {},
        cart: []
    };

    beforeEach(() => {
        store = new Vuex.Store({
            state,
            getters,
            actions
        });
        wrapper = shallowMount(Cart, {store, localVue});
    });

    it('Cart is created', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
    });

    it('call addProduct with positive availableCount', () => {
        const product = {
            availableCount: 1
        };
        const index = "Test";
        wrapper.vm.addProduct(product, index);
        expect(actions[UPDATE_CART]).toHaveBeenCalled();
    });

  it('product has added to cart', function () {
      const product = {
        availableCount: 1
      };
      const index = "Test";
      wrapper.vm.addProduct(product, index);
      expect(state.cart.length).toBe(1);
  });

  it('product delete from cart', function () {
      const product = {
        availableCount: 1
      };
      const index = "Test";
      wrapper.vm.addProduct(product, index);
      wrapper.vm.addProduct(product, index);
  });

  it('cartIsNotEmpty is false', () => {
      expect(wrapper.vm.cartIsNotEmpty).toBe(false);
    });
})

