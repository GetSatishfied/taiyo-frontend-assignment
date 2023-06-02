import React from "react";
import axios from 'axios';
import { useAppDispatch } from "../Redux/store";
import { addContact, editContact, deleteContact, fetchContacts } from "../Redux/contactSlice";
import { useQuery, useMutation, UseQueryResult, useQueryClient } from "react-query";
import { Button, useTheme, Modal, TextField, Box, Dialog, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardContent, Typography } from "@mui/material";
import ContactMailRoundedIcon from "@mui/icons-material/ContactMailRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AddIcon from "@mui/icons-material/Add";
import "../index.css";
import useMediaQuery from "@mui/material/useMediaQuery";



export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    activity: string;
}
interface ContactFormProps {
    contacts: Contact[];
    onCreateContact: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contacts, onCreateContact }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    // const { data: contacts = [], refetch }: UseQueryResult<string[]> = useQuery("contacts", () => dispatch(fetchContacts()), {
    //     refetchOnMount: false,
    //     refetchOnWindowFocus: false,
    // });



    const { mutateAsync: addContactMutation } = useMutation(addContact.typePrefix, (newContact: { name: string; email: string; phone: string; activity: string }) =>
        dispatch(addContact(newContact))
    );
    const { mutateAsync: editContactMutation } = useMutation(editContact.typePrefix, (editedContact: Contact) =>
        dispatch(editContact(editedContact))
    );

    const { mutateAsync: deleteContactMutation } = useMutation(deleteContact.typePrefix, (contactId: string) =>
        dispatch(deleteContact(contactId))
    );

    //  


    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [activity, setActivity] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddContact = async () => {
        if (!isValidEmail(email)) {
            return; // Stop the submission if the email is invalid
        }
        const newContact = { name, email, phone, activity };
        try {
            const response = await axios.post('https://taiyo-ai-server.onrender.com/contacts', newContact);
            console.log('Response:', response);
            const addedContact = { ...newContact, id: response.data.id };

            dispatch(addContact(addedContact));
            queryClient.invalidateQueries('contacts');

            setName('');
            setEmail('');
            setPhone('');
            setActivity('');
            setOpen(false);
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };
    const handleEditContact = async () => {
        if (selectedContact) {
            try {
                const response = await axios.put(`https://taiyo-ai-server.onrender.com/contacts/${selectedContact.id}`, selectedContact);
                console.log('Response:', response);
                dispatch(editContact(selectedContact));
                queryClient.invalidateQueries('contacts');
                setSelectedContact(null);
            } catch (error) {
                console.error('Error editing contact:', error);
            }
        }
    };

    const handleDeleteContact = async () => {
        if (selectedContact) {
            try {
                await axios.delete(`https://taiyo-ai-server.onrender.com/contacts/${selectedContact.id}`);
                dispatch(deleteContact(selectedContact.id));
                queryClient.invalidateQueries('contacts');
                setSelectedContact(null);
            } catch (error) {
                console.error('Error deleting contact:', error);
            }
        }
    };
    const handleCloseModal = () => {
        setSelectedContact(null);
    };


    // const [value, setValue] = React.useState('female');

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setValue((event.target as HTMLInputElement).value);
    // };
    const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
    function isValidEmail(email: string): boolean {
        // Basic email validation using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    return (
        <div>
            <h1 className="title">My Contacts</h1>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                style={{ backgroundColor: "#1a1a1a", color: "white" }}
                onClick={handleClickOpen}
            >
                Add New Contact
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle
                    sx={{ textAlign: "center" }}
                >
                    Add New Contact
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{ textAlign: "center" }}
                    >
                        To create a contact, please enter Name, Email, and Phone Number.
                    </DialogContentText>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <TextField
                            id="input-name"
                            label="Full Name"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            sx={{
                                width: '75%',
                            }}
                            InputProps={{
                                startAdornment: (
                                    <AccountCircleRoundedIcon
                                        sx={{
                                            marginRight: "8px",
                                        }}
                                    />
                                ),
                            }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <TextField
                            id="input-contact-number"
                            label="Contact Number"
                            variant="outlined"
                            type="number"
                            margin="normal"
                            fullWidth
                            sx={{
                                width: '75%',
                            }}
                            InputProps={{
                                startAdornment: (
                                    <ContactPhoneRoundedIcon
                                        sx={{
                                            marginRight: "8px",
                                        }}
                                    />
                                ),
                            }}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <TextField
                            id="input-email"
                            label="Email"
                            variant="outlined"
                            error={!isValidEmail(email)}
                            helperText={isValidEmail(email) ? '' : 'Invalid email address'}
                            margin="normal"
                            fullWidth
                            sx={{
                                width: '75%',
                            }}
                            InputProps={{
                                startAdornment: (
                                    <ContactMailRoundedIcon
                                        sx={{
                                            marginRight: "8px",
                                        }}
                                    />
                                ),
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Activity</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={activity}
                                onChange={(e) => setActivity(e.target.value)}
                            >
                                <FormControlLabel value="active" control={<Radio />} label="Active" />
                                <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAddContact}>Add Contact</Button>
                </DialogActions>
            </Dialog>
            {Array.isArray(contacts) && contacts.length > 0 ? (
                <div>
                    <div className="cards-container flex">
                        {contacts.map((contact: Contact) => (
                            <Card key={contact.id} sx={{ maxWidth: 400, margin: "20px auto", backgroundColor: '#1a1a1a', color: "white" }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {contact.name}
                                    </Typography>
                                    <Button variant="outlined" color="primary" sx={{ margin: "4px" }} onClick={() => setSelectedContact(contact)}>
                                        View
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                        <Modal open={Boolean(selectedContact)} onClose={handleCloseModal}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    bgcolor: 'white',
                                    boxShadow: 24,
                                    p: 4,
                                    maxWidth: 400,
                                    color: "black",
                                }}
                            >
                                {selectedContact && (
                                    <form onSubmit={handleEditContact}>
                                        <Typography variant="h6">{selectedContact.name}</Typography>
                                        <TextField
                                            id="edit-name"
                                            label="Full Name"
                                            variant="outlined"
                                            type="text"
                                            margin="normal"
                                            sx={{
                                                width: '75%',
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <AccountCircleRoundedIcon
                                                        sx={{
                                                            marginRight: "8px",
                                                        }}
                                                    />
                                                ),
                                            }}
                                            fullWidth
                                            value={selectedContact.name}
                                            onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })}
                                        />
                                        <TextField
                                            id="edit-contact-number"
                                            label="Contact Number"
                                            variant="outlined"
                                            margin="normal"
                                            sx={{
                                                width: '75%',
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <ContactPhoneRoundedIcon
                                                        sx={{
                                                            marginRight: "8px",
                                                        }}
                                                    />
                                                ),
                                            }}
                                            type="number"
                                            fullWidth
                                            value={selectedContact.phone}
                                            onChange={(e) => setSelectedContact({ ...selectedContact, phone: e.target.value })}
                                        />
                                        <TextField
                                            id="edit-email"
                                            label="Email"
                                            variant="outlined"
                                            margin="normal"
                                            sx={{
                                                width: '75%',
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <ContactMailRoundedIcon
                                                        sx={{
                                                            marginRight: "8px",
                                                        }}
                                                    />
                                                ),
                                            }}
                                            type={"email"}
                                            fullWidth
                                            value={selectedContact.email}
                                            onChange={(e) => setSelectedContact({ ...selectedContact, email: e.target.value })}
                                        />
                                        <FormControl component="fieldset" margin="normal" fullWidth>
                                            <FormLabel component="legend" style={{ color: 'white' }}>Activity</FormLabel>
                                            <RadioGroup
                                                aria-label="activity"
                                                name="activity"
                                                value={selectedContact.activity}
                                                onChange={(e) => setSelectedContact({ ...selectedContact, activity: e.target.value })}
                                            >
                                                <FormControlLabel value="active" control={<Radio color="secondary" />} label="Active" />
                                                <FormControlLabel value="inactive" control={<Radio color="secondary" />} label="Inactive" />
                                            </RadioGroup>
                                        </FormControl>
                                        <Button type="submit" variant="outlined" color="secondary" sx={{ margin: "4px" }}>
                                            Save
                                        </Button>
                                        <Button variant="outlined" color="error" sx={{ margin: "4px" }} onClick={handleDeleteContact}>
                                            Delete
                                        </Button>
                                    </form>
                                )}
                            </Box>
                        </Modal>

                    </div>
                </div>
            ) : (
                <div>
                    <p>No contacts found.</p>
                    <p>Please click the "Add New Contact" button to proceed with adding contacts.</p>
                </div>
            )}
        </div>


    );
};

export default ContactForm;


