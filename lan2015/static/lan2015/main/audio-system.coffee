window.stammlan ?= {}

FFT_SIZE = 1024

VIS_FPS = 30
VIS_BARS = 30
VIS_DELAY = 2
VIS_FALLOFF = 2

window.stammlan.AudioSystem = class AudioSystem
    context: null
    sourceNode: null
    analyzerNode: null

    scale: null

    visLeftChannel: undefined
    visRightChannel: undefined

    connected: false
    visTimer: null

    bars: []
    delay: []

    fft: null

    listeners: []

    constructor: ->
        @context = new AudioContext()
        @fft = new stammlan.FFT()
        for i in [0...VIS_BARS]
            @bars.push(0)
            @delay.push(0)

        @calculateScale()

    setup: (element, context, source) ->
        if context
            @context = context;
        if source
            @sourceNode = source
        else
            @sourceNode = @context.createMediaElementSource(element)
            @sourceNode.connect @context.destination

        @analyzerNode = @context.createScriptProcessor(FFT_SIZE)

        @sourceNode.connect @analyzerNode
        @analyzerNode.connect @context.destination

        @analyzerNode.onaudioprocess = (event) =>
            @visLeftChannel = event.inputBuffer.getChannelData 0
            @visRightChannel = event.inputBuffer.getChannelData 1
           # console.log "inputBuffer" + event.inputBuffer.getChannelData(0)[0]
        @connected = true

    disconnect: ->
        if @connected
            @sourceNode.disconnect()
            @analyzerNode.disconnect()
            # make sure the old analyser node does not collect data anymore
            @analyzerNode.onaudioprocess = undefined;
            @visLeftChannel = undefined
            @visRightChannel = undefined

            @connected = false

    startVis: ->
        @visTimer = setInterval ( => @updateVis() ), 1000 / VIS_FPS

    stopVis: ->
        if @visTimer
            clearInterval @visTimer

    updateVis: ->
        visData = new Array(FFT_SIZE);
    #    console.log "visLeft: " + @visLeftChannel + " visRight: " + @visRightChannel

        # collect data and convert to mono
        for i in [0...FFT_SIZE]
            if (@visLeftChannel && @visRightChannel)
                visData[i] = (@visLeftChannel[i] + @visRightChannel[i])  / 2.0

        #console.log visData
        fftData = @fft.calcFreq visData

        @formatVis fftData

        #console.log(@bars)
        #for i in [0...fftData.length]
        #    fftData[i] = 1100 * fftData[i]
        for listener in @listeners
            listener @bars

    formatVis: (fftData) ->
        for i in [0...VIS_BARS]
            a = Math.ceil(@scale[i]);
            b = Math.floor(@scale[i+1]);
            n = 0

            if (b < a)
                n += fftData[b] * (@scale[i + 1] - @scale[i])

            else
                if (a > 0)
                    n += fftData[a - 1] * (a - @scale[i])
                while (a < b)
                    n += fftData[a]
                    a++
                if (b < (FFT_SIZE / 2))
                    n += fftData[b] * (@scale[i + 1] - b)

            if n == 0
                x = 0

            else
                # 40dB range
                x = 40 + 20 * Math.log10(n);
                #x = 20 * Math.log10(n * 100);
                #x = 50 * Math.log10(n * 200);
                #x = (Math.pow(255, n / 255)) - 1;
                #x = 127 * (Math.log(n) / Math.log(127));

            x = Math.max(0, Math.min(x, 40));

            @bars[i] -= Math.max(0, VIS_FALLOFF - @delay[i]);
            if @bars[i] < 0
                @bars[i] = 0
            if @delay[i] > 0
                @delay[i] -= 1
            if (x > @bars[i])
                @bars[i] = x;
                @delay[i] = VIS_DELAY;

    calculateScale: ->
        # calculate logarithmic scale - 0.5
        @scale = []
        for i in [0..VIS_BARS]
            @scale.push Math.pow(FFT_SIZE / 2, i / VIS_BARS) - 0.5
        #console.log "calculated logarithmic scale: " + @scale

    addListener: (listener) ->
        @listeners.push(listener)
