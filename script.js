/* =====================================================
                    INTRO 4 SECONDS
===================================================== */

window.addEventListener("load", function () {

    const intro =
        document.getElementById("intro");


    setTimeout(function () {

        intro.classList.add(
            "intro-hide"
        );


        setTimeout(function () {

            intro.style.display =
                "none";

        }, 1000);

    }, 4000);

});



/* =====================================================
                    PHOTO ERROR
===================================================== */

function showPhotoError() {

    const photo =
        document.getElementById(
            "profilePhoto"
        );


    const error =
        document.getElementById(
            "photoError"
        );


    photo.style.display =
        "none";


    error.style.display =
        "flex";

}



/* =====================================================
                    MOBILE MENU
===================================================== */

const menuBtn =
    document.getElementById(
        "menuBtn"
    );


const nav =
    document.getElementById(
        "nav"
    );


if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        function () {

            nav.classList.toggle(
                "open"
            );

        }
    );

}


document
    .querySelectorAll("#nav a")
    .forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                nav.classList.remove(
                    "open"
                );

            }
        );

    });



/* =====================================================
                3D PHOTO SCROLL
===================================================== */

const photoCard =
    document.getElementById(
        "photoCard"
    );


const hero =
    document.getElementById(
        "home"
    );


function animatePhoto() {

    if (
        !photoCard ||
        !hero
    ) {

        return;

    }


    if (
        window.innerWidth <= 700
    ) {

        return;

    }


    const rect =
        hero.getBoundingClientRect();


    const maxScroll =
        hero.offsetHeight -
        window.innerHeight;


    let progress =
        -rect.top /
        maxScroll;


    progress =
        Math.max(
            0,
            Math.min(
                1,
                progress
            )
        );


    /*
        START:

        CENTER / BIG

        ↓

        ROTATE

        ↓

        MOVE UP

        ↓

        MOVE RIGHT

        ↓

        SMALL
    */


    const rotateY =
        progress * 180;


    const rotateX =
        progress * 30;


    const rotateZ =
        progress * 12;


    const moveX =
        progress * 32;


    const moveY =
        progress * -28;


    const scale =
        1 -
        progress * .60;


    const depth =
        progress * 150;


    photoCard.style.transform = `

        translate3d(
            ${moveX}vw,
            ${moveY}vh,
            ${depth}px
        )

        rotateX(
            ${rotateX}deg
        )

        rotateY(
            ${rotateY}deg
        )

        rotateZ(
            ${rotateZ}deg
        )

        scale(
            ${scale}
        )

    `;

}


window.addEventListener(
    "scroll",
    animatePhoto,
    {
        passive: true
    }
);



/* =====================================================
                    MOBILE PHOTO
===================================================== */

function mobilePhoto() {

    if (
        !photoCard ||
        !hero ||
        window.innerWidth > 700
    ) {

        return;

    }


    const rect =
        hero.getBoundingClientRect();


    const maxScroll =
        hero.offsetHeight -
        window.innerHeight;


    let progress =
        -rect.top /
        maxScroll;


    progress =
        Math.max(
            0,
            Math.min(
                1,
                progress
            )
        );


    const rotate =
        progress * 180;


    const moveX =
        progress * 20;


    const moveY =
        progress * -12;


    const scale =
        1 -
        progress * .35;


    photoCard.style.transform = `

        translate(
            ${moveX}vw,
            ${moveY}vh
        )

        rotateY(
            ${rotate}deg
        )

        rotateZ(
            ${progress * 10}deg
        )

        scale(
            ${scale}
        )

    `;

}


window.addEventListener(
    "scroll",
    mobilePhoto,
    {
        passive: true
    }
);



/* =====================================================
                SECTION REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const observer =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(
                function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add(
                                "visible"
                            );

                    }

                }
            );

        },
        {
            threshold: .15
        }
    );


revealElements.forEach(
    function (element) {

        observer.observe(
            element
        );

    }
);



/* =====================================================
                    3D CARD TILT
===================================================== */

const cards =
    document.querySelectorAll(
        ".learning-card, .certificate-card"
    );


cards.forEach(
    function (card) {


        card.addEventListener(
            "mousemove",
            function (event) {


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const rotateX =
                    (y - centerY) / 20;


                const rotateY =
                    (centerX - x) / 20;


                card.style.transform = `

                    perspective(900px)

                    rotateX(
                        ${rotateX}deg
                    )

                    rotateY(
                        ${rotateY}deg
                    )

                    translateY(-8px)

                `;

            }
        );


        card.addEventListener(
            "mouseleave",
            function () {

                card.style.transform =
                    "";

            }
        );

    }
);



/* =====================================================
                    START
===================================================== */

animatePhoto();

mobilePhoto();