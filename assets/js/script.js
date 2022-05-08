"use strict"

const Validator = (options) => {
    const formElement = document.querySelector(options.form);

    const getParent = (element, selector) => {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    };

    const validate = (value, rule, inputElement) => {
        const messageInput = rule.test(value); 
        const messageElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        if (messageInput === false) {
            inputElement.classList.add('input-err');
            messageElement.style.display = "block";
            messageElement.classList.add('message-err'); 
            inputElement.classList.remove('input-success');
        } else {
            inputElement.classList.add('input-success');
            inputElement.classList.remove('input-err');
            messageElement.style.display = "none";
        }
        return messageInput;
    };

    if (formElement) {
        // submit form
        formElement.addEventListener('submit', (e) => { 
            e.preventDefault();
            let isFormValidate = true;
            options.rules.forEach((rule) => {
                let inputElement = formElement.querySelector(rule.selector);
                let newValidate = validate(inputElement.value, rule, inputElement);
                if (inputElement)
                    newValidate;
                if (newValidate === false) {
                    isFormValidate = false;
                }
            });

            if (isFormValidate === true) {
                if (typeof options.onSubmit === 'function') {
                    const enabelInputs = formElement.querySelectorAll('[name]');
                    const formValues = Array.from(enabelInputs).reduce((value, item) => {
                        value[item.name] = item.value;
                        return value;
                    }, {});
                    options.onSubmit(formValues);
                }
            }
        });

        options.rules.forEach((rule) => {
            let inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.addEventListener("blur", (e) => {
                    validate(inputElement.value, rule, inputElement);
                });
                inputElement.addEventListener("input", (e) => {
                    validate(inputElement.value, rule, inputElement);
                });
            }
        })
    }
};

Validator.isRequest = (selector) => {
    return {
        selector : selector,
        test: (value) => { 
            return value.trim() ? true : false;
        }
    };
};

Validator.isEmail = (selector) => {
    return {
        selector: selector,
        test: (value) => {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? true : false;
        }
    };
};

Validator.minLength = (selector, min) => {
    return {
        selector : selector,
        test: (value) => { 
            return value.trim() && value.length >= min ? true : false;
        }
    };
};

// Validator.isConfirmed = (selector, getConfirmValule) => {
//     return {
//         selector: selector,
//         test: (value) => {
//             return value.trim() && value === getConfirmValule() ? true : false;
//         }
//     };
// };

Validator({
    form: "#contact__form",
    errorSelector: '.form-message', 
    formGroupSelector: '.form__control',
    rules: [
        Validator.isRequest("#name"),
        Validator.minLength("#email", 12),
        Validator.isEmail("#email"),
        Validator.minLength("#password", 6),
        // Validator.isConfirmed("#repeat-password", () => {
        //    return document.querySelector("#contact__form #password").value ; 
        // }),
        Validator.isRequest("#phone"),
        Validator.isRequest("#date"),
        Validator.isRequest("#gender"),
    ],
    onSubmit: (date) => {
        console.log(date);
    }
});