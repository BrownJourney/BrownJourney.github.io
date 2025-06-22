function main() {
    const popup = $("#popup")

    function isZooming(){
        const zoomScale = document.documentElement.clientWidth / 2560
        $("body").css("zoom", zoomScale)
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