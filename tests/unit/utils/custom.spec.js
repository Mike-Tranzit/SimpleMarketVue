import {findElement, getProperty, findCb} from "@/utils/custom.utils";

describe("Custom utils", () => {
    it('getProperty', function () {
        const mockObject = {
            "name": "Mock"
        };
        expect(getProperty(mockObject, "name")).toEqual(mockObject["name"]);
    });

    it('findElement', function () {
        const mockElements = [
            {
                id: 1
            },
            {
                id: 2
            }
        ];
        const cb = (item) => item.id === 1;
        expect(findElement(mockElements, cb).id).toEqual(1);
    });

    it('findCb', function () {
        const mockElements = [
            {
                id: 1
            }
        ];
        expect(mockElements.find(findCb(mockElements[0], "id")).id || 0).toBe(1);
    });
});
