//* Cms -> Content Management System
let data = {
  users: [],
  products: [],
};

let themeWeb = 1;
let page = 1;
let perPage = 5;

const toggleMenu = document.querySelector(".toggle-sidebar");
const themeButton = document.querySelector(".theme-button");
const modalScreen = document.querySelector(".modal-screen");
const closeModalBtn = document.querySelector(".close-modal");
const cancelBtn = document.querySelector(".cancel");
const modalContent = document.querySelector(".modal-content");
const contentIndex = document.querySelector(".content-index");
const contentProduct = document.querySelector(".content-product");
const contentUser = document.querySelector(".content-user");
const contentMain = document.querySelectorAll(".contentMain");
const submitBtn = document.querySelector(".submit");
const modalContentInput = document.querySelectorAll(".modal-content input");
const modalHeader = document.querySelector(".modal-header h3");
const bodyProduct = document.querySelector(".body-product");
const bodyUser = document.querySelector(".body-user")
const countProductElem = document.querySelectorAll(".count-product");
const countUserElem = document.querySelectorAll(".count-user");
const toastElem = document.querySelector(".toast");
const toastContent = document.querySelector(".toast-content");
const processElem = document.querySelector(".process");
const navLinkElem = document.querySelectorAll(".navlink");
const navLinkProductElem = document.querySelector(".nav-link-product");
const navLinkUserElem = document.querySelector(".nav-link-user");
const bodyProductIndex = document.querySelector(".body-product-index");
const bodyUserIndex = document.querySelector(".body-user-index")

// open and close sidebar
toggleMenu.addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("open");
});

// change nave page to prodauct From the button on the main page
navLinkProductElem.addEventListener('click', function () {
  const targetItem = navLinkElem[1];
  targetItem.click();
});

// change nave page to user From the button on the main page
navLinkUserElem.addEventListener('click', function () {
  const targetItem = navLinkElem[2];
  targetItem.click();
});

// change nave page product and user in sidebar
navLinkElem.forEach(function (elem) {
  elem.addEventListener("click", function () {
    navLinkElem.forEach(function (item) {
      item.classList.remove("active");
    });
    contentMain.forEach(function (item) {
      const itemContent = item.dataset.content;
      const elemContent = elem.dataset.content;
      item.classList.add("hidden");
      if (itemContent === elemContent) {
        item.classList.remove("hidden");
      };
    });
    elem.classList.add("active");
  });
});

// set information data to local
function setInformationToLocal() {
  localStorage.setItem("data", JSON.stringify(data));
}

// get information and theme web from local and Passing information to data and set functions
function getInformationFromLocal() {
  const getData = JSON.parse(localStorage.getItem("data"));
  if (getData) {
    data = getData;
  }

  showInformation(data.users, "user" , "notMain");
  showInformation(data.products, "product" , "notMain");
  showInformation(data.products, "product" , "main");
  showInformation(data.users, "user" , "main");
  countProduct();
  generatePagination(data.products, "product");
  generatePagination(data.users, "user");

  const themeWebElem = localStorage.getItem("theme");
  if (themeWebElem === "dark") {
    themeWeb = 1;
  } else {
    themeWeb = 2;
  }
  changeTheme();
}

// Getting and displaying information on the site from data
function showInformation(contentName, content , mainpage) { 
  let startIndex;
  let lastIndex;
  if(mainpage === "main"){
    startIndex = contentName.length - 4;
    lastIndex = contentName.length;
  }else{
    startIndex = (page - 1) * perPage;
    lastIndex = startIndex + perPage;
  }

  const shownItems = contentName.slice(startIndex, lastIndex);
  let body;
  let contentNon;
  let insertHtml;
  if (content === "product" && mainpage === "notMain") {
    body = bodyProduct;
    contentNon = "محصولی"
    insertHtml = "beforeend"
  } else if(content === "user" && mainpage === "notMain") {
    body = bodyUser;
    contentNon = "کاربری"
    insertHtml = "beforeend"
  } else if(content === "product" && mainpage === "main") {
    body = bodyProductIndex;
    contentNon = "محصولی"
    insertHtml = "afterbegin"
  }else {
    body = bodyUserIndex;
    contentNon = "کاربری"
    insertHtml = "afterbegin"
  }

  body.innerHTML = "";
  if (shownItems.length) {
    shownItems.forEach(function (item) {
      body.insertAdjacentHTML(`${insertHtml}`, 
        `
        ${
          content === "user" && mainpage === "main" ? 
          `
              <article>
                <span class="icon-card">
                  <i class="fa-solid fa-user"></i>
                </span>
                <div>
                  <p class="user-name">${item.name}</p>
                  <p class="user-email">${item.email}</p>
                </div>
              </article>
          ` : 
          `
          <div class="tableRow">
                <p class="content-title-or-name">${
                  content === "product" ? `${item.title}` : `${item.name}`
                }</p>
                <p class="content-price-or-userName">${
                  content === "product" ? `${item.price}` : `${item.username}`
                }</p>
                <p class="content-shortName-or-email">${
                  content === "product" ? `${item.slug}` : `${item.email}`
                }</p>
                ${
                  content === "user" ? `<p class="content-password">${item.password}</p>` : ``
                }
                <div class="product-manage">
                  <button class="edit-btn" onclick="editContent(${item.id} , '${content}')">
                    <!-- Edit icon -->
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="remove-btn" onclick="removeProductBtn(${item.id} , '${content}')">
                    <!-- Delete fas icon -->
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
          `
        }
        `
      )
    });
  } else {
    body.insertAdjacentHTML("beforeend",
      `
      <div class="content-non">هیچ ${contentNon} وجود ندارد</div>
      `
    )
  }
}

// Set information for each section all in one medal 
function modalContentFunc(content) {
  let contentInput1;
  let contentInput2;
  let contentInput3;
  let contentHeader;
  let type;

  if (content === "product") {
    contentInput1 = "عنوان محصول";
    contentInput2 = "قیمت محصول";
    contentInput3 = "عنوان کوتاه محصول";
    contentHeader = "محصول جدید";
    type = "number"
  } else {
    contentInput1 = "نام و نام خانوادگی کاربر"
    contentInput2 = "نام کاربری";
    contentInput3 = "آدرس ایمیل کاربر";
    contentHeader = "کاربر جدید"
    type = "text";
  }
  modalContent.innerHTML = "";
  modalContent.insertAdjacentHTML("beforeend",
    `
            <input
              type="text"
              class="modal-input"
              placeholder="${contentInput1} را وارد نمائید ..."
              id="content-title-or-name"
            />
            <input
              type="${type}"
              class="modal-input"
              placeholder="${contentInput2} را وارد نمائید ..."
              id="content-price-or-user"
            />
            <input
              type="text"
              class="modal-input"
              placeholder="${contentInput3} را وارد نمائید ..."
              id="content-shortName-or-email"
            />
            ${
              content === "user" ? ` <input
              type="text"
              class="modal-input"
              placeholder="کذرواژه کاربر را وارد نمائید ..."
              id="content-password"
            />` : ``
            }
            <div class="red-alert failed hidden">
              <span class="icon-card">
                <span class="icon"></span>
              </span>
              <p>لطفا تمام گزینه ها را وارد کنید</p>
            </div>
    `
  );
  submitBtn.setAttribute("onclick", `contentSub("${content}")`);
  modalHeader.innerHTML = contentHeader;
  showModal();
}

// get information from modal and push to data relative to each section
function contentSub(content) {
  const contentTitleOrName = document.getElementById("content-title-or-name");
  const contentPriceOrUser = document.getElementById("content-price-or-user");
  const contentShortNameOrEmail = document.getElementById("content-shortName-or-email");
  const contentPassword = document.getElementById("content-password");
  const redAlert = document.querySelector(".red-alert");
  const randomId = Math.floor(Math.random() * 10000);

  let contentSample;
  let contentData;
  let toastTitle;
  if (content === "product") {
    contentSample = {
      id: randomId,
      title: contentTitleOrName.value,
      price: contentPriceOrUser.value,
      slug: contentShortNameOrEmail.value,
    }
    contentData = data.products;
    toastTitle = "محصول"
  } else {
    contentSample = {
      id: randomId,
      name: contentTitleOrName.value,
      username: contentPriceOrUser.value,
      email: contentShortNameOrEmail.value,
      password: contentPassword.value,
    }
    contentData = data.users;
    toastTitle = "کاربر"
  }
  if (contentTitleOrName.value.length && contentPriceOrUser.value.length && contentShortNameOrEmail.value.length && (content !== "user" || (content === "user" && contentPassword.value.length))) {
    contentData.push(contentSample);
    closeModal();
    setInformationToLocal();
    showInformation(data.users, "user" , "notMain");
    showInformation(data.products, "product" , "notMain");
    showInformation(data.products, "product" , "main");
    showInformation(data.users, "user" , "main");
    
    countProduct();
    toastContent.innerHTML = `${toastTitle} با موفقیت ثبت شد`;
    toastElem.className = "toast success"
    toastShow();
  } else {
    redAlert.classList.remove("hidden");
  }

  generatePagination(data.products, "product");
  generatePagination(data.users, "user");

}

// show modal because of edit product or user and set information in modal relative to the selected option
function editContent(id, content) {
  let contentName;
  let modalName;
  if (content === "product") {
    contentName = data.products;
    modalName = "ویرایش محصول"
  } else {
    contentName = data.users;
    modalName = "ویرایش کاربر"
  }

  const productIndex = contentName.findIndex(function (item) {
    return item.id === id;
  });

  modalContentFunc(content);
  modalHeader.innerHTML = modalName;
  submitBtn.setAttribute("onclick", `editProductSub(${productIndex} , '${content}')`)
  const contentTitleOrName = document.getElementById("content-title-or-name");
  const contentPriceOrUser = document.getElementById("content-price-or-user");
  const contentShortNameOrEmail = document.getElementById("content-shortName-or-email");
  const contentPassword = document.getElementById("content-password");
  const dataSample = contentName[productIndex];
  if (content === "product") {
    contentTitleOrName.value = dataSample.title;
    contentPriceOrUser.value = dataSample.price;
    contentShortNameOrEmail.value = dataSample.slug;
  }else{
    contentTitleOrName.value = dataSample.name;
    contentPriceOrUser.value = dataSample.username;
    contentShortNameOrEmail.value = dataSample.email;
    contentPassword.value = dataSample.password;
  }
}

// replace information edited from modal to data 
function editProductSub(id , content) {
  const contentTitleOrName = document.getElementById("content-title-or-name");
  const contentPriceOrUser = document.getElementById("content-price-or-user");
  const contentShortNameOrEmail = document.getElementById("content-shortName-or-email");
  const contentPassword = document.getElementById("content-password");
  let toastTitle;
  if(content === "product"){
    const contentName = data.products;
    const dataSample = contentName[id];
    dataSample.title = contentTitleOrName.value;
    dataSample.price = contentPriceOrUser.value;
    dataSample.slug = contentShortNameOrEmail.value;
    toastTitle = "محصول"
  }else{
    const contentName = data.users;
    const dataSample = contentName[id];
    dataSample.name = contentTitleOrName.value;
    dataSample.username = contentPriceOrUser.value;
    dataSample.email = contentShortNameOrEmail.value;
    dataSample.password = contentPassword.value;
    toastTitle = "کاربر"
  }

  closeModal();
  setInformationToLocal();
  showInformation(data.users, "user" , "notMain");
  showInformation(data.products, "product" , "notMain");
  showInformation(data.products, "product" , "main");
  showInformation(data.users, "user" , "main");
  toastContent.innerHTML = `${toastTitle} با موفقیت ویرایش شد`;
  toastElem.className = "toast success"
  toastShow();
};

// Show delete warning modal after pressing the delete button of each
function removeProductBtn(id , content) {
  let modalName;
  if(content === "product"){
    modalName = "محصول";
  }else{
    modalName = "کاربر";
  }
  modalContent.innerHTML = "";
  modalContent.insertAdjacentHTML("beforeend",
    `
      <p class="remove-text">آیا از حذف این ${modalName} اطمینان دارید؟</p>
    `
  );
  submitBtn.setAttribute("onclick", `removeProduct(${id} , "${content}")`);
  modalHeader.innerHTML = `حذف ${modalName}`
  showModal();
}

// delete the information of the selected item from the data
function removeProduct(id , content) {
  let contentName;
  let modalHeader;
  if(content === "product"){
    contentName = data.products;
    modalName = "محصول";
  }else{
    contentName = data.users;
    modalName = "کاربر";
  }
  const contentIndex = contentName.findIndex(function (item) {
    return item.id === id;
  });
  contentName.splice(contentIndex, 1);
  setInformationToLocal();
  showInformation(data.users, "user" , "notMain");
  showInformation(data.products, "product" , "mnotMain");
  showInformation(data.products, "product" , "main");
  showInformation(data.users, "user" , "main");
  generatePagination(data.products, "product");
  generatePagination(data.users, "user");
  countProduct();
  closeModal();
  toastContent.innerHTML = `${modalName} با موفقیت حذف شد`;
  toastElem.className = "toast success"
  toastShow();
}

// Change and show the number of product or user
function countProduct() {
  countProductElem.forEach(function(elem){
    elem.innerHTML = data.products.length;
  });
  countUserElem.forEach(function(elem){
    elem.innerHTML = data.users.length;
  });
}

// change theme web and set to local
function changeTheme() {
  const themeButtonI = themeButton.querySelector("i");
  if (themeWeb === 1) {
    themeButtonI.className = ("fas fa-moon");
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    themeWeb = 2;
  } else {
    themeButtonI.className = ("fas fa-sun");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    themeWeb = 1;
  }
}

// open modal
function showModal() {
  modalScreen.classList.remove("hidden")
}

// close modal
function closeModal() {
  modalScreen.classList.add("hidden");
  modalContentInput.forEach(function (input) {
    input.value = "";
  });
}

// show toast After each registration or edit or delete and clear after a few seconds
function toastShow() {
  let processWidth = 0;
  toastElem.classList.remove("hidden");

  const process = setInterval(function () {
    if (processWidth === 100) {
      clearInterval(process);
    } else {
      processWidth++;
      processElem.style.width = `${processWidth}%`
    }
  }, 20);

  setTimeout(() => {
    toastElem.classList.add("hidden");
    processElem.style.width = "0%"
  }, 2200)
}

// change pagination In the products and users section By clicking on the number of each page
function changePageHandler(SelectedPage, event) {
  const dataContent = event.target.dataset.content;
  page = SelectedPage;
  const pagesNumbers = document.querySelectorAll(`.content-${dataContent} .page`);

  pagesNumbers.forEach(function (pageNumber) {
    if (+pageNumber.innerHTML === page) {

      pageNumber.classList.add("active");
    } else {
      pageNumber.classList.remove("active");
    }
  })
  showInformation(data.users, "user" , "notMain");
  showInformation(data.products, "product" , "notMain");
  showInformation(data.products, "product" , "main");
  showInformation(data.users, "user" , "main");
}

// generate pagination In the products and users section
function generatePagination(contentName, content) {
  const pagesCount = contentName.length / perPage;
  const paginationElem = document.querySelector(`.content-${content} .pagination`);
  paginationElem.innerHTML = "";

  for (let i = 0; i < pagesCount; i++) {
    paginationElem.insertAdjacentHTML("beforeend",
      `
      <span class="page ${
          i === 0 ? "active" : ""
        }" data-content=${content} onclick="changePageHandler(${i + 1} , event)">${i + 1}</span>
      `
    )
  }
}

themeButton.addEventListener("click", changeTheme);
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);