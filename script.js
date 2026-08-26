/* =========================================================
   SKY OF WINGS
   VANILLA JAVASCRIPT
========================================================= */


/* =========================================================
   INTRO - APPROX 4 SECONDS
========================================================= */

window.addEventListener("load", () => {

    const intro =
        document.getElementById("intro");

    setTimeout(() => {

        intro.classList.add("hide");

    }, 4000);

});


/* =========================================================
   SPACE WARP ENGINE
========================================================= */

const canvas =
    document.getElementById("spaceCanvas");

const ctx =
    canvas.getContext("2d");

let width;
let height;

let stars = [];

const STAR_COUNT =
    window.innerWidth < 600
        ? 420
        : 850;


/* ---------------------------------------------------------
   RESIZE
--------------------------------------------------------- */

function resizeCanvas() {

    width =
        canvas.width =
        window.innerWidth;

    height =
        canvas.height =
        window.innerHeight;
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================================
   STAR CREATION
========================================================= */

function createStar(
    initial = false
) {

    const angle =
        Math.random() *
        Math.PI *
        2;

    const distance =
        initial
            ? Math.random() * 1600
            : Math.random() * 120;

    return {

        x:
            Math.cos(angle) *
            distance,

        y:
            Math.sin(angle) *
            distance,

        z:
            initial
                ? Math.random() * 1600 + 1
                : 1600,

        pz: 1600,

        size:
            Math.random() *
            1.8 + .3,

        speed:
            Math.random() *
            8 + 5

    };
}


for (
    let i = 0;
    i < STAR_COUNT;
    i++
) {

    stars.push(
        createStar(true)
    );
}


/* =========================================================
   WARP SPEED ANIMATION
========================================================= */

function animateSpace() {

    ctx.fillStyle =
        "rgba(1,1,6,0.35)";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* CENTER ORIGIN */

    const centerX =
        width / 2;

    const centerY =
        height / 2;


    /* SUBTLE CENTRAL GLOW */

    const glow =
        ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            Math.max(width, height) * .5
        );

    glow.addColorStop(
        0,
        "rgba(99,45,180,0.045)"
    );

    glow.addColorStop(
        .4,
        "rgba(55,25,100,0.02)"
    );

    glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = glow;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* STARS */

    for (
        let i = 0;
        i < stars.length;
        i++
    ) {

        const star =
            stars[i];

        star.pz =
            star.z;

        star.z -=
            star.speed;


        /* RESET WHEN STAR PASSES CAMERA */

        if (
            star.z <= 1
        ) {

            stars[i] =
                createStar(false);

            continue;
        }


        /* PERSPECTIVE */

        const sx =
            centerX +
            (star.x / star.z) *
            width;

        const sy =
            centerY +
            (star.y / star.z) *
            height;


        const px =
            centerX +
            (star.x / star.pz) *
            width;

        const py =
            centerY +
            (star.y / star.pz) *
            height;


        /* SCREEN BOUNDARY RESET */

        if (
            sx < -100 ||
            sx > width + 100 ||
            sy < -100 ||
            sy > height + 100
        ) {

            stars[i] =
                createStar(false);

            continue;
        }


        const alpha =
            Math.min(
                1,
                (1600 - star.z) /
                900
            );


        const lineWidth =
            Math.max(
                .3,
                (1600 - star.z) / 500
            );


        /* MOTION STREAK */

        ctx.beginPath();

        ctx.moveTo(
            px,
            py
        );

        ctx.lineTo(
            sx,
            sy
        );

        ctx.strokeStyle =
            `rgba(235,225,255,${alpha * .55})`;

        ctx.lineWidth =
            lineWidth;

        ctx.stroke();


        /* STAR CORE */

        const radius =
            Math.max(
                .4,
                (1 - star.z / 1600) *
                star.size *
                2
            );

        ctx.beginPath();

        ctx.arc(
            sx,
            sy,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,255,255,${alpha})`;

        ctx.fill();

    }


    requestAnimationFrame(
        animateSpace
    );
}

animateSpace();


/* =========================================================
   MOUSE FOLLOW GLOW
========================================================= */

const mouseGlow =
    document.querySelector(
        ".mouse-glow"
    );

let mouseX =
    window.innerWidth / 2;

let mouseY =
    window.innerHeight / 2;

window.addEventListener(
    "mousemove",
    event => {

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;

        mouseGlow.style.left =
            mouseX + "px";

        mouseGlow.style.top =
            mouseY + "px";

    },
    { passive: true }
);


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const hamburger =
    document.getElementById(
        "hamburger"
    );

const navMenu =
    document.getElementById(
        "navMenu"
    );


hamburger.addEventListener(
    "click",
    () => {

        navMenu.classList.toggle(
            "active"
        );

    }
);


document
    .querySelectorAll(
        "#navMenu a"
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navMenu.classList.remove(
                    "active"
                );

            }
        );

    });


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
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
    element => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   3D TILT CARDS
========================================================= */

const tiltCards =
    document.querySelectorAll(
        ".tilt-card"
    );


tiltCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

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

            const rotateY =
                ((x - centerX) /
                    centerX) * 8;

            const rotateX =
                -((y - centerY) /
                    centerY) * 8;


            card.style.transform =
                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-5px)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "";

        }
    );

});


/* =========================================================
   HERO PHOTO SCROLL TRANSFORMATION
========================================================= */

const heroPhoto =
    document.querySelector(
        ".hero-photo"
    );

const photoFrame =
    document.querySelector(
        ".photo-frame"
    );

const heroContent =
    document.querySelector(
        ".hero-content"
    );

const floatingProfile =
    document.getElementById(
        "floatingProfile"
    );

let currentScroll =
    window.scrollY;

let targetScroll =
    window.scrollY;


/* ---------------------------------------------------------
   GET HERO PROGRESS
--------------------------------------------------------- */

function getHeroProgress() {

    const heroHeight =
        window.innerHeight;

    return Math.max(
        0,
        Math.min(
            1,
            window.scrollY /
            (heroHeight * .9)
        )
    );

}


/* =========================================================
   REQUEST ANIMATION FRAME SCROLL ENGINE
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        targetScroll =
            window.scrollY;

    },
    { passive: true }
);


function updateScrollAnimation() {

    currentScroll +=
        (targetScroll -
            currentScroll) *
        .1;


    const heroHeight =
        window.innerHeight;

    const progress =
        Math.max(
            0,
            Math.min(
                1,
                currentScroll /
                (heroHeight * .9)
            )
        );


    /* -----------------------------------------------------
       PHOTO TRANSFORMATION
    ----------------------------------------------------- */

    const rotate =
        progress * 80;

    const translateX =
        progress * 45;

    const translateY =
        -progress * 160;

    const scale =
        1 -
        progress * .62;


    if (heroPhoto) {

        heroPhoto.style.transform =
            `translate3d(
                ${translateX}px,
                ${translateY}px,
                0
            )
            rotateY(${rotate}deg)
            scale(${scale})`;

    }


    /* -----------------------------------------------------
       PHOTO FRAME DEPTH
    ----------------------------------------------------- */

    if (photoFrame) {

        photoFrame.style.transform =
            `rotateZ(
                ${progress * 15}deg
            )
            translateZ(
                ${progress * 80}px
            )`;

    }


    /* -----------------------------------------------------
       HERO TEXT
    ----------------------------------------------------- */

    if (heroContent) {

        heroContent.style.transform =
            `translate3d(
                0,
                ${progress * -80}px,
                0
            )
            scale(
                ${1 - progress * .08}
            )`;

        heroContent.style.opacity =
            1 -
            progress * .25;
    }


    /* -----------------------------------------------------
       FLOATING PROFILE
    ----------------------------------------------------- */

    if (
        progress > .65
    ) {

        floatingProfile.classList.add(
            "active"
        );

    } else {

        floatingProfile.classList.remove(
            "active"
        );

    }


    requestAnimationFrame(
        updateScrollAnimation
    );
}

updateScrollAnimation();


/* =========================================================
   SECTION ACTIVE NAV
========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".navbar nav a"
    );


const navObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        const id =
                            entry.target.id;

                        navLinks.forEach(
                            link => {

                                link.classList.remove(
                                    "active"
                                );

                                if (
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${id}`
                                ) {

                                    link.classList.add(
                                        "active"
                                    );

                                }

                            }
                        );

                    }

                }
            );

        },
        {
            threshold: .55
        }
    );


sections.forEach(
    section => {

        navObserver.observe(
            section
        );

    }
);


/* =========================================================
   PARALLAX SECTION ELEMENTS
========================================================= */

const parallaxElements =
    document.querySelectorAll(
        ".section-heading, .glass-card"
    );


let ticking =
    false;


window.addEventListener(
    "scroll",
    () => {

        if (!ticking) {

            window.requestAnimationFrame(
                () => {

                    const viewport =
                        window.innerHeight;

                    parallaxElements.forEach(
                        element => {

                            const rect =
                                element.getBoundingClientRect();

                            const center =
                                rect.top +
                                rect.height / 2;

                            const distance =
                                center -
                                viewport / 2;

                            if (
                                Math.abs(distance) <
                                viewport
                            ) {

                                const movement =
                                    distance *
                                    -0.015;

                                element.style.setProperty(
                                    "--parallax-y",
                                    `${movement}px`
                                );

                            }

                        }
                    );

                    ticking =
                        false;

                }
            );

            ticking =
                true;
        }

    },
    { passive: true }
);


/* =========================================================
   PDF ERROR HANDLING
========================================================= */

document
    .querySelectorAll(
        "iframe"
    )
    .forEach(
        frame => {

            frame.addEventListener(
                "error",
                () => {

                    frame.style.background =
                        "#09050f";

                }
            );

        }
    );


/* =========================================================
   KEYBOARD ESCAPE - CLOSE MOBILE NAV
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            navMenu.classList.remove(
                "active"
            );

        }

    }
);


/* =========================================================
   INITIAL PAGE POSITION
========================================================= */

window.addEventListener(
    "load",
    () => {

        window.scrollTo(
            0,
            0
        );

    }
);