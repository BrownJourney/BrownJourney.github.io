function main() {
    const popup = $("#popup")

    function isZooming(){
        const width = document.documentElement.clientWidth
        const zoomScale = width / 2560

        console.log($(window).outerWidth())
        if ($(window).outerWidth() <= 1000) {
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

    $(".projects__item").on("click", () => {
        popup.addClass("--active")
    })

    $("#popup-close").on("click", () => {
        popup.removeClass("--active")
    })
}

jQuery(() => {
    main()
})