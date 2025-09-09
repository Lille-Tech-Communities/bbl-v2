(function () {
    const navButton = document.getElementById('nav-control');
    const theNav = navButton.parentNode;

    navButton?.addEventListener('click', () => {
        theNav.classList.toggle('active');
    });

})();