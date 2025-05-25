
let note_list = [];
let start = 0;
let moddel = false;
const notes = document.getElementById("notes")
const upload_button = document.getElementById('upload_button');
function checkReachedBottom() {
  result = false;
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      result = true
    }
  })
  return result;
}
async function renderList(notes, note_list) {
  await note_list;
  notes.innerHTML = "";
  for (i = 0; i < note_list.length; i++) {
    notes.innerHTML += `
    <li>
      <p>${note_list[i].name}</p>
      <div>
        <button type=""><img src="/assets/download.png" alt="download"></button>
        <button type=""><img src="/assets/delete.png" alt="delete"></button>
      </div>
    </li>
    
                      `
  }
  console.log(note_list);
}
function toggleSpinner(list) {
  console.log(list.length);
  if (list.length === 0 || checkReachedBottom()) {
    const spinner = document.createElement('div')
    spinner.id = "spinner"
    spinner.className = "spinner"
    document.querySelector('body').appendChild(spinner)
  } else {
    document.getElementById("spinner").remove();
  }
}
fetch(`/api/get-notes/${start}`, { method: "GET", headers: { 'Content-Type': 'application/json' } }).then(async (res) => {
  if (res.ok) {
    note_list = await res.json();
    console.log(note_list);
  }
})
upload_button.addEventListener('click', () => {
  let form_container = document.createElement('div');
  form_container.className = "modal-overlay";
  form_container.id = "modal-overlay";
  let form = document.createElement('div');
  form.className = 'modal';
  let title = document.createElement('h2');
  title.innerText = "chose a file to upload"
  let input = document.createElement('input');
  input.type = 'file';
  input.id = 'file'
  input.name = 'file'
  let submit_button = document.createElement("button");
  submit_button.id = "submit_upload"
  submit_button.innerText = 'submit'
  let cancel_button = document.createElement("button");
  cancel_button.id = "cancel"
  cancel_button.innerText = 'cancel'
  form.appendChild(title);
  form.appendChild(input);
  form.appendChild(submit_button);
  form.appendChild(cancel_button);
  form_container.appendChild(form)
  document.querySelector('body').appendChild(form_container)
})
document.body.addEventListener('click', async (e) => {
  // had to do it this way because the cancel isnt garanted to be there
  if (e.target.id === 'cancel') {
    const modal = document.getElementById('modal-overlay');
    modal.parentElement.removeChild(modal);
  }
  if (e.target.id === "submit_upload") {
    const file = document.getElementById('file').files[0];
    const extention = file.name.split('.').at(-1);
    console.log(extention)
    if (file && extention === 'md') {
      console.log(file)
      const file_data = new FormData();
      file_data.append('file', file)
      await fetch(`/api/uploadfile/${file.name}`, { method: "POST", body: file_data }).then(res => {
        if (res.ok) {
          alert("upload successfull");
        }
      })
    }
    document.getElementById('file').value = '';
  }
})
renderList(notes, note_list);
toggleSpinner(note_list);
