// Imports your SCSS stylesheet
import './styles/index.scss';
import cars from './data/car-dataset.json';

function getUniqueValues(key) {
  return [...new Set(cars.map((car) => car[key]))];
}

function populateDropdown(selectId, placeholderText, values) {
  const select = document.querySelector(selectId);

  if (!select) {
    return;
  }

  select.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = placeholderText;
  select.appendChild(placeholder);

  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function closeCustomDropdowns() {
  document.querySelectorAll('.custom-select.is-open').forEach((dropdown) => {
    dropdown.classList.remove('is-open');
    dropdown.closest('fieldset')?.classList.remove('is-active');
    dropdown.querySelector('.custom-select-button').setAttribute('aria-expanded', 'false');
  });
}

function updateFieldsetState(select) {
  select.closest('fieldset')?.classList.toggle('has-value', Boolean(select.value));
}

function setupCustomDropdown(select) {
  const existingDropdown = select.nextElementSibling;

  if (existingDropdown && existingDropdown.classList.contains('custom-select')) {
    existingDropdown.remove();
  }

  select.classList.add('native-select');

  const dropdown = document.createElement('div');
  const button = document.createElement('button');
  const menu = document.createElement('ul');

  dropdown.className = 'custom-select';
  button.className = 'custom-select-button';
  button.type = 'button';
  button.textContent = select.options[select.selectedIndex].textContent;
  button.setAttribute('aria-expanded', 'false');
  menu.className = 'custom-select-menu';

  Array.from(select.options).forEach((selectOption) => {
    const option = document.createElement('li');
    option.className = 'custom-select-option';
    option.textContent = selectOption.textContent;
    option.dataset.value = selectOption.value;

    if (selectOption.selected) {
      option.classList.add('is-selected');
    }

    option.addEventListener('click', () => {
      select.value = selectOption.value;
      button.textContent = selectOption.textContent;
      updateFieldsetState(select);

      menu.querySelectorAll('.custom-select-option').forEach((item) => {
        item.classList.toggle('is-selected', item === option);
      });

      select.dispatchEvent(new Event('change', { bubbles: true }));
      closeCustomDropdowns();
    });

    menu.appendChild(option);
  });

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.contains('is-open');
    closeCustomDropdowns();

    if (!isOpen) {
      dropdown.classList.add('is-open');
      select.closest('fieldset')?.classList.add('is-active');
      button.setAttribute('aria-expanded', 'true');
    }
  });

  dropdown.append(button, menu);
  select.after(dropdown);
  updateFieldsetState(select);
}

function setupDropdowns() {
  const years = getUniqueValues('year').sort((a, b) => b - a);
  const makes = getUniqueValues('Manufacturer').sort();
  const models = getUniqueValues('model').sort();

  populateDropdown('#year-select', 'Vehicle Year', years);
  populateDropdown('#make-select', 'Vehicle Make', makes);
  populateDropdown('#model-select', 'Vehicle Model', models);

  document.querySelectorAll('select').forEach(setupCustomDropdown);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupDropdowns);
} else {
  setupDropdowns();
}

document.addEventListener('click', closeCustomDropdowns);
