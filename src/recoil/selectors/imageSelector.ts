import { selector } from "recoil";
import axios from "axios";
import { searchState } from "../atoms/searchState";
import { pageState } from "../atoms/pageState";
import { API_KEY } from "@/constants";
import { API_URL } from "@/constants";

const PER_PAGE = 30;

export const imageData = selector({
  key: "imageData",
  get: async ({ get }) => {
    // atom 값이 넘어옴
    const searchValue = get(searchState);
    const pageValue = get(pageState);

    // API 호출
    try {
      const res = await axios.get(
        `${API_URL}?query=${searchValue}&client_id=${API_KEY}&page=${pageValue}&per_page=${PER_PAGE}`
      );

      //   이 selector 호출 시 이 res 값이 return
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },
});
