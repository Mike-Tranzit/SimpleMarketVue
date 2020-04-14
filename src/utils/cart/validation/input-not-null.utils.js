export function inputValueNotNull( f, {product, event}) {
        const element = event.target;
        const value = +element.value;
        if (Number.isNaN(value) || value === product.count) {
            const newElementValue = element.value === '' ? element.value : String(product.count);
            element.value = newElementValue;
            return;
        }
      //  f(product, element);
}
