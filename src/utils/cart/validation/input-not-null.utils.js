export function inputValueNotNull( f, {cloneProduct: product, event}) {
        const element = event.target;
        const value = +element.value;
        if (Number.isNaN(value) || value === product.count) {
            const newElementValue = element.value === '' ? element.value : product.count;
            element.value = newElementValue;
            return;
        }
      //  f(product, element);
}
