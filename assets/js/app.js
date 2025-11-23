  let cl=console.log;

const blogForm=document.getElementById("blogForm");
const titlecontrol=document.getElementById("title");
const contentcontrol=document.getElementById("content");
const useridcontrol=document.getElementById("userid");
const subbtn=document.getElementById("subbtn");
const upbtn=document.getElementById("upbtn");
const postContainer=document.getElementById("postContainer");
const load=document.getElementById("loader");


let BASE_URL=`https://blogs-task-default-rtdb.firebaseio.com`

let POST_URL=`${BASE_URL}/posts.json`



function blogObjToArr(obj) {

    let arr = [];
    for (const key in obj) {
        obj[key].id = key
        arr.push(obj[key])
    }
    return arr
}


function snackbar(title, icon){
    Swal.fire({
        title,
        icon,
        timer: 2500
    })
}



function loader(flag) {
    if (flag) {
        load.classList.remove("d-none");
    } else {
        load.classList.add("d-none");
    }
}

//_________________________templating________________//
function createCards(arr){
    let result=arr.map(post=>{
        return `<div class="card mt-3" id="${post.id}">
                <div class="card-header">
                <h3 class="mb-0">${post.title}</h3>
                </div>
                <div class="card-body">
                <p>${post.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-outline-primary" onclick="Onedit(this)">edit</button>
                    <button type="button" class="btn btn-outline-danger " onclick="onremove(this)">delete</button>
                </div>
            </div>
      `
    }).join('')
  postContainer.innerHTML=result;  
}


//_________________________fetchAllBlogs________________//
function FetchAllPost(){

   loader(true)

    fetch(POST_URL, {
        method: "GET",
        body: null,
        headers: {
            "auth": "Token for Ls",
            "Content-type": "application/json"
        }
    })

        .then(res => {
            return res.json()
        })
        .then(data => {
            let postArr = blogObjToArr(data)
            createCards(postArr)

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            loader(false)
        })

}

FetchAllPost()

//_________________________remove_obj________________//
function onremove(ele){
Swal.fire({
  title: "Are you sure?",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) { 
    loader(true)
    let rId=ele.closest('.card').id;
    cl('click')

   
    let remove_url=`${BASE_URL}/posts/${rId}.json`

          fetch(remove_url, {
                method: "DELETE",
                body: null,
                headers: {
                    "auth": "Token for Ls",
                    "Content-type": "application/json"
                }
            })

                .then(res => res.json())
                .then(data => {
                    ele.closest(".card").remove();
                    snackbar(`The id with id ${rId} remove successfully`, `success`)
                })
                .catch(err => {
                    snackbar(err, "error")
                })
                 .finally(() => {
                     loader(false)
                 })
                 
            }
            

        })
    }

   

//_________________________edit_obj________________//
function Onedit(ele){
    loader(true)
    let eId=ele.closest('.card').id;
    localStorage.setItem('edit_id', eId)
    let edit_url=`${BASE_URL}/posts/${eId}.json`
    fetch(edit_url, {
        method: "GET",
        body: null,
        headers: {
            "auth": "Token for Ls",
            "Content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            cl(data)
           titlecontrol.value=data.title;
           contentcontrol.value=data.body;
           useridcontrol.value=data.userId; 

            subbtn.classList.add("d-none");
            upbtn.classList.remove("d-none");

        })
        .catch(err => {
            snackbar(err, "error")
        })
         .finally(() => {
            loader(false)
        })
         
    }


//_________________________update_obj________________//
function onupdatebtn(){
    loader(true)
    let u_id=localStorage.getItem('edit_id');

    let u_obj={
        title: titlecontrol.value,
        body: contentcontrol.value,
        userId: useridcontrol.value,
        id: u_id
    }

let update_url=`${BASE_URL}/posts/${u_id}.json`

      fetch(update_url, {
        method: "PATCH",
        body: JSON.stringify(u_obj),
        headers: {
            "auth": "Token for Ls",
            "Content-type": "application/json"
        }
    })

        .then(res => res.json())
        .then(data => {

       let card = document.getElementById(u_id);
       card.querySelector(".card-header h3").innerText = u_obj.title;
       card.querySelector(".card-body p").innerText = u_obj.body;

            blogForm.reset();
            upbtn.classList.add("d-none");
            subbtn.classList.remove("d-none");
            snackbar(`Post ID ${u_id} updated successfully`, "success");
        }) 
        .catch(err => {
            snackbar(err, "error")
        })
        .finally(() => {
            loader(false)
        })
           
}
 








//-----------------submit-----------------------//
function onPostSubmit(eve){
    eve.preventDefault();
    let postObj={
        title: titlecontrol.value,
        body: contentcontrol.value,
        userId: useridcontrol.value,
    }
    cl(postObj)

    loader(true)
  
    fetch(POST_URL, {
        method: "POST",
        body: JSON.stringify(postObj),
        headers: {
            "auth": "Token for Ls",
            "Content-type": "application/json"
        }
    })

        .then(res => {
            if (res.status >= 200 && res.status < 300) {
                return res.json()
            }
        })
        .then(data => {
            cl(data);
            blogForm.reset();
            snackbar("New blog Created Successfully!!!", "success");   
          let card=document.createElement('div')
            card.className=`card mt-3`
            card.id=data.name;
            card.innerHTML =` <div class="card-header">
                <h3 class="mb-0">${postObj.title}</h3>
                </div>
                <div class="card-body">
                <p>${postObj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-outline-primary" onclick="Onedit(this)">edit</button>
                    <button type="button" class="btn btn-outline-danger " onclick="onremove(this)">delete</button>
                </div>`
        postContainer.append(card) 
        })
        .catch(err => {
            cl(err);
        })
         .finally(() => {
            loader(false)
        })
       
}


blogForm.addEventListener("submit", onPostSubmit)
upbtn.addEventListener("click", onupdatebtn)




