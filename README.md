# Contact Management App 
This is an app to manage contacts (add, view, edit, delete).  The flow of the webapp is as follows:
- User lands on the contacts page. User can use the sidebar to navigate between contacts page and charts page.
- In the contacts page, if no contacts are found in the server, the user sees a message which tells them that no contact is found.
- When the user clicks on the "Add New Contact" button, they see a dialog box which has a form to add new contact.
- Upon adding, the card is updated in real time in which there is a View button.
- Upon clicking the View button, the form opens in Edit mode.
- If the user makes changes and clicks on the "Save" button, the contact is updated. The other option beside Save is Delete.
- Upon navigating to the Charts and Maps page, the user can see a list of Worldwide Covid cases and a line chart corresponding to that.
- Beneath which there is a Leaflet map with markers which are clickable upon which they open a popup which displays the country wise covid details.

# Technologies used: 
- React
- TypeScript
- TailwindCSS
- Redux
- React Query AKA TanStack Query
- React Leaflet
- ChartJS
- Material UI for React
- React Router v6
