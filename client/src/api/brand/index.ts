import axios, { AxiosResponse } from "axios";
import { API } from "../../config";
import { Brand, BrandValues } from "./brand-types";
export type { Brand } from "./brand-types";

export const createBrand = (
  values: BrandValues
): Promise<AxiosResponse<Brand>> =>
  axios.post<Brand>(`${API}/brand/create`, values, {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

export const getBrands = (): Promise<AxiosResponse<Brand[]>> =>
  axios.get<Brand[]>(`${API}/brands`);
