const frame = document.getElementById('check');
const off = document.querySelector(".off");
const on = document.querySelector(".on");
let wifi;
async function checkOnline() {
    off.style.display = "block";
    on.style.display = "none";
  fetch('https://example.com', { mode: 'no-cors' })
  .then(response => {
    off.style.display = "none";
    on.style.display = "block";
})
  .catch(error => {
    off.style.display = "block";
    on.style.display = "none";
  });
}

checkOnline()