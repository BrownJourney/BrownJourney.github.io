function random(min, max) {
    return Math.random() * (max - min) + min;
}

$(document).ready(() => {
    const hookLinks = () => {
        $(".nav__link").on("click", function() {
            const section = $(this).attr("href").replace("#", "")
    
            const foundElement = $("section[link=" + section + "]")
            $(document.documentElement).animate({
                scrollTop: foundElement.offset().top - 60
            }, 500)
        })
    }

    const elements = $(".section, .portfolio, .container__text, .portfolio__header-title, .image-preview")

    elements.each(function() {
        $(this).css("opacity", "0")
    })
    
    $(".header").clone().appendTo("body")
    $(".header").last().addClass("header-fixed")
    hookLinks()

    const header = $(".header-fixed")
    const settings = $(".settings")
    const overlay = $(".overlay")
    
    settings.on("click", function() {
        overlay.addClass("overlay-show")
    })

    $(".setting__switch").on("click", function() {
        $("body").toggleClass("--dark-theme")
        $(".setting__switch-tracker").toggleClass("switch-state")
    })

    $(".overlay__footer-close").on("click", function() {
        overlay.removeClass("overlay-show")
    })

    const onScroll = () => {
        const scrollTop = $(window).scrollTop()
        if (scrollTop > 120) {
            header.addClass("header-move")
            settings.addClass("settings-move")
        } else {
            header.removeClass("header-move")
            settings.removeClass("settings-move")
        }

        elements.each(function() {
            const specialClass = $(this).attr("anim")

            if ($(this).hasClass("landing-showed") || $(this).hasClass(specialClass)) {
                return
            }

            if ((scrollTop + $(window).height() * 0.75) >= $(this).offset().top) {
                if (specialClass) {
                    $(this).addClass(specialClass)
                } else {
                    $(this).addClass("landing-showed")
                }
                $(this).animate({
                    opacity: 1,
                }, 250)
            }
        })
    }

    $(window).on("scroll", function() {
        onScroll()
    })
    $(window).on("touchmove", function() {
        onScroll()
    })

    const moveCircles = () => {
        $(".circle").each(function() {
            const position = $(this).offset()

            $(this).animate({top: (position.top + random(-100, 100)) + "px", left: (position.left + random(-50, 50) + "px")}, 10000)
        })
    }

    setInterval(() => {
        moveCircles()
    }, 7000)

    moveCircles()
    onScroll()
    
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    new MutationObserver(() => {
        $("[hint-text]").off("mouseenter")
        $("[hint-text]").off("mouseleave")

        $("[hint-text]").on("mouseenter", function() {
            const text = $(this).attr("hint-text")

            $(".hover-message").remove()

            $("body").append(`
                <div class="hover-message">${text}</div>
            `)

            const position = $(this).offset()
            const element = $(".hover-message")

            element.css("left", Math.min(Math.max(position.left - element.width() / 2 + $(this).width() / 2 - 5, 0), $(window).width() - element.width() - 10))
            element.css("top", position.top - element.height() - 20)
        })

        $("[hint-text]").on("mouseleave", function() {
            const element = $(".hover-message")
            element.css("animation", "disappear 0.25s ease")
            setTimeout(() => {
                element.remove()
            }, 250)
        })
    }).observe(document, {subtree: true, childList: true});
})