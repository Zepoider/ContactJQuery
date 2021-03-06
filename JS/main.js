//Объявление общедоступных переменных
let ContactsArray = [];
let Contact;
let createNewContact = true;
let SearchArray = [];
let emailValidation = /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/img;
//Блок событий при отображении списка контактов
$('#add-contact-button').click(function () {
    $('#header').animate({opacity: 0});
    $('#contact-list').animate({opacity: 0}, function () {
        AddNewContact();
    });
});
$('#inputsearch').on( {
        input: function () {
            SearchArray.length = 0;
            let matchValue = /^[a-zA-Z\s]*$/;
            if (!this.value.match(matchValue) || this.value.length > 22) {
                this.value = this.value.substr(0, this.value.length - 1);
            }

            for (let i = 0; i < ContactsArray.length; i++) {
                if (ContactsArray[i].name.toLowerCase().indexOf(this.value.toLowerCase()) == 0) {
                    SearchArray.push(ContactsArray[i]);
                }
            }
            ReloadContactList(SearchArray);
        }
});


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

    let inputName = $('#name');
    let numberId0 = $('#number0');
    let emailId0 = $('#email0');

        if(inputName.val() != '' && numberId0.val() != '' && emailId0.val() != '')
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
            for (let i = 0; i < Contact.email.length; i++){
                if (!$('#email'+i).val().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
                {
                    $('#email'+i).css('color', '#FF0C0E');
                    return;
                }
            }
    if (createNewContact) {
        ContactsArray.push(Contact);
    }

            ReloadContactList(ContactsArray);
    localStorage.setItem('Contacts', JSON.stringify(ContactsArray));

    CloseContactWindow();
        }
        else {
    if (numberId0.val() == ''){
        numberId0.attr('placeholder', 'Enter phone number');
    }
    if (emailId0.val() == '') {
        emailId0.attr('placeholder', 'Enter e-mail address');
    }
    if (inputName.val() == ''){
        inputName.attr('placeholder', 'Enter contact name');
    }
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
    $('#contact-list, #header').animate({opacity: 1});
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
                        }else {
                            Contact.name = this.value;
                        }
                    }
                }
            }));
        }
        if (element == 'number') {
            for (let l = 0; l < Contact.number.length; l++) {

                $('<div/>', {
                  class: 'search plus-minus-fields',
                    id: 'phone-number-div',
                    on: {
                      mouseenter: function () {
                          $(this).children('.button-plus-phone, .button-minus-phone').show(300);
                      },
                      mouseleave: function () {
                          $(this).children('.button-plus-phone, .button-minus-phone').hide(300);
                      }
                    }
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
                }}).hide(), $('<div/>').append(($('<span/>', {
                    text: 'Phone Number'
                })), $('<input/>', {
                    id: 'number' + l,
                    on: {
                        input: function ()
                        {
                            if (isNaN(this.value+1) || this.value.length > 10)
                            {
                                this.value = this.value.substr(0, this.value.length - 1);
                            }else {
                                Contact.number[l] = this.value;
                            }
                        }
                    },
                    val: Contact.number[l]
                })), $('<div/>', {
                    class: 'button-plus-phone',
                    text: '+',
                    on: {
                        click: function () {
                            Contact.number.push('');
                            ResetAddContactWindow();
                            OpenContactWindow(Contact);
                        }
                    }
                }).hide()).appendTo('#add-contact');
            }
        }
        if (element == 'email') {
            for (let h = 0; h < Contact.email.length; h++) {

                $('<div/>', {
                    class: 'search plus-minus-fields',
                    id: 'email-div',
                    on: {
                        mouseenter: function () {
                            $(this).children('.button-plus-email, .button-minus-email').show(300);
                        },
                        mouseleave: function () {
                            $(this).children('.button-plus-email, .button-minus-email').hide(300);
                        }
                    }
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
                }).hide(), $('<div/>').append(($('<span/>', {
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
                            }else {
                                Contact.email[h] = this.value;
                            }
                        }
                    },
                    val: Contact.email[h]
                })), $('<div/>', {
                    class: 'button-plus-email',
                    text: '+',
                    on: {
                        click: function () {
                            Contact.email[Contact.email.length] = '';
                            ResetAddContactWindow();
                            OpenContactWindow(Contact);
                        }
                    }
                }).hide()).appendTo('#add-contact');
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
//Отрисовка списка контактов
function ContactListDraw(contact) {

    $('#contact-list').append($('<div/>', {
        class: 'list',
    }).append($('<div/>', {
        class: 'logo',
        id: 'logo' + contact.id,
        on: {
            click: function () {
                $('#header').animate({opacity: 0});
                $('#contact-list').animate({opacity: 0}, function () {
                    EditContact(contact.id);
                });
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