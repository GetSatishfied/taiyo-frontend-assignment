import { configureStore } from "@reduxjs/toolkit";
import contactsSlice, { ContactsState } from "./contactSlice";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    contacts: contactsSlice as ContactsState["reducer"],
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;