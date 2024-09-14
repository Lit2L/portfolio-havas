exports.id = 514;
exports.ids = [514];
exports.modules = {

/***/ 72321:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 16110))

/***/ }),

/***/ 76294:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 61166));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 43299));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 69137));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 15514));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 90681));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 95721));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 21812))

/***/ }),

/***/ 60452:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 28430, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 59426, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 99887, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 29888, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 68170, 23))

/***/ }),

/***/ 43299:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Hydrate)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76931);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(17640);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ default auto */ 

// import { useThemeStore } from '../store'
// import { SessionProvider } from 'next-auth/react'
function Hydrate({ children }) {
    const [isHydrated, setIsHydrated] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    // const themeStore = useThemeStore()
    // Waits til Nextjs rehydration completes
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        setIsHydrated(true);
    }, []);
    return(// <SessionProvider>
    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: isHydrated ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("body", {
            className: "min-h-screen bg-background font-robot antialiased bg-dark-50 text-dark-600 transition-colors duration-300 ease-in-out mx-auto max-w-full relative dark:bg-dark-500 dark:text-dark-50 scroll-p-32 scroll-smooth",
            children: children
        }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("body", {})
    }));
}


/***/ }),

/***/ 36387:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Gt: () => (/* reexport */ AnimatedLetters),
  V0: () => (/* reexport */ AnimatedText),
  mw: () => (/* reexport */ defaultLetterVariants),
  Cs: () => (/* reexport */ defaultTextVariants)
});

// EXTERNAL MODULE: external "next/dist/compiled/react-experimental/jsx-runtime"
var jsx_runtime_ = __webpack_require__(76931);
// EXTERNAL MODULE: external "next/dist/compiled/react-experimental"
var react_experimental_ = __webpack_require__(17640);
// EXTERNAL MODULE: ./node_modules/.pnpm/framer-motion@10.18.0_react-dom@18.2.0_react@18.2.0/node_modules/framer-motion/dist/es/render/dom/motion.mjs + 75 modules
var motion = __webpack_require__(15646);
;// CONCATENATED MODULE: ./app/components/animated-text/animated-text.tsx
/* __next_internal_client_entry_do_not_use__ AnimatedText,AnimatedLetters auto */ 



const AnimatedText = ({ as: Tag = "p", text, variants = defaultLetterVariants, ...rest })=>{
    // Split the text into words and add a space after each word.
    const words = text.split(" ").map((word)=>`${word}\u00A0`);
    const renderWords = (0,react_experimental_.useMemo)(()=>words.map((word, index)=>/*#__PURE__*/ jsx_runtime_.jsx("span", {
                className: "inline-block overflow-hidden",
                children: /*#__PURE__*/ jsx_runtime_.jsx(motion/* motion */.E.span, {
                    variants: variants,
                    className: "inline-block",
                    children: word
                })
            }, index)), [
        variants,
        words
    ]);
    return /*#__PURE__*/ jsx_runtime_.jsx(Tag, {
        ...rest,
        children: /*#__PURE__*/ jsx_runtime_.jsx(motion/* motion */.E.span, {
            variants: variants,
            children: renderWords
        })
    });
};
const AnimatedLetters = ({ as: Tag = "div", text, textVariants = defaultTextVariants, letterVariants = defaultLetterVariants, ...rest })=>{
    // Split the text into words and add a space after each word.
    const words = text.split(" ").map((word)=>`${word}\u00A0`);
    const id = (0,react_experimental_.useId)();
    return /*#__PURE__*/ jsx_runtime_.jsx(Tag, {
        ...rest,
        children: /*#__PURE__*/ jsx_runtime_.jsx(motion/* motion */.E.span, {
            variants: textVariants,
            children: words.map((word, index)=>/*#__PURE__*/ jsx_runtime_.jsx("span", {
                    className: "inline-block whitespace-nowrap",
                    children: Array.from(word).flat().map((letter, letterIndex)=>/*#__PURE__*/ jsx_runtime_.jsx("span", {
                            className: "inline-block overflow-hidden",
                            children: /*#__PURE__*/ jsx_runtime_.jsx(motion/* motion */.E.span, {
                                variants: letterVariants,
                                className: "inline-block",
                                children: letter
                            })
                        }, `${letter}-${id}-${letterIndex}`))
                }, `${word}-${id}-${index}`))
        })
    });
};

;// CONCATENATED MODULE: ./app/components/animated-text/animated-text.motion.ts
const defaultTextVariants = {
    visible: {}
};
const defaultLetterVariants = {
    hidden: {
        opacity: 0,
        y: 50
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            ease: "circOut",
            duration: 0.5
        }
    }
};

;// CONCATENATED MODULE: ./app/components/animated-text/index.ts




/***/ }),

/***/ 90681:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Footer: () => (/* binding */ Footer)
});

// EXTERNAL MODULE: external "next/dist/compiled/react-experimental/jsx-runtime"
var jsx_runtime_ = __webpack_require__(76931);
// EXTERNAL MODULE: ./node_modules/.pnpm/framer-motion@10.18.0_react-dom@18.2.0_react@18.2.0/node_modules/framer-motion/dist/es/render/dom/motion.mjs + 75 modules
var motion = __webpack_require__(15646);
;// CONCATENATED MODULE: ./app/components/footer/footer.motion.ts
const footerVariants = {
    visible: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.5
        }
    }
};
const footerItemVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeInOut"
        }
    }
};

;// CONCATENATED MODULE: ./app/components/footer/index.ts



;// CONCATENATED MODULE: ./app/components/footer/footer.tsx
/* __next_internal_client_entry_do_not_use__ Footer auto */ 


function Footer() {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(motion/* motion */.E.footer, {
        variants: footerVariants,
        initial: "hidden",
        whileInView: "visible",
        viewport: {
            once: true
        },
        className: "md:flex-row md:justify-between container flex flex-col justify-center gap-10 py-16",
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("section", {
                className: "md:gap-12 flex w-1/2 gap-8 text-xl",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(motion/* motion */.E.a, {
                        href: "https://github.com/larrydevelops",
                        target: "_blank",
                        rel: "noreferrer",
                        variants: footerItemVariants,
                        className: "nav-link text-dark-500 text-xl",
                        children: "Github"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(motion/* motion */.E.a, {
                        href: "https://dribbble.com/larrydevelops",
                        target: "_blank",
                        rel: "noreferrer",
                        variants: footerItemVariants,
                        className: "nav-link text-dark-500 text-xl",
                        children: "Dribbble"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(motion/* motion */.E.a, {
                        href: "https://www.linkedin.com/in/larrydevelops/",
                        target: "_blank",
                        rel: "noreferrer",
                        variants: footerItemVariants,
                        className: "nav-link text-dark-500 text-xl",
                        children: "Linkedin"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(motion/* motion */.E.p, {
                variants: footerItemVariants,
                className: "text-dark-300 dark:text-dark-400 font-light",
                children: [
                    "\xa9 larrydevelops ",
                    new Date().getFullYear()
                ]
            })
        ]
    });
}


/***/ }),

/***/ 62937:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  T: () => (/* binding */ Logo)
});

// EXTERNAL MODULE: external "next/dist/compiled/react-experimental/jsx-runtime"
var jsx_runtime_ = __webpack_require__(76931);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@13.4.12_react-dom@18.2.0_react@18.2.0/node_modules/next/image.js
var next_image = __webpack_require__(66703);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./app/hooks/use-theme.ts
var use_theme = __webpack_require__(14237);
;// CONCATENATED MODULE: ./public/LarryLogoB.png
/* harmony default export */ const LarryLogoB = ({"src":"/_next/static/media/LarryLogoB.39c353a2.png","height":368,"width":382,"blurDataURL":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAMAAADz0U65AAAAG1BMVEUODg4AAAAODg4ODg4PDw8NDQ0MDAwODg4NDQ203PstAAAACXRSTlMgARVBLDqdXXITr7FWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMUlEQVR4nBWLsREAMAiE4NUk+0+cs4ICULtVzIRCMl06APfEJffUSqZfWdm4qcieu38TqwCLGcSeqwAAAABJRU5ErkJggg==","blurWidth":8,"blurHeight":8});
// EXTERNAL MODULE: ./public/LarryLogo.png
var LarryLogo = __webpack_require__(60683);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@13.4.12_react-dom@18.2.0_react@18.2.0/node_modules/next/link.js
var next_link = __webpack_require__(10494);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
;// CONCATENATED MODULE: ./app/components/logo.tsx






const Logo = ()=>{
    const { theme } = (0,use_theme/* useTheme */.F)();
    const activeTheme = theme === "dark" ? "light" : "dark";
    return /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
        href: "/",
        className: "",
        children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
            src: activeTheme === "dark" ? LarryLogoB : LarryLogo/* default */.Z,
            alt: "Larry Ly Logo",
            width: 100,
            height: 100,
            priority: true
        })
    });
};


/***/ }),

/***/ 69137:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  MobileNav: () => (/* binding */ MobileNav)
});

// EXTERNAL MODULE: external "next/dist/compiled/react-experimental/jsx-runtime"
var jsx_runtime_ = __webpack_require__(76931);
// EXTERNAL MODULE: ./node_modules/.pnpm/framer-motion@10.18.0_react-dom@18.2.0_react@18.2.0/node_modules/framer-motion/dist/es/render/dom/motion.mjs + 75 modules
var motion = __webpack_require__(15646);
// EXTERNAL MODULE: ./node_modules/.pnpm/framer-motion@10.18.0_react-dom@18.2.0_react@18.2.0/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs + 5 modules
var AnimatePresence = __webpack_require__(30073);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@13.4.12_react-dom@18.2.0_react@18.2.0/node_modules/next/link.js
var next_link = __webpack_require__(10494);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/.pnpm/use-scrollspy@1.2.0_react@18.2.0/node_modules/use-scrollspy/dist/index.mjs
var dist = __webpack_require__(27055);
// EXTERNAL MODULE: external "next/dist/compiled/react-experimental"
var react_experimental_ = __webpack_require__(17640);
// EXTERNAL MODULE: ./app/components/logo.tsx + 1 modules
var logo = __webpack_require__(62937);
// EXTERNAL MODULE: ./app/components/theme-toggle-button.tsx
var theme_toggle_button = __webpack_require__(4574);
;// CONCATENATED MODULE: ./app/hooks/use-click-away.ts

const defaultEvents = [
    "mousedown",
    "touchstart"
];
function on(obj, ...args) {
    if (obj && obj.addEventListener) {
        obj.addEventListener(...args);
    }
}
function off(obj, ...args) {
    if (obj && obj.removeEventListener) {
        obj.removeEventListener(...args);
    }
}
const useClickAway = (references, onClickAway)=>{
    const savedCallback = (0,react_experimental_.useRef)(onClickAway);
    (0,react_experimental_.useEffect)(()=>{
        savedCallback.current = onClickAway;
    }, [
        onClickAway
    ]);
    (0,react_experimental_.useEffect)(()=>{
        const handler = (event)=>{
            if (references?.some((ref)=>ref.current && ref.current.contains(event.target))) return;
            onClickAway(event);
        };
        for (const event of defaultEvents){
            on(document, event, handler);
        }
        return ()=>{
            for (const event of defaultEvents){
                off(document, event, handler);
            }
        };
    }, [
        references
    ]);
};

// EXTERNAL MODULE: ./node_modules/.pnpm/next@13.4.12_react-dom@18.2.0_react@18.2.0/node_modules/next/navigation.js
var navigation = __webpack_require__(10657);
;// CONCATENATED MODULE: ./app/components/mobile-navigation.tsx
/* __next_internal_client_entry_do_not_use__ MobileNav auto */ 








const navVariants = {
    hidden: {
        x: "100%",
        transition: {
            duration: 0.2,
            ease: [
                0.9,
                0.1,
                0.3,
                0.96
            ],
            when: "afterChildren"
        }
    },
    visible: {
        x: 0,
        transition: {
            duration: 0.3,
            ease: [
                0.9,
                0.1,
                0.3,
                0.96
            ],
            when: "beforeChildren",
            staggerChildren: 0.05
        }
    }
};
const linkVariants = {
    hidden: {
        opacity: 0,
        x: -20
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "circOut"
        }
    }
};
const MotionLink = (0,motion/* motion */.E)((link_default()));
function MobileNav() {
    const navRef = (0,react_experimental_.useRef)(null);
    const navToggleRef = (0,react_experimental_.useRef)(null);
    const [isOpen, setIsOpen] = (0,react_experimental_.useState)(false);
    const toggle = ()=>setIsOpen((open)=>!open);
    useClickAway([
        navRef,
        navToggleRef
    ], ()=>setIsOpen(false));
    (0,dist/* useScrollspy */.$)({
        ids: [
            "intro",
            "projects",
            "about",
            "contact"
        ],
        hrefs: [
            "/#intro",
            "/#projects",
            "/#about",
            "/#contact"
        ],
        offset: "topCenter",
        activeClass: "active-nav-link"
    });
    const pathname = (0,navigation.usePathname)();
    (0,react_experimental_.useEffect)(()=>setIsOpen(false), [
        pathname
    ]);
    (0,react_experimental_.useEffect)(()=>{
        document.body.style.overflow = isOpen ? "hidden" : "visible";
    }, [
        isOpen
    ]);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                href: "/#",
                className: "fixed top-8 left-4 z-30 md:hidden",
                children: /*#__PURE__*/ jsx_runtime_.jsx(logo/* Logo */.T, {})
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("button", {
                ref: navToggleRef,
                type: "button",
                "aria-label": isOpen ? "Close menu" : "Open menu",
                onClick: toggle,
                className: "fixed top-8 right-4 z-30 text-dark-100 mix-blend-difference hover:opacity-60 dark:text-white md:hidden",
                children: /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    className: "h-8 w-8",
                    children: /*#__PURE__*/ jsx_runtime_.jsx(AnimatePresence/* AnimatePresence */.M, {
                        children: isOpen ? /*#__PURE__*/ jsx_runtime_.jsx(motion/* motion */.E.path, {
                            initial: {
                                pathLength: 0
                            },
                            animate: {
                                pathLength: 1,
                                pathOffset: 0
                            },
                            exit: {
                                pathOffset: 1
                            },
                            transition: {
                                duration: 1,
                                ease: "circOut"
                            },
                            strokeLinecap: "square",
                            strokeWidth: 1.5,
                            d: "M6 18L18 6M6 6l12 12"
                        }, "close") : /*#__PURE__*/ jsx_runtime_.jsx(motion/* motion */.E.path, {
                            initial: {
                                pathLength: 0
                            },
                            animate: {
                                pathLength: 1,
                                pathOffset: 0
                            },
                            exit: {
                                pathOffset: 1
                            },
                            transition: {
                                duration: 1,
                                ease: "circOut"
                            },
                            strokeLinecap: "square",
                            strokeWidth: 1.5,
                            d: "M4 6h16M4 12h16m-7 6h7"
                        }, "open")
                    })
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(AnimatePresence/* AnimatePresence */.M, {
                children: isOpen && /*#__PURE__*/ (0,jsx_runtime_.jsxs)(motion/* motion */.E.nav, {
                    ref: navRef,
                    variants: navVariants,
                    initial: "hidden",
                    animate: "visible",
                    exit: "hidden",
                    className: "fixed inset-y-0 right-0 z-20 flex w-9/12 flex-col bg-dark-300 text-xl px-12 transition-colors dark:bg-dark-500/90 md:hidden h-full flex-wrap items-start justify-center gap-y-14",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx(MotionLink, {
                            href: "/#intro",
                            variants: linkVariants,
                            className: "mobile-nav-link",
                            children: "Introduction"
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(MotionLink, {
                            href: "/#projects",
                            variants: linkVariants,
                            className: "mobile-nav-link",
                            children: "Projects"
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(MotionLink, {
                            href: "/#about",
                            variants: linkVariants,
                            className: "mobile-nav-link",
                            children: "About"
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(MotionLink, {
                            href: "/#contact",
                            variants: linkVariants,
                            className: "mobile-nav-link",
                            children: "Contact"
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(motion/* motion */.E.div, {
                            variants: linkVariants,
                            children: /*#__PURE__*/ jsx_runtime_.jsx(theme_toggle_button/* ThemeToggleButton */.P, {})
                        })
                    ]
                })
            })
        ]
    });
}


/***/ }),

/***/ 95721:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Navigation: () => (/* binding */ Navigation)
});

// EXTERNAL MODULE: external "next/dist/compiled/react-experimental/jsx-runtime"
var jsx_runtime_ = __webpack_require__(76931);
// EXTERNAL MODULE: ./node_modules/.pnpm/framer-motion@10.18.0_react-dom@18.2.0_react@18.2.0/node_modules/framer-motion/dist/es/render/dom/motion.mjs + 75 modules
var motion = __webpack_require__(15646);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@13.4.12_react-dom@18.2.0_react@18.2.0/node_modules/next/link.js
var next_link = __webpack_require__(10494);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./app/components/logo.tsx + 1 modules
var logo = __webpack_require__(62937);
;// CONCATENATED MODULE: ./app/components/navigation/navigation.motion.ts
const navVariants = {
    visible: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 1
        }
    }
};
const linkVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeInOut"
        }
    }
};

;// CONCATENATED MODULE: ./app/components/navigation/index.ts



// EXTERNAL MODULE: ./app/components/theme-toggle-button.tsx
var theme_toggle_button = __webpack_require__(4574);
;// CONCATENATED MODULE: ./app/components/navigation/navigation.tsx
/* __next_internal_client_entry_do_not_use__ Navigation auto */ 





const AnimatedLink = (0,motion/* motion */.E)((link_default()));
AnimatedLink.defaultProps = {
    className: "hover:text-primary-brand nav-link"
};
function Navigation() {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(motion/* motion */.E.header, {
        variants: navVariants,
        initial: "hidden",
        animate: "visible",
        className: "md:flex container fixed inset-x-0 top-0 z-50 items-center justify-between hidden w-full h-32",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(AnimatedLink, {
                href: "/#",
                variants: linkVariants,
                className: "h-24 w-24",
                children: /*#__PURE__*/ jsx_runtime_.jsx(logo/* Logo */.T, {})
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("nav", {
                className: "gap-x-14 flex items-center justify-center text-lg",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(AnimatedLink, {
                        href: "/#",
                        variants: linkVariants,
                        children: "Introduction"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(AnimatedLink, {
                        href: "/#projects",
                        variants: linkVariants,
                        children: "Projects"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(AnimatedLink, {
                        href: "/#about",
                        variants: linkVariants,
                        children: "About"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(AnimatedLink, {
                        href: "/#contact",
                        variants: linkVariants,
                        children: "Contact"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(motion/* motion */.E.div, {
                        variants: linkVariants,
                        children: /*#__PURE__*/ jsx_runtime_.jsx(theme_toggle_button/* ThemeToggleButton */.P, {})
                    })
                ]
            })
        ]
    });
}


/***/ }),

/***/ 4574:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ ThemeToggleButton)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76931);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15646);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(30073);
/* harmony import */ var react_icons_md__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(19138);
/* harmony import */ var _hooks_use_theme__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14237);
/* harmony import */ var _hooks_use_mounted__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12020);
/* __next_internal_client_entry_do_not_use__ ThemeToggleButton auto */ 




const IconButton = ({ children, ...props })=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__/* .motion */ .E.button, {
        ...props,
        initial: {
            opacity: 0,
            rotate: -65,
            originY: "150%",
            originX: 0.5
        },
        animate: {
            opacity: 1,
            rotate: 0
        },
        exit: {
            opacity: 0,
            rotate: 65
        },
        transition: {
            duration: 0.4,
            ease: "backOut"
        },
        children: children
    });
IconButton.displayName = "IconButton";
const ThemeToggleButton = ()=>{
    const { theme, toggleTheme } = (0,_hooks_use_theme__WEBPACK_IMPORTED_MODULE_1__/* .useTheme */ .F)();
    const mounted = (0,_hooks_use_mounted__WEBPACK_IMPORTED_MODULE_2__/* .useMounted */ .s)();
    const isDarkMode = theme === "dark";
    if (!mounted) return null;
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_4__/* .AnimatePresence */ .M, {
        mode: "wait",
        children: isDarkMode ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(IconButton, {
            className: "hover:text-primary-brand overflow-hidden text-dark-400 hover:text-dark-500 dark:text-dark-300 dark:hover:text-dark-200",
            onClick: toggleTheme,
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_md__WEBPACK_IMPORTED_MODULE_5__/* .MdOutlineLightMode */ .A9M, {
                title: "Light mode",
                size: 24
            })
        }, "light-mode") : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(IconButton, {
            className: "hover:text-primary-brand overflow-hidden text-dark-400 hover:text-dark-500 dark:text-dark-300 dark:hover:text-dark-200",
            onClick: toggleTheme,
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_md__WEBPACK_IMPORTED_MODULE_5__/* .MdOutlineDarkMode */ .UFB, {
                title: "Dark mode",
                size: 24
            })
        }, "dark-mode")
    });
};


/***/ }),

/***/ 15514:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FloatingDock: () => (/* binding */ FloatingDock)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76931);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(23095);
/* harmony import */ var _tabler_icons_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(23230);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(30073);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(15646);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(98366);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(92109);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(56195);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10494);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(17640);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* __next_internal_client_entry_do_not_use__ FloatingDock auto */ 
/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/ 




const FloatingDock = ({ items, desktopClassName, mobileClassName })=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(FloatingDockDesktop, {
                items: items,
                className: desktopClassName
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(FloatingDockMobile, {
                items: items,
                className: mobileClassName
            })
        ]
    });
};
const FloatingDockMobile = ({ items, className })=>{
    const [open, setOpen] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("relative block ", className),
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_4__/* .AnimatePresence */ .M, {
                children: open && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__/* .motion */ .E.div, {
                    layoutId: "nav",
                    className: "absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2 bg-dark-400",
                    children: items.map((item, idx)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__/* .motion */ .E.div, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0,
                                y: 10,
                                transition: {
                                    delay: idx * 0.05
                                }
                            },
                            transition: {
                                delay: (items.length - 1 - idx) * 0.05
                            },
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
                                href: item.href,
                                className: "h-10 w-10 rounded-full bg-gray-500 dark:bg-neutral-900 flex items-center justify-center",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "h-4 w-4",
                                    children: item.icon
                                })
                            }, item.title)
                        }, item.title))
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                onClick: ()=>setOpen(!open),
                className: "h-12 w-12 rounded-full bg-dark-500 dark:bg-neutral-800 flex items-center justify-center border-4 border-white ",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_tabler_icons_react__WEBPACK_IMPORTED_MODULE_6__/* .IconLayoutNavbarCollapse */ .FKy, {
                    className: "h-5 w-5 text-neutral-500 dark:text-neutral-400"
                })
            })
        ]
    });
};
const FloatingDockDesktop = ({ items, className })=>{
    let mouseX = (0,framer_motion__WEBPACK_IMPORTED_MODULE_7__/* .useMotionValue */ .c)(Infinity);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__/* .motion */ .E.div, {
        onMouseMove: (e)=>mouseX.set(e.pageX),
        onMouseLeave: ()=>mouseX.set(Infinity),
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("mx-auto hidden md:flex h-16 gap-4 items-end  rounded-2xl bg-gray-50 dark:bg-neutral-900 px-4 pb-3", className),
        children: items.map((item)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(IconContainer, {
                mouseX: mouseX,
                ...item
            }, item.title))
    });
};
function IconContainer({ mouseX, title, icon, href }) {
    let ref = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
    let distance = (0,framer_motion__WEBPACK_IMPORTED_MODULE_8__/* .useTransform */ .H)(mouseX, (val)=>{
        let bounds = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            width: 0
        };
        return val - bounds.x - bounds.width / 2;
    });
    let widthTransform = (0,framer_motion__WEBPACK_IMPORTED_MODULE_8__/* .useTransform */ .H)(distance, [
        -150,
        0,
        150
    ], [
        40,
        80,
        40
    ]);
    let heightTransform = (0,framer_motion__WEBPACK_IMPORTED_MODULE_8__/* .useTransform */ .H)(distance, [
        -150,
        0,
        150
    ], [
        40,
        80,
        40
    ]);
    let widthTransformIcon = (0,framer_motion__WEBPACK_IMPORTED_MODULE_8__/* .useTransform */ .H)(distance, [
        -150,
        0,
        150
    ], [
        20,
        40,
        20
    ]);
    let heightTransformIcon = (0,framer_motion__WEBPACK_IMPORTED_MODULE_8__/* .useTransform */ .H)(distance, [
        -150,
        0,
        150
    ], [
        20,
        40,
        20
    ]);
    let width = (0,framer_motion__WEBPACK_IMPORTED_MODULE_9__/* .useSpring */ .q)(widthTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12
    });
    let height = (0,framer_motion__WEBPACK_IMPORTED_MODULE_9__/* .useSpring */ .q)(heightTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12
    });
    let widthIcon = (0,framer_motion__WEBPACK_IMPORTED_MODULE_9__/* .useSpring */ .q)(widthTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12
    });
    let heightIcon = (0,framer_motion__WEBPACK_IMPORTED_MODULE_9__/* .useSpring */ .q)(heightTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12
    });
    const [hovered, setHovered] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
        href: href,
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_5__/* .motion */ .E.div, {
            ref: ref,
            style: {
                width,
                height
            },
            onMouseEnter: ()=>setHovered(true),
            onMouseLeave: ()=>setHovered(false),
            className: "aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center relative",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_4__/* .AnimatePresence */ .M, {
                    children: hovered && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__/* .motion */ .E.div, {
                        initial: {
                            opacity: 0,
                            y: 10,
                            x: "-50%"
                        },
                        animate: {
                            opacity: 1,
                            y: 0,
                            x: "-50%"
                        },
                        exit: {
                            opacity: 0,
                            y: 2,
                            x: "-50%"
                        },
                        className: "px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border-4 dark:bg-neutral-300 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs",
                        children: title
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__/* .motion */ .E.div, {
                    style: {
                        width: widthIcon,
                        height: heightIcon
                    },
                    className: "flex items-center justify-center",
                    children: icon
                })
            ]
        })
    });
}


/***/ }),

/***/ 72043:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ MotionLinkButton)
/* harmony export */ });
/* unused harmony export LinkButton */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76931);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(17640);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2135);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(15646);
/* harmony import */ var react_icons_vsc__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(66289);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10494);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);






const LinkButton = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(function LinkButton({ children = "Button", icon: Icon, ...rest }, ref) {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
        ref: ref,
        ...rest,
        className: (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)("group flex gap-3 text-3xl font-light text-dark-400 transition duration-300 ease-in-out hover:text-dark-500 dark:text-dark-200", rest.className),
        children: [
            children,
            Icon ?? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_vsc__WEBPACK_IMPORTED_MODULE_4__/* .VscArrowRight */ .bTI, {
                size: 36,
                className: "rotate-45 text-dark-200 transition duration-300 ease-in-out group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-dark-300 dark:text-dark-400"
            })
        ]
    });
});
const MotionLinkButton = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(function MotionLinkButton({ children, motionProps, ...rest }, ref) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__/* .motion */ .E.div, {
        ...motionProps,
        ref: ref,
        className: rest.className,
        style: rest.style,
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(LinkButton, {
            ...rest,
            children: children
        })
    });
});


/***/ }),

/***/ 12020:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   s: () => (/* binding */ useMounted)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17640);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* __next_internal_client_entry_do_not_use__ useMounted auto */ 
function useMounted() {
    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
        setMounted(true);
        return ()=>setMounted(false);
    }, []);
    return mounted;
}


/***/ }),

/***/ 14237:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ useTheme)
/* harmony export */ });
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56606);
/* __next_internal_client_entry_do_not_use__ useTheme auto */ 
function useTheme() {
    const { theme, setTheme, ...rest } = (0,next_themes__WEBPACK_IMPORTED_MODULE_0__/* .useTheme */ .F)();
    const toggleTheme = ()=>{
        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    };
    return {
        theme,
        toggleTheme,
        ...rest
    };
}


/***/ }),

/***/ 23095:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cn: () => (/* binding */ cn)
/* harmony export */ });
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2135);
/* harmony import */ var tailwind_merge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56497);


function cn(...inputs) {
    return (0,tailwind_merge__WEBPACK_IMPORTED_MODULE_0__/* .twMerge */ .m)((0,clsx__WEBPACK_IMPORTED_MODULE_1__/* .clsx */ .W)(inputs));
}


/***/ }),

/***/ 16110:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NotFound)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76931);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_animated_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(36387);
/* harmony import */ var _components_ui_link_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(72043);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15646);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(30073);
/* __next_internal_client_entry_do_not_use__ default auto */ 



function NotFound() {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("main", {
        className: "container py-40 md:py-80",
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_3__/* .motion */ .E.article, {
            variants: {
                hidden: {
                    transition: {
                        staggerChildren: 0.25,
                        delayChildren: 0.25
                    }
                },
                visible: {
                    transition: {
                        staggerChildren: 0.25,
                        delayChildren: 0.25
                    }
                }
            },
            initial: "hidden",
            whileInView: "visible",
            exit: "hidden",
            viewport: {
                once: true
            },
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(framer_motion__WEBPACK_IMPORTED_MODULE_4__/* .AnimatePresence */ .M, {
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_animated_text__WEBPACK_IMPORTED_MODULE_1__/* .AnimatedLetters */ .Gt, {
                        as: "h2",
                        text: "That's awkward... I couldn't find that page.",
                        className: "text-4xl font-medium lg:text-5xl",
                        textVariants: {
                            hidden: {
                                transition: {
                                    staggerChildren: 0.015
                                }
                            },
                            visible: {
                                transition: {
                                    staggerChildren: 0.015
                                }
                            }
                        },
                        letterVariants: {
                            hidden: {
                                opacity: 0,
                                y: 75
                            },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    ease: [
                                        0.455,
                                        0.03,
                                        0.515,
                                        0.955
                                    ],
                                    duration: 0.5
                                }
                            }
                        }
                    }, "title"),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_animated_text__WEBPACK_IMPORTED_MODULE_1__/* .AnimatedText */ .V0, {
                        as: "p",
                        className: "mt-6 text-lg font-light leading-relaxed text-dark-400 dark:text-dark-200 md:w-3/5",
                        text: "Maybe this page used to exist, is under development or maybe you typed in the wrong URL. Either way, I'm sorry for the inconvenience."
                    }, "text"),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ui_link_button__WEBPACK_IMPORTED_MODULE_2__/* .MotionLinkButton */ .G, {
                        href: "/",
                        motionProps: {
                            variants: {
                                hidden: {
                                    opacity: 0,
                                    y: 50
                                },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        ease: "circOut",
                                        duration: 0.5
                                    }
                                }
                            }
                        },
                        className: "mt-8 inline-block md:mt-12",
                        children: "Go back home"
                    })
                ]
            })
        })
    });
}


/***/ }),

/***/ 61166:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Providers: () => (/* binding */ Providers)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76931);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(56606);
/* __next_internal_client_entry_do_not_use__ Providers auto */ 

function Providers({ children }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_themes__WEBPACK_IMPORTED_MODULE_1__/* .ThemeProvider */ .f, {
        defaultTheme: "dark",
        enableSystem: true,
        disableTransitionOnChange: true,
        attribute: "class",
        children: children
    });
}


/***/ }),

/***/ 50872:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RootLayout),
  metadata: () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react-experimental/jsx-runtime"
var jsx_runtime_ = __webpack_require__(76931);
// EXTERNAL MODULE: ./node_modules/.pnpm/@vercel+analytics@1.3.1_next@13.4.12_react@18.2.0/node_modules/@vercel/analytics/dist/react/index.mjs
var react = __webpack_require__(15309);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@13.4.12_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(37371);
;// CONCATENATED MODULE: ./app/components/footer/footer.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/Users/larryly/Code/zips_git-repos/portfolio-maximus-reset/app/components/footer/footer.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;

const e0 = proxy["Footer"];

;// CONCATENATED MODULE: ./app/components/footer/footer.motion.ts
const footerVariants = {
    visible: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.5
        }
    }
};
const footerItemVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeInOut"
        }
    }
};

;// CONCATENATED MODULE: ./app/components/footer/index.ts



;// CONCATENATED MODULE: ./app/components/mobile-navigation.tsx

const mobile_navigation_proxy = (0,module_proxy.createProxy)(String.raw`/Users/larryly/Code/zips_git-repos/portfolio-maximus-reset/app/components/mobile-navigation.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: mobile_navigation_esModule, $$typeof: mobile_navigation_$$typeof } = mobile_navigation_proxy;
const mobile_navigation_default_ = mobile_navigation_proxy.default;

const mobile_navigation_e0 = mobile_navigation_proxy["MobileNav"];

;// CONCATENATED MODULE: ./app/components/navigation/navigation.tsx

const navigation_proxy = (0,module_proxy.createProxy)(String.raw`/Users/larryly/Code/zips_git-repos/portfolio-maximus-reset/app/components/navigation/navigation.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: navigation_esModule, $$typeof: navigation_$$typeof } = navigation_proxy;
const navigation_default_ = navigation_proxy.default;

const navigation_e0 = navigation_proxy["Navigation"];

;// CONCATENATED MODULE: ./app/components/navigation/navigation.motion.ts
const navVariants = {
    visible: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 1
        }
    }
};
const linkVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeInOut"
        }
    }
};

;// CONCATENATED MODULE: ./app/components/navigation/index.ts



// EXTERNAL MODULE: ./app/globals.css
var globals = __webpack_require__(16579);
;// CONCATENATED MODULE: ./app/providers.tsx

const providers_proxy = (0,module_proxy.createProxy)(String.raw`/Users/larryly/Code/zips_git-repos/portfolio-maximus-reset/app/providers.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: providers_esModule, $$typeof: providers_$$typeof } = providers_proxy;
const providers_default_ = providers_proxy.default;

const providers_e0 = providers_proxy["Providers"];

;// CONCATENATED MODULE: ./app/components/ui/floating-dock.tsx

const floating_dock_proxy = (0,module_proxy.createProxy)(String.raw`/Users/larryly/Code/zips_git-repos/portfolio-maximus-reset/app/components/ui/floating-dock.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: floating_dock_esModule, $$typeof: floating_dock_$$typeof } = floating_dock_proxy;
const floating_dock_default_ = floating_dock_proxy.default;

const floating_dock_e0 = floating_dock_proxy["FloatingDock"];

// EXTERNAL MODULE: ./node_modules/.pnpm/@tabler+icons-react@3.16.0_react@18.2.0/node_modules/@tabler/icons-react/dist/cjs/tabler-icons-react.cjs
var tabler_icons_react = __webpack_require__(69927);
// EXTERNAL MODULE: ./node_modules/.pnpm/@radix-ui+react-icons@1.3.0_react@18.2.0/node_modules/@radix-ui/react-icons/dist/react-icons.cjs.production.min.js
var react_icons_cjs_production_min = __webpack_require__(43559);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@0.439.0_react@18.2.0/node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(11235);
;// CONCATENATED MODULE: ./app/components/FloatingDock.tsx





function FloatingNavDock() {
    const links = [
        {
            title: "Home",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(tabler_icons_react/* IconHome */.A2c, {
                className: "h-full w-full text-neutral-500 dark:text-neutral-300"
            }),
            href: "/#"
        },
        {
            title: "Applications",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* GalleryThumbnails */.EZZ, {
                className: "h-full w-full text-neutral-500 dark:text-neutral-300"
            }),
            href: "/#applications"
        },
        {
            title: "Resume",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* SquareUser */.UKF, {
                className: "h-full w-full text-neutral-500 dark:text-neutral-300"
            }),
            href: "/#resume"
        },
        {
            title: "Check Marks",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* TrophyIcon */.rm8, {
                className: "h-full w-full text-neutral-500 dark:text-neutral-300"
            }),
            href: "#checkmarks"
        },
        {
            title: "LinkedIn",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(react_icons_cjs_production_min/* LinkedInLogoIcon */.ipJ, {
                className: "h-full w-full text-neutral-500 dark:text-neutral-300"
            }),
            href: "https://www.linkedin.com/in/larry-ly/"
        },
        {
            title: "GitHub",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(tabler_icons_react/* IconBrandGithub */.oBr, {
                className: "h-full w-full text-neutral-500 dark:text-neutral-300"
            }),
            href: "https://github.com/Lit2L"
        }
    ];
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: "flex items-center justify-center h-[5rem] fixed bottom-36 w-full",
        children: /*#__PURE__*/ jsx_runtime_.jsx(floating_dock_e0, {
            mobileClassName: "translate-y-20" // only for demo, remove for production
            ,
            items: links
        })
    });
}

;// CONCATENATED MODULE: ./app/components/Hydrate.tsx

const Hydrate_proxy = (0,module_proxy.createProxy)(String.raw`/Users/larryly/Code/zips_git-repos/portfolio-maximus-reset/app/components/Hydrate.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: Hydrate_esModule, $$typeof: Hydrate_$$typeof } = Hydrate_proxy;
const Hydrate_default_ = Hydrate_proxy.default;


/* harmony default export */ const Hydrate = (Hydrate_default_);
;// CONCATENATED MODULE: ./app/components/TailwindIndicator.tsx

function TailwindIndicator() {
    if (true) return null;
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "block sm:hidden",
                children: "xs"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "hidden sm:block md:hidden",
                children: "sm"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "hidden md:block lg:hidden",
                children: "md"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "hidden lg:block xl:hidden",
                children: "lg"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "hidden xl:block 2xl:hidden",
                children: "xl"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "hidden 2xl:block",
                children: "2xl"
            })
        ]
    });
}

;// CONCATENATED MODULE: ./app/layout.tsx










const metadata = {
    title: "Larry Ly - Frontend developer",
    description: `I'm a self-taught designer & frontend developer, focused on user experience, accessibility and modern web technologies.`
};
function RootLayout({ children }) {
    return /*#__PURE__*/ jsx_runtime_.jsx("html", {
        lang: "en",
        className: "",
        suppressHydrationWarning: true,
        children: /*#__PURE__*/ jsx_runtime_.jsx(Hydrate, {
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(providers_e0, {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(navigation_e0, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx(mobile_navigation_e0, {}),
                    children,
                    /*#__PURE__*/ jsx_runtime_.jsx(FloatingNavDock, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx(TailwindIndicator, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx(react/* Analytics */.c, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx(e0, {})
                ]
            })
        })
    });
}


/***/ }),

/***/ 54168:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $$typeof: () => (/* binding */ $$typeof),
/* harmony export */   __esModule: () => (/* binding */ __esModule),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37371);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`/Users/larryly/Code/zips_git-repos/portfolio-maximus-reset/app/not-found.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__default__);

/***/ }),

/***/ 60683:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"src":"/_next/static/media/LarryLogo.99bc0292.png","height":368,"width":382,"blurDataURL":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAMAAADz0U65AAAAGFBMVEX///////////////////////////////8pK8DIAAAACHRSTlMbASY4El5Cla79t+YAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAxSURBVHicNYtBCsBADIR0Jrv9/49LCr0JKmqiIoUi01QLcJ6RfHAXpjl3ldNk439/ARDqAH4avL6iAAAAAElFTkSuQmCC","blurWidth":8,"blurHeight":8});

/***/ }),

/***/ 87004:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(50538);
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__);
  

  /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((props) => {
    const imageData = {"type":"image/svg+xml","sizes":"any"}
    const imageUrl = (0,next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__.fillMetadataSegment)(".", props.params, "icon.svg")

    return [{
      ...imageData,
      url: imageUrl + "?d2fed497c5b2cac6",
    }]
  });

/***/ }),

/***/ 16579:
/***/ (() => {



/***/ })

};
;