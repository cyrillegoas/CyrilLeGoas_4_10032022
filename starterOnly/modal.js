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
  const form = modal.querySelector('form');
  const closeModalButton = modal.querySelector('.close');
  const inputs = modal.querySelectorAll('.formData input');
  const checkboxTermsLabels = modal.querySelectorAll(
    '[data-type="checkboxTerms"] label'
  );
  const checkboxSingleLabels = modal.querySelectorAll(
    '[data-type="checkboxSingle"] label'
  );
  const radioLabels = modal.querySelectorAll('[data-type="radio"] label');

  // Event Listener
  closeModalButton.addEventListener('click', () => this.closeModal());
  form.addEventListener('submit', (event) => this.validateForm(event));
  inputs.forEach((input) =>
    input.addEventListener('focus', (event) => this.clearError(event))
  );
  [...checkboxTermsLabels, ...checkboxSingleLabels, ...radioLabels].forEach(
    (label) =>
      label.addEventListener('click', (event) => this.clearError(event))
  );
}

ModalForm.prototype.closeModal = function () {
  this.modal.classList.remove('open');
};

ModalForm.prototype.openModal = function () {
  this.modal.classList.add('open');
};

ModalForm.prototype.successMessage = function () {
  const modalBody = this.modal.querySelector('.modal-body');
  const modalBodyHeight = modalBody.clientHeight;
  modalBody.nextElementSibling.style.height = `${modalBodyHeight}px`;
  modalBody.classList.add('hidden');
  this.modal.querySelector('.btn-close-success').addEventListener(
    'click',
    () => {
      this.closeModal();
      modalBody.classList.remove('hidden');
    },
    { once: true }
  );
};

ModalForm.prototype.tests = {
  name: {
    errorMessage: 'Doit contenir un minimun de 2 charactères',
    regex: /^([^0-9.,"?!;:#$%&()*+/<>=@[\]^_{}|~ ]){2,}$/,
  },
  email: {
    errorMessage: 'Doit être une addresse email valide',
    regex:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  date: {
    errorMessage: 'Doit être au format jj/mm/aaaa',
    regex: /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/,
  },
  number: {
    errorMessage: 'Doit être un nombre supérieur ou égale 0',
    regex: /^[0-9]+$/,
  },
  radio: {
    errorMessage: 'Doit être sélectionné',
  },
  checkboxTerms: {
    errorMessage: "Les conditions d'utilisation doivent être acceptées",
  },
  checkboxSingle: {
    errorMessage: 'Doit être sélectionné',
  },
};

ModalForm.prototype.validateForm = function (event) {
  const inputWrappers = Array.from(this.modal.querySelectorAll('.formData'));
  event.preventDefault();
  const isValid = inputWrappers.reduce((isvalid, inputWrapper) => {
    const testType = inputWrapper.dataset.type;
    const formInput = inputWrapper.querySelector('input');
    let testResults;
    switch (testType) {
      case 'checkboxSingle': // fall through
      case 'checkboxTerms':
        testResults = formInput.checked;
        testResults =
          testResults || (!testResults && !inputWrapper.dataset.required);
        break;
      case 'radio':
        testResults = Array.from(inputWrapper.querySelectorAll('input')).some(
          (input) => input.checked
        );
        testResults =
          testResults || (!testResults && !inputWrapper.dataset.required);
        break;
      default:
        testResults = this.tests[`${testType}`].regex.test(formInput.value);
        testResults =
          testResults ||
          (!formInput.value.length && !inputWrapper.dataset.required);
        break;
    }
    if (!testResults) {
      inputWrapper.dataset.error = this.tests[`${testType}`].errorMessage;
      inputWrapper.dataset.errorVisible = 'true';
    }
    return isvalid && testResults;
  }, true);

  if (isValid) {
    this.successMessage();
  }
};

ModalForm.prototype.clearError = function (event) {
  event.currentTarget.parentElement.removeAttribute('data-error');
  event.currentTarget.parentElement.removeAttribute('data-error-visible');
};

const modal = new ModalForm(document.querySelector('.modal'));

modalBtn.forEach((btn) =>
  btn.addEventListener('click', () => modal.openModal())
);
