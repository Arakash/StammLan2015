window.stammlan ?= {}

FFT_SIZE = 1024;                         #size of the DFT (fixed for now)
LOG = 10;                                # log(FFT_SIZE) (base 2)

window.stammlan.FFT = class FFT
    hamming: []       #hamming window, scaled to sum to 1
    reversed: []      #bit-reversal table
    roots: []         #N-th roots of unity

    fft: []

    constructor: ->
        # generate tables
        for n in [0...FFT_SIZE]
            @hamming.push 1 - 0.85 * Math.cos(2 * Math.PI * n / FFT_SIZE)

        for n in [0...FFT_SIZE]
            @reversed.push @bitReverse(n)

        for n in [0...FFT_SIZE/2]
            @roots.push math.exp(math.complex(0, 2 * Math.PI * n / FFT_SIZE))

        # initialize FFT array
        for n in [0...FFT_SIZE]
            @fft.push math.complex(0)

    # Input is N=512 PCM samples.
    # Output is intensity of frequencies from 1 to N/2=256.
    calcFreq: (data) ->
        freq = new Array(FFT_SIZE / 2);

        # input is filtered by a Hamming window
        # input values are in bit-reversed order
        for n in [0...FFT_SIZE]
            @fft[@reversed[n]].re = data[n] * @hamming[n];
            @fft[@reversed[n]].im = 0;

        @doFFT(@fft);

        # output values are divided by N
        # frequencies from 1 to N/2-1 are doubled
        for n in [1...FFT_SIZE / 2]
            freq[n-1] = 2 * math.abs(@fft[n]) / FFT_SIZE;

        #frequency N/2 is not doubled
        freq[FFT_SIZE / 2 - 1] = math.abs(@fft[FFT_SIZE / 2]) / FFT_SIZE;

        return freq;

    doFFT: (a) ->
        half = 1;                   # (2^s)/2
        inv = FFT_SIZE / 2;         # N/(2^s)

        #loop through steps
        while inv > 0
            #loop through groups
            g = 0
            while g < FFT_SIZE
                # loop through butterflies
                b = 0
                r = 0
                while (b < half)
                    even = math.complex(a[g + b])
                    odd = math.multiply(@roots[r], a[g + half + b])
                    a[g + b] = math.add(even, odd)
                    a[g + half + b] = math.subtract(even, odd)

                    b++
                    r += inv

                g += half << 1

            half <<= 1;
            inv >>= 1;

    #Reverse the order of the lowest LOG bits in an integer
    bitReverse: (x) ->
        y = 0

        for n in [LOG...0]
            y = (y << 1) | (x & 1)
            x >>= 1

        return y
