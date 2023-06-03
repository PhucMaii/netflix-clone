
function Validator(options) {

    // Container to save all the rules that will happen
    var selectorRule = {};
    
    // Handle Validation
    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        // Get selector rules array
        var rules = selectorRule[rule.selector];

        // Loop through rules array and let it run each of them at each time
        for(var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove('invalid');

        }
        return !errorMessage;
    }

    // Get form element
    var formElement = document.querySelector(options.form);

    if (formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;

            // Loop through each rule and validate all of them 
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);

                if(!isValid) {
                    isFormValid = false
                }
            })
          
           


            if(isFormValid) {
                if(typeof options.onSubmit == 'function') {

                    // Get all input element has name attribute as a nodelist
                    var enableInputs = formElement.querySelectorAll('[name]');

                    // Convert nodelist into array and use reduce to get an object of values
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        values[input.name] = input.value
                        return values;
                    }, {})

                    options.onSubmit(formValues);
                }
            }
        }


        // Loop through each rule and handle events
        options.rules.forEach(function (rule) {

            // Save rules for each input
            if(Array.isArray(selectorRule[rule.selector])) {
                selectorRule[rule.selector].push(rule.test);

            } else {
                selectorRule[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }
            }

            // Remove the invalid color whenever it's oninput
            inputElement.oninput = function () {
                var errorElement = inputElement.parentElement.querySelector('.form-message')
                errorElement.innerText = "";
                inputElement.parentElement.classList.remove('invalid');
            }
        })

    }

}

Validator.isRequired = function (selector, message) { // message parameter is not required
    return {
        selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Please type your name' // .trim() to remove all white space
        }
    };
}

Validator.isEmail = function (selector,message) {
    return {
        selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || "Invalid Email"; 
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Please enter at least ${min} characters`;
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Invalid Password';

        }
    }
}


Validator({
    form: '#form1',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#username'),
        Validator.isRequired('#email'),
        Validator.isEmail('#email'),
        Validator.minLength('#password', 5),
        Validator.isRequired('#confirmPassword', 'Please confirm your password'),
        Validator.isConfirmed('#confirmPassword', function () {
            return document.querySelector('#form1 #password').value;
        }, "Confirm password doesn't match")

    ],
    onSubmit: function(data) {
        // Call API
        console.log(data)
    }
})