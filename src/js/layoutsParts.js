console.log('script 1');


fetch('../views/parts/navbar.html', {mode: 'no-cors'})
    .then(response => response.text())
    .then(data=> console.log(data))
    .catch(error => console.error(error));

console.log('cool');
// console.log(navbar);