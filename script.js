// Open hours
//
// Show / hide open hours tooltip
let openHours_isActive = false;

document.addEventListener('click', function(event) {
    const openHours_button = document.getElementsByClassName('open')[0]; 
    const openHours = document.getElementsByClassName('open_hours')[0];

    const pressed_tooltipButton = openHours_button.contains(event.target);
    const pressed_openHours = openHours.contains(event.target);

    // Hides / shows the open hours tooltip
    if ( pressed_tooltipButton && !openHours_isActive || pressed_openHours) {
        openHours.style.visibility = "visible";
        openHours.style.opacity = "1";
        openHours_isActive = true;          
    } else {
        openHours_isActive = false;
        openHours.style.opacity = "0";
        openHours.style.visibility = "hidden";          
    }
});

// Mobile navigation
//
// Show / hide mobile navigation
let menu_isActive = false;
document.addEventListener('click', function(event) {
    if ( device_type == "desktop") {
        return;
    }
    const header = document.getElementsByTagName("header")[0];
    const hamburger = document.getElementsByClassName('hamburger')[0]; 
    const menu = document.getElementsByClassName('header_menu')[0];
    const shadow = document.getElementsByClassName('shadow')[0];

    // Displays custom navbar height to match the position of the banner
    if (window.scrollY < 190 ) {
        menu.style.height = `calc(100vh - ${header.offsetTop - window.scrollY}px)`;
    } else {
        menu.style.height = `100vh`;
    }
    const pressed_hamburger = hamburger.contains(event.target);
    const pressed_menu = menu.contains(event.target);
    const pressed_shadow  = shadow.contains(event.target);

    // Hides / shows the navbar
    if ( (pressed_hamburger && !menu_isActive || pressed_menu )&& !pressed_shadow) {
        menu_isActive = true;          
        menu.style.visibility = "visible";
        menu.style.left = "0";
        document.getElementsByTagName('body')[0].style.height = "100vh";
        document.getElementsByTagName('body')[0].style.overflow = "hidden";
    } else {
        menu_isActive = false;
        menu.style.left = "-100vw";
        menu.style.visibility = "hidden";          
        document.getElementsByTagName('body')[0].style.height = "auto";
        document.getElementsByTagName('body')[0].style.overflow = "visible";
    }
});

// Menu roll
//
// Roll specific menus ( display pizza or hamburger menu etc.)

let activeMenu = [];
const menus = document.getElementsByClassName("menu_dropdown");
for (let i = 0; i < menus.length; i++) {
    document.getElementsByClassName('menu_title')[i].addEventListener('click', () => roll_menu(i));
}

function roll_menu(menu_id) {
    if ( device_type !== 'mobile') {
        return
    }
    // Close previous menu if opening a different one
    if ( activeMenu.includes(true) && activeMenu.indexOf(true) != menu_id) {
        const previousMenu = document.getElementsByClassName('menu_item_list')[activeMenu.indexOf(true)];
        document.getElementsByClassName('menu_dropdown')[activeMenu.indexOf(true)].classList.toggle("upside_down");
        activeMenu[activeMenu.indexOf(true)] = false;
        previousMenu.classList.toggle('fast-transition');
        previousMenu.style.visibility = "hidden";
        previousMenu.style.overflow = "hidden";
        previousMenu.style.height = `0px`;
        setTimeout(() => {
            previousMenu.classList.toggle('fast-transition');
        }, 150);

    }


    const menu = document.getElementsByClassName('menu_item_list')[menu_id];
    // Calculate the height of all child items for proper transition animation

    let totalHeight = 0;
    for (let p = 0; p < menu.childNodes.length; p++) {
        if ( !isNaN(menu.childNodes[p].offsetHeight) )
        totalHeight += menu.childNodes[p].offsetHeight + 14.4; // 14.4 to compensate for i don't really know what, couldn't figure it out.
    }

    if ( activeMenu[menu_id] != true ) {
        // Open menu
        activeMenu[menu_id] = true;
        menu.style.visibility = "visible";
        menu.style.height = `${totalHeight}px`;
        const menuTitle = document.getElementsByClassName('menu_title')[menu_id];
        document.getElementsByClassName('menu_dropdown')[menu_id].classList.toggle("upside_down");

        setTimeout(() => {
        window.scrollTo({top: menuTitle.offsetTop - 95, behavior: 'smooth'});
        }, 150);

        setTimeout(() => {
            menu.style.overflow = `visible`;
        }, 400);
 
    } else {
        // Close menu

        // window.scroll({
        //     top: 0,
        //     left: 0,
        //     behavior: 'auto'
        //   });

        activeMenu[menu_id] = false;
        menu.style.visibility = "hidden";
        menu.style.height = `0px`; 
        menu.style.overflow = `hidden`;
        document.getElementsByClassName('menu_dropdown')[menu_id].classList.toggle("upside_down");
    }
}

// Tooltip
//
// Display item description ( tooltip )
let menu_items = document.getElementsByClassName('menu_item');
for (let i = 0; i < menu_items.length; i++) {
    document.getElementsByClassName('menu_item')[i].addEventListener('click', () => description_show(event, i));
}

let previous_description;
let description_active = false;

function description_show(event, item_id) {
    if ( description_active && (previous_description !== item_id)) {
        document.getElementsByClassName('menu_item_description')[previous_description].classList.toggle("description_visible");
        description_active = false;
    }

    // Prevents from showing the description tooltip if one of the following items 
    // has been pressed
    const dont_activate = ['menu_item_button','menu_item_size', 'menu_item_description'];
    if ( !dont_activate.includes(event.target.className)) {
        const description = document.getElementsByClassName('menu_item_description')[item_id];
        description.classList.toggle("description_visible");
        if ( description_active ) {
            description_active = false
        } else {
            description_active = true
        }
        previous_description = item_id;
    }
}

// Scroll behaviour
//
// Hide open hours tooltip and item description tooltip on scroll + (desktop only) change banner/nav logo 
document.addEventListener('scroll', function(event) {
    if ( description_active ) {
        const description = document.getElementsByClassName('menu_item_description')[previous_description];
        description.classList.remove("description_visible");
        description_active = false;
    }

    if ( openHours_isActive ) {
        const openHours = document.getElementsByClassName('open_hours')[0];
        openHours_isActive = false;
        openHours.style.opacity = "0";
        openHours.style.visibility = "hidden";  
    }
    banner_header_logo();
});

// Banner logo
//
// Displays the big banner logo when user is on the top of the page, changes it to smaller 
// one that fits inside the banner when not on the top of the page
function banner_header_logo() {
    const bannerLogo = document.getElementById('banner_logo');
    const headerLogo = document.getElementsByClassName('header-logo-desktop')[0];

    if ( device_type == 'desktop' && window.scrollY == 0) {
        bannerLogo.style.visiblity = "visible";
        bannerLogo.style.opacity = "1";
        headerLogo.style.visiblity = "hidden";
        headerLogo.style.opacity = "0";
    } else {
        headerLogo.style.visiblity = "visible";
        headerLogo.style.opacity = "1";
        bannerLogo.style.visiblity = "hidden";
        bannerLogo.style.opacity = "0";
    }
}


let device_type;
function resolution() {
    switch (true) {
        case window.matchMedia('(max-width: 767px)').matches:
            device_type = 'mobile';
            break;
        case window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches:
            device_type = 'tablet';
            break;
        case window.matchMedia('(min-width: 1024px)').matches:
            device_type = 'desktop';
            break;
        default:
            console.error(`Can't retrieve device resolution`);
            break;
  };
};

window.addEventListener("resize", resolution);
resolution();
banner_header_logo();




