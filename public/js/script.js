// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      
      // Check all text inputs + textareas
      form.querySelectorAll("input[type=text], textarea").forEach((field) => {
          if (field.value.trim() === "") {
            field.setCustomValidity("This field cannot be empty or spaces only");
          }
          else {
            field.setCustomValidity(""); // reset
          }
      });

      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
