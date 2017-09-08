//Объявление общедоступных переменных
let ContactsArray = [];
let Contact;
let createNewContact = true;
let SearchArray = [];
//Блок событий при отображении списка контактов
$('#add-contact-button').click(function () {
    AddNewContact();
});
let inputSearch = document.getElementById('inputsearch');
inputSearch.oninput = function () {

    SearchArray.length = 0;

    let matchValue = /^[a-zA-Z\s]*$/;
    if (!inputSearch.value.match(matchValue) || inputSearch.value.length > 22)
    {
        inputSearch.value = inputSearch.value.substr(0, inputSearch.value.length - 1);
    }

    for (let i = 0; i < ContactsArray.length; i++)
    {
        if (ContactsArray[i].name.toLowerCase().indexOf(inputSearch.value.toLowerCase()) ==  0 )
        {
            SearchArray.push(ContactsArray[i]);
        }
    }
    ReloadContactList(SearchArray);
}

//Подтягивание базы контактов при первом запуске/релоаде
    if (localStorage.getItem('Contacts'))
    {
        ContactsArray = JSON.parse(localStorage.getItem('Contacts'));
        ReloadContactList(ContactsArray);
    }
//Логика добаления и редактирования контакта
function AddNewContact() {
    createNewContact = true;
    let newContact = {
        id: 0,
        name: '',
        number: [''],
        email: ['']
    }
    OpenContactWindow(newContact);
}
function RemoveContact() {
    ContactsArray.splice(Contact.id, 1);
    localStorage.setItem('Contacts', JSON.stringify(ContactsArray));
    CloseContactWindow();
    ReloadContactList(ContactsArray);
}
function EditContact(id) {
    for (let i = 0; i < ContactsArray.length; i++){
        if (ContactsArray[i].id == id){
            Contact = ContactsArray[i];
            createNewContact = false;
            OpenContactWindow(Contact);
            break;
        }
    }
}
function SaveContact() {

    let inputName = document.getElementById('name');
    let numberId0 = document.getElementById('number0');
    let emailId0 = document.getElementById('email0');

    SaveInputValue();

        if(inputName.value != '' && numberId0.value != '' && emailId0.value != '')
        {

            for (let i = 0; i < Contact.number.length; i++){
                if (Contact.number[i] == '')
                {
                    Contact.number.splice(i, 1);
                    i--;
                }
            }
            for (let i = 0; i < Contact.email.length; i++){
                if (Contact.email[i] == '')
                {
                    Contact.email.splice(i, 1);
                    i--;
                }
            }
    if (createNewContact) {
        ContactsArray.push(Contact);
    }

    ReloadContactList(ContactsArray)
    localStorage.setItem('Contacts', JSON.stringify(ContactsArray));

    CloseContactWindow();
        }
        else {
    if (numberId0.value == ''){
        numberId0.setAttribute('placeholder', 'Enter phone number');
    }
    if (emailId0.value == '') {
        emailId0.setAttribute('placeholder', 'Enter e-mail address')
    }
    if (inputName.value == ''){
        inputName.setAttribute('placeholder', 'Enter contact name')
    }
}
}
function SaveInputValue() {
    Contact.name = $('#name').val();
    for(let z = 0; z < Contact.number.length; z++){
        Contact.number[z] = $('#number' + z).val();
    }
    for(let y = 0; y < Contact.email.length; y++){
        Contact.email[y] = $('#email' + y).val();
    }
}
//Логика переключения между списком контактов и формой добавления/редактирования контакта
function OpenContactWindow(contact) {

    Contact = contact;
$('#contact-list, #header').hide();
$ ('#add-contact').css('display', 'flex');

    AddContactDrow();

}
function CloseContactWindow() {

    $('#contact-list, #header').css('display', 'flex');
    $('#add-contact').hide();

    ContactsArray = JSON.parse(localStorage.getItem('Contacts'));

    ResetAddContactWindow();
    ReloadContactList(ContactsArray);
}
function ResetAddContactWindow() {
    SaveInputValue();
    $('input').each(function () {
        $(this).val('');
    });

    $('#add-contact').empty();

}
function ReloadContactList(currentArray) {

    $('#contact-list').empty();

    if (currentArray != null){
        currentArray.sort(function (x, y) {
        if (x.name > y.name)
            return 1;
        if (x.name < y.name)
            return -1;
        return 0;
    })};

    if (currentArray != ContactsArray) {
        for (let i = 0; i < currentArray.length; i++) {
            ContactListDraw(currentArray[i]);
        }
    } else {
        for (let i = 0; i < ContactsArray.length; i++) {
            ContactsArray[i].id = i;
            ContactListDraw(currentArray[i]);
        }
    }
}
//Отрисовка формы добавления и редактирования контакта
function AddContactDrow() {

    $('#add-contact').append($('<div/>', {
        class: 'text',
        id: 'headerdiv'+Contact.id
    }));

    if (createNewContact) {
        $('<h2/>', {
            text: 'Add Contact'
        }).appendTo('#headerdiv' +Contact.id);
    }else {
        $('<h2/>', {
            text: 'Edit Contact',
        }).appendTo('#headerdiv' +Contact.id),
            $('<div/>', {
            id: 'removecontact',
            text: 'Remove Contact',
                on: {
                click: function ()
                {
                    RemoveContact();
                }
                    }
        }).appendTo('#add-contact');
    }

    for (element in Contact) {
        if (element == 'name') {

            $('<div/>', {
                class: 'search'
            }).appendTo('#add-contact').append($('<span/>', {
                text: 'Name'
            }), $('<input/>', {
                id: 'name',
                val: Contact.name,
                on: {
                    input: function () {
                        let matchValue = /^[a-zA-Z\s]*$/;
                        if (!this.value.match(matchValue) || this.value.length > 22)
                        {
                            this.value = this.value.substr(0, this.value.length - 1);
                        }
                    }
                }
            }));
        }
        if (element == 'number') {
            for (let l = 0; l < Contact.number.length; l++) {

                $('<div/>', {
                  class: 'search plus-minus-fields',
                    id: 'phone-number-div'
                }).append($('<div/>', {
                    class: 'button-minus-phone',
                    id: l,
                    text: '-',
                    on: {
                        click: function () {
                            if (this.id != 0) {
                                $(this).parent().remove();
                                Contact.number.splice(l, 1);
                            }
                        }
                }}), $('<div/>').append(($('<span/>', {
                    text: 'Phone Number'
                })), $('<input/>', {
                    id: 'number' + l,
                    on: {
                        input: function ()
                        {
                            if (isNaN(this.value+1) || this.value.length > 10)
                            {
                                this.value = this.value.substr(0, this.value.length - 1);
                            }
                        }
                    },
                    val: Contact.number[l]
                })), $('<div/>', {
                    class: 'button-plus-phone',
                    text: '+',
                    on: {
                        click: function () {
                            AddNumber();
                        }
                    }
                })).appendTo('#add-contact');
            }
        }
        if (element == 'email') {
            for (let h = 0; h < Contact.email.length; h++) {

                $('<div/>', {
                    class: 'search plus-minus-fields',
                    id: 'email-div'
                }).append($('<div/>', {
                    class: 'button-minus-email',
                    id: h,
                    text: '-',
                    on: {
                        click: function () {
                            if (this.id != 0) {
                                $(this).parent().remove();
                                Contact.email.splice(h, 1);
                            }
                        }
                    }
                }), $('<div/>').append(($('<span/>', {
                    text: 'E-mail Address'
                })), $('<input/>', {
                    id: 'email' + h,
                    on: {
                        input: function ()
                        {
                            let matchValue = /^[a-z0-9@._]*$/;
                            if (!this.value.match(matchValue) || this.value.length > 25)
                            {
                                this.value = this.value.substr(0, this.value.length - 1);
                            }
                        }
                    },
                    val: Contact.email[h]
                })), $('<div/>', {
                    class: 'button-plus-email',
                    text: '+',
                    on: {
                        click: function () {
                            AddMail();
                        }
                    }
                })).appendTo('#add-contact');
            }
        }
    }

    $('<div/>', {
        class: 'search buttons'
    }).append($('<div/>', {
        id: 'save-contact',
        text: 'Ok',
        on: {
            click: function () {
                SaveContact();
            }
        }
    }), $('<div/>', {
        id: 'reset-change',
        text: 'Cancel',
        on: {
            click: function () {
                CloseContactWindow();
            }
        }
    })).appendTo('#add-contact');


}
function AddNumber() {
    Contact.number[Contact.number.length] = '';
    ResetAddContactWindow();
    OpenContactWindow(Contact);
}
function AddMail() {
    Contact.email[Contact.email.length] = '';
    ResetAddContactWindow();
    OpenContactWindow(Contact);
}
//Отрисовка списка контактов
function ContactListDraw(contact) {

    $('#contact-list').append($('<div/>', {
        class: 'list',
    }).append($('<div/>', {
        class: 'logo',
        id: 'logo' + contact.id,
        on: {
            click: function () {
                EditContact(contact.id);
            }
        }
    }).append($('<span/>', {
        class: 'logospan',
        id: contact.id,
        text: 'Z'
    })), $('<div/>', {
        class: 'contactdata'
    }).append($('<div/>', {
        class: 'name',
        text: contact.name
    }), $('<div/>', {
        class: 'phone',
        text: contact.number[0]
    }), $('<div/>', {
        class: 'email',
        text: contact.email[0]
        })
    )));
}