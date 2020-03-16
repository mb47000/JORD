/**
 * FETCH NAVBAR FILES
 */
fetch('../views/parts/navbar.html', {mode: 'no-cors'})
    .then(response => response.text())
    .then(data=> document.getElementById('navbar').innerHTML = data )
    .catch(error => console.error(error));


/**
 * FETCH FOOTER FILES
 */
fetch('../views/parts/footer.html', {mode: 'no-cors'})
    .then(response => response.text())
    .then(data=> document.getElementById('footer').innerHTML = data )
    .catch(error => console.error(error));

