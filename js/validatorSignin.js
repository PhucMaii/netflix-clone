function Validator(options) {
    const formElement = document.querySelector(options.form);
    
    options.rule.forEach((rule) => {
        const inputElement = document.querySelector(rule.selector);
        
        if(inputElement) {
            inputElement.onblur = function () {
                
                const errorMessage = rule.test(inputElement.value);
                const errorElement = inputElement.parentElement.querySelector(options.errorElement);
                
                if(errorMessage) {
                    errorElement.innerText = errorMessage;
                    inputElement.parentElement.classList.add('invalid');
                } else {
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');

                }
                
            }
        }
        
    })

}

Validator.isEmail = function(selector) {
    return {
        selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Invalid Email"   
        }
    }
}

Validator.isPassword = (selector, min) => {
    return {
        selector,
        test: function (value) {
            return value.length >= min ? undefined : `Password must be at least ${min} characters`
        }
    }
}

Validator({
    form: '#loginForm',
    errorElement: '.form-message',
    rule: [
        Validator.isEmail('#email'),
        Validator.isPassword('#password',5),
    ]


})