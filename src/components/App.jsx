import { Component } from 'react';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ContactList from 'components/ContactList/ContactList';
import AddingContacts from 'components/AddingContacts/AddingContacts';
import { load } from 'service/LocalStorageService';
import { save } from 'service/LocalStorageService';

export class App extends Component {
  state = {
    contacts: load('contacts'),
    filter: '',
  };

  componentDidMount() {}
  addContact = event => {
    event.preventDefault();
    const { name, number } = event.target;
    const contact = {
      id: nanoid(),
      name: name.value,
      number: number.value,
    };
    const info = contact.name + ' is already in contacts';
    this.checkAddContact(this.state.contacts, contact)
      ? Notify.failure(info)
      : save('contacts', [...load('contacts'), contact]);
    this.setState({ contacts: load('contacts') });

    event.target.reset();
  };

  deleteContact = event => {
    const value = event.target.parentNode.firstChild.textContent;

    this.setState(
      {
        contacts: this.state.contacts.filter(item => item.name !== value),
      },
      () => {
        console.log();
        save('contacts', this.state.contacts);
      }
    );
  };

  checkAddContact = (contacts, newContact) => {
    return contacts.find(contact => contact.name === newContact.name);
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  filteredContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedCase = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedCase)
    );
  };

  render() {
    const filtred = this.filteredContacts();

    console.log('storage', load('contacts'));
    console.log('state', this.state.contacts);

    return (
      <div>
        <AddingContacts title="Name" handleAddContact={this.addContact} />
        <ContactList
          title="Contacts"
          contacts={filtred}
          handleDeleteContact={this.deleteContact}
          changeFilter={this.changeFilter}
        />
      </div>
    );
  }
}
