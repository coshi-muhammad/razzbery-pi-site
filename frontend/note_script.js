
let note_list = [];
let start = 0;
const notes = document.getElementById("notes")
note_list = [{ name: 'somethin' }, { name: 'somethin' }, { name: 'somethin' }, { name: 'somethin' }, { name: 'somethin' }, { name: 'somethin' }, { name: 'somethin' }]
function checkReachedBottom() {
  result = false;
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      result = true
    }
  })
  return result;
}
function renderList(notes, note_list) {
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
// fetch(`/api/get-notes/${start}`, { method: "GET", headers: { 'Content-Type': 'application/json' } }).then(res => {
//   if (res.ok) {
//     note_list = JSON.parse(res.body.notes);
//   }
// })
renderList(notes, note_list);
toggleSpinner(note_list);
