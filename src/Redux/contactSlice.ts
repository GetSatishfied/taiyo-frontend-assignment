import { createSlice, createAsyncThunk, CaseReducer } from "@reduxjs/toolkit";
import axios from "axios";
import { Contact } from "../components/ContactForm";


const API_BASE_URL = "https://taiyo-ai-server.onrender.com/contacts";

export const fetchContacts = createAsyncThunk("contacts/fetchContacts", async () => {
  const response = await axios.get(API_BASE_URL);
  console.log(response.data);
  return response.data;
});

export const addContact = createAsyncThunk("contacts/addContact", async (newContact: { name: string; email: string; phone: string; activity: string }) => {
    const response = await axios.post(API_BASE_URL, newContact);
    return response.data;
  });
  export const editContact = createAsyncThunk('contacts/editContact', async (editedContact: Contact) => {
    // Perform the API call
    // Return the edited contact data
    const response = await axios.put(`https://taiyo-ai-server.onrender.com/contacts/${editedContact.id}`, editedContact);
    return response.data;
  });
  
  export const deleteContact = createAsyncThunk('contacts/deleteContact', async (contactId: string) => {
    // Perform the API call
    // Return the ID of the deleted contact
    await axios.delete(`https://taiyo-ai-server.onrender.com/contacts/${contactId}`);
    return contactId;
  });

export interface ContactsState {
  contacts: Contact[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  reducer: any; // Add the 'reducer' property to the ContactsState interface
}

const initialState: ContactsState = {
  contacts: [],
  status: "idle",
  error: null,
  reducer: null, // Initialize the 'reducer' property to null or provide the initial value for your reducer
};

const contactsSlice = createSlice<ContactsState, Record<string, CaseReducer<ContactsState, any>>>({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
        state.error = null; // Reset the error on pending
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error occurred.";
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts.push(action.payload);
      })
      .addCase(editContact.fulfilled, (state, action) => {
        const editedContact = action.payload;
        const index = state.contacts.findIndex((contact) => contact.id === editedContact.id);
        if (index !== -1) {
          state.contacts[index] = editedContact;
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        const contactId = action.payload;
        state.contacts = state.contacts.filter((contact) => contact.id !== contactId);
      });
  },
});


export default contactsSlice.reducer;
