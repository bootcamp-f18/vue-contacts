// This isn't set up to copy yet!

let app = new Vue({

    el: "#app",

    data: {

        showForm: true,

        formFirst: '',
        formLast: '',
        formEmail: '',
        formPhone: '',
        formOldId: '',

        nextId: 1,

        sortIsAscending: false,
        sortByField: '',

        filterText: '',

        contacts: []

    },

    mounted() {
        if (localStorage.getItem('contacts')) {
            this.contacts = JSON.parse(localStorage.getItem('contacts'));
        }
        this.resetNextId();
    },

    computed: {

        sortedFilteredContacts: function () {

            let filteredContacts = this.contacts;
            let search = this.filterText.trim().toLowerCase();

            if (search) {

                filteredContacts = filteredContacts.filter(function(contact) {

                    if (
                            contact.firstname.toLowerCase().indexOf(search) !== -1 ||
                            contact.lastname.toLowerCase().indexOf(search) !== -1 ||
                            contact.emailaddr.toLowerCase().indexOf(search) !== -1 ||
                            contact.phonenum.toLowerCase().indexOf(search) !== -1
                    ) {
                        return contact;
                    }

                });

            }

            filteredContacts.sort(this.compare);

            // TODO: sortIsAscending
            if (!this.sortIsAscending) {
                filteredContacts.reverse();
            }

            return filteredContacts;

        }

    },

    methods: {

        compare: function (a, b) {

            // a is the first contact object
            //      a.firstname,
            //      a.lastname...
            // b is the second contact object

            // a compare function works by returns:
            // 0 if a = b
            // 1 if a > b
            // -1 if a < b

            if ( a[this.sortByField] > b[this.sortByField] ) {
                return 1;
            }
            else if ( a[this.sortByField] < b[this.sortByField] ) {
                return -1;
            }
            return 0;

        },

        addOrUpdateContact: function () {

            // TODO:
            // What kind of input validation do we want to do?

            if (this.formOldId != '') {
                this.deleteContact(this.formOldId);
            }

            let newContact = {
                id: this.nextId,
                firstname: this.formFirst,
                lastname: this.formLast,
                emailaddr: this.formEmail,
                phonenum: this.formPhone
            };

            this.nextId++;

            this.contacts.push(newContact);

            localStorage.setItem('contacts', JSON.stringify(this.contacts));

            this.cancel();

        },

        editContact: function (contactId) {

            // TODO: should we check that the contactID is valid?

            let index = this.findIndexById(contactId);

            this.formFirst = this.contacts[index].firstname;
            this.formLast = this.contacts[index].lastname;
            this.formEmail = this.contacts[index].emailaddr;
            this.formPhone = this.contacts[index].phonenum;
            this.formOldId = this.contacts[index].id;

            this.showForm = true;

        },

        deleteContact: function (contactId) {

            let index = this.findIndexById(contactId);
            this.contacts.splice(index, 1);

            localStorage.setItem('contacts', JSON.stringify(this.contacts));

            if (this.contacts.length == 0) {
                this.showForm = true;
            }

        },

        sortContacts: function (request) {

            console.log("Sorting contacts by [" + request + "]");

            // TODO: confirm that the sort order requested is a valid one

            if (request == this.sortByField) {
                this.sortIsAscending = !this.sortIsAscending;
            }
            else {
                this.sortByField = request;
                this.sortIsAscending = true;
            }

        },

        toggleForm: function () {

            this.showForm = !this.showForm;

        },

        findIndexById: function (contactId) {
            let index = -1;
            for (let i=0; i < this.contacts.length; i++) {
                if (contactId == this.contacts[i].id) {
                    index = i;
                }
            }
            return index;
        },

        cancel: function () {

            this.formFirst = '';
            this.formLast = '';
            this.formEmail = '';
            this.formPhone = '';
            this.formOldId = '';

        },

        resetNextId: function () {

            let maxId = 0;
            this.contacts.forEach(function(contact) {
                if (contact.id > maxId) {
                    maxId = contact.id;
                }
            });

            this.nextId = ++maxId;

        }

    }

});
