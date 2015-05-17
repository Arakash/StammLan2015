window.stammlan ?= {}

class Particle
    pos: null
    speed: null
    opacity: 1.0
    lastUpdate: null
    inverseX: false
        
    constructor: (pos, speed, inverse) ->
        @pos = pos
        @speed = speed
        @creationTime = Date.now()
        @inverseX = inverse
    
    update: ->
        now = Date.now()
        if now == @creationTime
            return
        @opacity = 1.0 - 1.0 * ((now - @creationTime) / 500)
        @speed.x -= 0.5 * ((now - @creationTime) / 1000)
        @speed.y += 1.0 * ((now - @creationTime) / 2000)
        
        if @opacity < 0
            @opacity = 0.0
        if @speed.x < 0
            @speed.x = 0.0
            
        if @inverseX
            @pos.x -= @speed.x
        else
            @pos.x += @speed.x
        @pos.y += @speed.y
        
        #console.log "opacity: #{@opacity} pos: (#{@pos.x}, #{@pos.y})"
        

window.stammlan.ParticleEffect = class ParticleEffect
    target: null
    particles: null
    
    pos: null
    speed: null
        
    lastUpdate: null
    
    constructor: (target) ->
        console.log target
        @target = target
        @pos = {x: 0, y : 0}
        @speed = {x:0, y : 0}
        @particles = []
        
        target.addEventListener "mousemove", ( (e) => @updateMouse(e))
        
        window.requestAnimationFrame ( => @animate())
        
    updateMouse: (event) ->
        rect = @target.getBoundingClientRect()
        if @lastUpdate?
            now = Date.now()
            if now == @lastUpdate
                return
            @speed.x = (event.pageX  - rect.left - @pos.x) / ((now - @lastUpdate) / 1000)
            @speed.y = (event.pageY - rect.top - @pos.y) / ((now - @lastUpdate) / 1000)
            @pos.x = event.pageX - rect.left
            @pos.y = event.pageY - rect.top
        else     
            @pos.x = event.pageX - rect.left
            @pos.y = event.pageY - rect.top
            @speed.x = 0
            @speed.y = 0
            @lastUpdate = Date.now()
            
        #console.log "pointer pos(#{@pos.x}, #{@pos.y}) speed(#{@speed.x}, #{@speed.y})"
        
    animate: ->
        #console.log "animate"
        # create 10 new particles
        rect = @target.getBoundingClientRect()
        @target.width = rect.width
        @target.height = rect.height
        ctx = @target.getContext('2d')
        
        if Math.abs(@speed.x) > 0 or Math.abs(@speed.y) > 0
            for i in [0...4]
                speedX = Math.abs(@speed.x) * 4 + 1.0 * Math.random()
                speedY = @speed.y * 4 + 1.0 * Math.random()
                
                @particles.push new Particle({x: @pos.x, y: @pos.y}, {x: speedX, y: speedY}, (@speed.x < 0))
        
        for particle in @particles
            particle.update()
            
        @particles = @particles.filter (p) -> (p.opacity > 0)
        
        #console.log @particles
        
        ctx.clearRect 0, 0, rect.width, rect.height
        for p in @particles
            ctx.fillStyle = "rgba(255,255,255, #{p.opacity})"
            ctx.beginPath()
            ctx.arc p.pos.x, p.pos.y, 2, 0, 2 * Math.PI
            ctx.fill()
            #console.log "draw particle at (#{p.pos.x}, #{p.pos.y})"
        
        window.requestAnimationFrame ( => @animate())
        
        @speed.x = 0
        @speed.y = 0