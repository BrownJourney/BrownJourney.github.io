function main() {
    const popup = $("#popup")

    function isZooming(){
        const width = document.documentElement.clientWidth
        const zoomScale = width / 2560

        console.log($(window).outerWidth())
        if ($(window).outerWidth() <= 1366) {
            $("body").css("zoom", "")
            return
        }

        $("body").css("zoom", `${zoomScale}`)
        if (popup.length > 0) {
            popup.css("height", ($(window).height() / zoomScale) + "px")
        }
    }

    $(window).on("resize", isZooming)
    isZooming()

    $(".projects__item[data-popup]").on("click", () => {
        popup.addClass("--active")
    })

    $(".case-video").each(function() {
        const element = $(this).parent(".case-image__wrapper").children(".case-image")
        const video =  $(this).children("video")
        video.attr("width", element.outerWidth() * 0.67)
        video.attr("height", element.outerHeight() * 1.11)
    })

    $("#popup-close").on("click", () => {
        popup.removeClass("--active")
    })

    $("video").each(function() {
        this.play().catch(err => {
            console.log(err)
        })
    })
}

jQuery(() => {
    main()
})