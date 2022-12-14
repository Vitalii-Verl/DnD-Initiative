let units = [];

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("units"));
}
function setLocalStorage() {
  localStorage.setItem("units", JSON.stringify(units));
}
function startLocalStorage() {
  if (getLocalStorage() == null) setLocalStorage();
  units = getLocalStorage();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function templateHead(data, i) {
  let mark = ``;
  return `
  <li class="ch" id="${data[i].id}">
    <div class="ch__top">
      <div class="ch__name">${data[i].name}</div>
      <div class="ch__info">
        <span class="ch__hp"><b>${data[i].hp ? data[i].hp : ""}</b></span>
        <span class="ch__initiative">${data[i].initiative}</span>
        <span class="ch__delete">X</span>
      </div>
    </div>

    <div class="ch__bottom">
      <div class="ch__marks">${mark}</div>
      <div class="ch__description">${data[i].description ? data[i].description : ""}</div>
    </div>
  </li>
  `;
}

function deleteCh(id) {
  units.splice(id, 1);
  setLocalStorage();
  renderBF();
}

function sortInitiative() {
  units.sort((a, b) => (a.initiative > b.initiative ? -1 : 1));
  
  setLocalStorage();
  renderBF();
}

const battleground = document.querySelector("#battlefield");
function renderBF() {
  battleground.innerHTML = ``;
  for (let i = 0; i < units.length; i++) {
    units[i].id = i;
    battleground.innerHTML += templateHead(units, i);
  }
}

const form_add_ch_one = document.getElementById("form_add_ch_one");
form_add_ch_one.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!form_add_ch_one.name.value) return alert("Ні, без назви діла не буде");

  let temp = {}

  temp.id = units.length;
  temp.name = form_add_ch_one.name.value;
  temp.hp = Number(form_add_ch_one.hp.value);
  temp.initiative =
    Number(form_add_ch_one.initiative.value) +
    Number(form_add_ch_one.modification.value);

  units.push(temp);

  setLocalStorage();
  renderBF();

  form_add_ch_one.name.value = "";
  form_add_ch_one.hp.value = "";
  form_add_ch_one.initiative.value = "";
  form_add_ch_one.modification.value = "";
});

const form_add_ch_some = document.getElementById("form_add_ch_some");
form_add_ch_some.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!form_add_ch_some.name.value) return alert("Ні, без назви діла не буде");
  if (form_add_ch_some.amount.value > 20)
    if (!confirm("Більше 20-и ворогів? Ти з дубу рухнув?")) return;

  for (let i = 0; i < form_add_ch_some.amount.value; i++) {
    let temp = {};
    temp.id = units.length;
    temp.name = form_add_ch_some.name.value;
    temp.hp = form_add_ch_some.hp.value;
    temp.initiative =
      getRandomInt(1, 20) + Number(form_add_ch_some.modification.value);
    units.push(temp);
  }

  setLocalStorage();
  renderBF();

  form_add_ch_some.name.value = "";
  form_add_ch_some.hp.value = "";
  form_add_ch_some.amount.value = "";
  form_add_ch_some.modification.value = "";
});

const b_add_one = document.querySelector("#ch-add-one");
b_add_one.onclick = () => {
  let oneCL = form_add_ch_one.classList;
  let someCL = form_add_ch_some.classList;
  if (oneCL.contains("none")) {
    oneCL.remove("none");
    someCL.add("none");
  } else {
    oneCL.add("none");
  }
};

const b_add_some = document.querySelector("#ch-add-some");
b_add_some.onclick = () => {
  let oneCL = form_add_ch_one.classList;
  let someCL = form_add_ch_some.classList;
  if (someCL.contains("none")) {
    someCL.remove("none");
    oneCL.add("none");
  } else {
    someCL.add("none");
  }
};

const app_ch_edit_form = document.getElementById("unitBodyForm");
function formOnfocusout() {
  let form = app_ch_edit_form;
  let id = Number(form.id.value);
  if (id < 0) return;

  let name = form.name.value;
  let initiative = Number(form.initiative.value);
  let hp = Number(form.hp.value);
  let description = form.description.value;
  // let priority = form.priority.value;

  units[id] = {
    name: name,
    initiative: initiative,
    hp: hp,
    description: description,
  }

  setLocalStorage();
  renderBF();
}

battleground.addEventListener("click", (e) => {
  let parentNode = e.target.closest(".ch");
  if (parentNode == null) return;
  let form = app_ch_edit_form;
  let id = Number(parentNode.id);

  if (e.target.classList[0] == "ch__delete") {
    deleteCh(id); // delete character from DB
    parentNode.remove();
    form.classList.add("hidden");
    return;
  } else {
    form.classList.remove("hidden");
  }

  form.id.value = id;
  form.name.value = units[id].name;
  form.initiative.value = units[id].initiative;
  form.hp.value = units[id].hp;
  if(units[id].description != undefined){
    form.description.value = units[id].description;
  } else {
    form.description.value = "";
  }
});

const k20 = document.querySelector("#k20");
k20.onclick = () => {
  form_add_ch_one.initiative.value = getRandomInt(1, 20);
};

startLocalStorage();
renderBF();
