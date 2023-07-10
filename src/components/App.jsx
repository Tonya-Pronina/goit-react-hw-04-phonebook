import React, { useState, useCallback, useEffect } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { nanoid } from 'nanoid';
import ContactList from './ContactList/ContactList';
import Filter from './Filter/Filter';
import css from 'components/App.module.css';
import { LOCALSTORAGE_KEY } from './KEY';

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  const getContactsFromLS = useCallback(() => {
    const localSavedContacts = localStorage.getItem(LOCALSTORAGE_KEY);
    if (localSavedContacts !== null) {
      setContacts(JSON.parse(localSavedContacts));
    }
  }, []);

  useEffect(() => {
    getContactsFromLS();
  }, [getContactsFromLS]);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = userData => {
    const newUser = { ...userData, id: nanoid() };

    const contactExisting = contacts.some(
      contact => contact.name.toLowerCase() === userData.name.toLowerCase()
    );
    if (contactExisting) {
      alert(`${userData.name}is already in contacts`);
      return;
    }

    setContacts(prevContacts => [...prevContacts, newUser]);
  };

  const removeContact = id => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== id)
    );
  };

  const handleFilter = ({ target: { value } }) => {
    setFilter(value);
  };

  const contactsArrFilter = (name, filter) => {
    return name.toLowerCase().includes(filter.toLowerCase().trim());
  };

  const contactsArr = contacts.filter(contact =>
    contactsArrFilter(contact.name, filter)
  );

  return (
    <div>
      <h1 className={css.title}>Phonebook</h1>

      <ContactForm onAddContact={handleAddContact} contacts={contacts} />

      <h2 className={css.title}>Contacts</h2>

      <Filter handleFilter={handleFilter} filterValue={filter} />

      <ContactList contactsArr={contactsArr} removeContact={removeContact} />
    </div>
  );
};
