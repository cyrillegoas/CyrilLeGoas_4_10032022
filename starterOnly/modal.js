const modalBtn = document.querySelectorAll('.modal-btn');

// Toggle nav menu
function editNav() {
  const x = document.getElementById('myTopnav');
  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
}
const closeNavButton = document.querySelector('.toggle-nav');
closeNavButton.addEventListener('click', editNav);

// Modal
function ModalForm(modal) {
  if (!(modal instanceof Element)) {
    throw new Error('No modal found!');
  }
  this.modal = modal;
  const closeModalButton = modal.querySelector('.close');
  const validationButton = modal.querySelector('.btn-submit');

  // Event Listener
  closeModalButton.addEventListener('click', () => this.closeModal());
  validationButton.addEventListener('click', (event) =>
    this.validateForm(event)
  );
}

ModalForm.prototype.closeModal = function () {
  this.modal.classList.remove('open');
};

ModalForm.prototype.openModal = function () {
  this.modal.classList.add('open');
};

ModalForm.prototype.validateForm = function (event) {
  const inputWrappers = Array.from(this.modal.querySelectorAll('.formData'));
  const tests = {
    name: {
      errorMessage: 'Doit contenir un minimun de 2 charactères',
      inputValidator(inputWrapper) {
        const regex = /^([^0-9.,"?!;:#$%&()*+/<>=@[\]^_{}|~ ]){3,}$/g;
        return regex.test(inputWrapper.querySelector('input').value);
      },
    },
    email: {
      errorMessage: 'Doit être une addresse email valide',
      inputValidator(inputWrapper) {
        const regex =
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
        return regex.test(inputWrapper.querySelector('input').value);
      },
    },
    date: {
      errorMessage: 'Doit être au format jj/mm/aaaa',
      inputValidator(inputWrapper) {
        const regex =
          /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/g;
        return regex.test(inputWrapper.querySelector('input').value);
      },
    },
    number: {
      errorMessage: 'Doit être un nombre supérieur ou égale 0',
      inputValidator(inputWrapper) {
        const regex = /^[0-9]+$/g;
        return regex.test(inputWrapper.querySelector('input').value);
      },
    },
    radio: {
      errorMessage: 'Doit être sélectionné',
      inputValidator(inputWrapper) {
        return Array.from(inputWrapper.querySelectorAll('input')).some(
          (input) => input.checked
        );
      },
    },
    checkboxTerms: {
      errorMessage: "Les conditions d'utilisation doivent être acceptées",
      inputValidator(inputWrapper) {
        return inputWrapper.querySelector('input').checked;
      },
    },
    checkboxSingle: {
      errorMessage: 'Doit être sélectionné',
      inputValidator(inputWrapper) {
        return inputWrapper.querySelector('input').checked;
      },
    },
  };

  const isValid = inputWrappers.reduce((isvalid, inputWrapper) => {
    const testType = inputWrapper.dataset.type;
    const testResults = tests[`${testType}`].inputValidator(inputWrapper);
    if (!testResults) {
      inputWrapper.dataset.error = tests[`${testType}`].errorMessage;
      inputWrapper.dataset.errorVisible = 'true';
    }
    return isvalid && testResults;
  }, true);
  if (!isValid) event.preventDefault();
};

const modal = new ModalForm(document.querySelector('.modal'));

modalBtn.forEach((btn) =>
  btn.addEventListener('click', () => modal.openModal())
);
