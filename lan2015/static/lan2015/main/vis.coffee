window.stammlan ?= {}

BAR_SPACING = 2

window.stammlan.Vis = class Vis
    canvas: null

    constructor: (canvas) ->
        @canvas = canvas

    update: (bars) ->
        cx = @canvas.getContext("2d");
        cx.scale(1.0, 1.0);
        width = @canvas.offsetWidth
        height = @canvas.offsetHeight
        #@canvas.setCoordinateSpaceWidth width
        #@canvas.setCoordinateSpaceHeight height

        barWidth = (width / bars.length) - BAR_SPACING # 4px space between bars

        # clear background
        
        cx.fillStyle = "rgba(200,200,200,1)"
        cx.clearRect 0, 0, width, height

        cx.fillStyle = "#000000"
        cx.strokeStyle = "#000000"

        for i in [0...bars.length]
            grey = 20 + (120 * (i / bars.length))
            # draw bars
            barHeight = (height * 0.625 * (bars[i] / 40.0))
            x = (barWidth + BAR_SPACING) * i
            y = (height * 0.625) - barHeight

            cx.beginPath()
            cx.moveTo x, y + barHeight
            cx.lineTo x + barWidth, y + barHeight
            cx.stroke()
            cx.fillStyle = "rgb(" + grey + "," + grey + "," + grey + ")"
            cx.fillRect x, y, barWidth, barHeight
            cx.globalAlpha = 0.5
            cx.fillRect x, (height * 0.625) - 1, barWidth, barHeight * 0.625
            cx.globalAlpha = 1.0
