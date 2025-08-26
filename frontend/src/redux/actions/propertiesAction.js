import {
  GET_PROPERTIES,
  GET_FEATURED_PROPERTIES,
  GET_PROPERTY,
} from "../constants/propertyConstants";
import { api } from "../../helpers/api";


const toCard = (row) => {
  const location = [row.city, row.state].filter(Boolean).join(", ");
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    location,
    description: row.description || "",
    images: row.imageUrl ? [row.imageUrl] : [],
    featured: !!row.featured,
  };
};

export const getPropertyList = (page = 1, limit = 12) => async (dispatch) => {
  const rows = await api(`/api/properties?page=${page}&limit=${limit}`);
  dispatch({ type: GET_PROPERTIES, payload: rows.map(toCard) });
};

export const getFeaturedList = () => async (dispatch) => {
  const rows = await api(`/api/properties?featured=true&limit=6`);
  dispatch({ type: GET_FEATURED_PROPERTIES, payload: rows.map(toCard) });
};

export const getProperty = (id) => async (dispatch) => {
  const row = await api(`/api/properties/${id}`);
  dispatch({ type: GET_PROPERTY, payload: toCard(row) });
};
