const modalBtn = document.querySelectorAll('.modal-btn');

// toggle nav menu
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

  // Event Listener
  closeModalButton.addEventListener('click', () => this.closeModal());
}

ModalForm.prototype.closeModal = function () {
  this.modal.classList.remove('open');
};
ModalForm.prototype.openModal = function () {
  this.modal.classList.add('open');
};

const modal = new ModalForm(document.querySelector('.modal'));

modalBtn.forEach((btn) =>
  btn.addEventListener('click', () => modal.openModal())
);
