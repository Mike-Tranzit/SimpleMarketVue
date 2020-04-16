import apiService from "@/services/api.service";
import axios from 'axios';

jest.mock("axios", () => ({
    get: () => Promise.resolve(true)
}));

describe("apiService", () => {
    it('should called get',  function () {
        expect(apiService.get("/")).resolves.toEqual(true);
    });
});
