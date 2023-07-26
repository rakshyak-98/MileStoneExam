function getPostDOMString({ imageURL, title, description, id }) {
  return `<div class="post__card" id=${id}>
      <div class="post__header">
      <img src=${imageURL} alt="post image">
      </div>
      <div class="post__content">
      <h2 class="post__title">${title}</h2>
      <p class="post__description">${description}</p>
      </div>
      <a class="post__link" href="#read?id=${id}">Read</a>
      </div>`;
}

class ValueError extends Error{
    name = "VALUE_ERROR"
   constructor(message){
    super(message)
   }
}
/*
 * @params {[]} blogs
 */
const CONST_VAL = {
    PWSkills_Blog: "PWSkills-Blog"
}

setupLocalStorage()

document.getElementsByName("icon-add")[0].addEventListener("click", () => {
  showModal();
});

document.getElementsByName("icon-close")[0].addEventListener("click", () => {
  hideModal();
});

function getIncrementedCount(){
  let count = localStorage.getItem("last_count")
  localStorage.setItem("last_count", ++count)
  return localStorage.getItem("last_count")
}

function setupLocalStorage(){
    if(localStorage.getItem(CONST_VAL.PWSkills_Blog)){
        return
    }
    localStorage.setItem(CONST_VAL.PWSkills_Blog, JSON.stringify({data: [], last_count: 0}))
}

function showModal() {
  document.querySelector(".modal").classList.remove("hide");
  document.querySelector(".modal").classList.add("show");
}

function hideModal() {
  document.querySelector(".modal").classList.remove("show");
  document.querySelector(".modal").classList.add("hide");
  location.reload()
}

function pushDataToLocalStorage(data){
    const payload = JSON.parse(localStorage.getItem(CONST_VAL.PWSkills_Blog))
    payload.data.push(Object.assign(data, {id: getIncrementedCount()}))
    localStorage.setItem(CONST_VAL.PWSkills_Blog, JSON.stringify(payload))
}

function clearForm(ref){
    ref.reset();
    console.info("cleared form")
}

function getPostById(id){
  const {data} = JSON.parse(localStorage.getItem(CONST_VAL.PWSkills_Blog))
  return data.filter(post => post.id == id)[0]
}

function getDetailedPostDOMString({imageURL, title, description, text}){
  return  `<div class="post__detailed">
  <div class="header">
    <div class="left">
    <h2>${title}</h2>
    <p>${description}</p>
    </div>
    <div class="right">
    <img src=${imageURL} alt="detail post image" />
    </div>
  </div>
  <div class="post__detailed__content>
  <p>${text}</p>
  </div>
  </div>`
}

document.querySelector(".modal form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  try {
    const payload = {
      title: formData.get("title"),
      imageURL: formData.get("imageURL"),
      description: formData.get("description"),
      text: formData.get("text"),
    };
    pushDataToLocalStorage(payload)
    clearForm(e.currentTarget)
  } catch (error) {
    alert("Please Try again. Something was not right.");
    console.error(error);
  }
});

// loads posts

window.addEventListener("load", () => {
  const fragment = document.createDocumentFragment()
  const {data: blogs} = JSON.parse(localStorage.getItem(CONST_VAL.PWSkills_Blog))
  blogs.forEach((el) => {
    document.getElementById("blog-container").insertAdjacentHTML('beforeend', getPostDOMString(el))
  })
})

window.addEventListener("hashchange", () => {
  const currentSelectedPost = getPostById(location.hash.split("=")[1])
  console.log(currentSelectedPost)
  document.body.innerHTML = getDetailedPostDOMString(currentSelectedPost)
})