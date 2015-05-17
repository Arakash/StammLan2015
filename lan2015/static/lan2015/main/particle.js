// Generated by CoffeeScript 1.8.0
(function() {
  var Particle, ParticleEffect;

  if (window.stammlan == null) {
    window.stammlan = {};
  }

  Particle = (function() {
    Particle.prototype.pos = null;

    Particle.prototype.speed = null;

    Particle.prototype.opacity = 1.0;

    Particle.prototype.lastUpdate = null;

    Particle.prototype.inverseX = false;

    function Particle(pos, speed, inverse) {
      this.pos = pos;
      this.speed = speed;
      this.creationTime = Date.now();
      this.inverseX = inverse;
    }

    Particle.prototype.update = function() {
      var now;
      now = Date.now();
      if (now === this.creationTime) {
        return;
      }
      this.opacity = 1.0 - 1.0 * ((now - this.creationTime) / 500);
      this.speed.x -= 0.5 * ((now - this.creationTime) / 1000);
      this.speed.y += 1.0 * ((now - this.creationTime) / 2000);
      if (this.opacity < 0) {
        this.opacity = 0.0;
      }
      if (this.speed.x < 0) {
        this.speed.x = 0.0;
      }
      if (this.inverseX) {
        this.pos.x -= this.speed.x;
      } else {
        this.pos.x += this.speed.x;
      }
      return this.pos.y += this.speed.y;
    };

    return Particle;

  })();

  window.stammlan.ParticleEffect = ParticleEffect = (function() {
    ParticleEffect.prototype.target = null;

    ParticleEffect.prototype.particles = null;

    ParticleEffect.prototype.pos = null;

    ParticleEffect.prototype.speed = null;

    ParticleEffect.prototype.lastUpdate = null;

    function ParticleEffect(target) {
      console.log(target);
      this.target = target;
      this.pos = {
        x: 0,
        y: 0
      };
      this.speed = {
        x: 0,
        y: 0
      };
      this.particles = [];
      target.addEventListener("mousemove", ((function(_this) {
        return function(e) {
          return _this.updateMouse(e);
        };
      })(this)));
      window.requestAnimationFrame(((function(_this) {
        return function() {
          return _this.animate();
        };
      })(this)));
    }

    ParticleEffect.prototype.updateMouse = function(event) {
      var now, rect;
      rect = this.target.getBoundingClientRect();
      if (this.lastUpdate != null) {
        now = Date.now();
        if (now === this.lastUpdate) {
          return;
        }
        this.speed.x = (event.pageX - rect.left - this.pos.x) / ((now - this.lastUpdate) / 1000);
        this.speed.y = (event.pageY - rect.top - this.pos.y) / ((now - this.lastUpdate) / 1000);
        this.pos.x = event.pageX - rect.left;
        return this.pos.y = event.pageY - rect.top;
      } else {
        this.pos.x = event.pageX - rect.left;
        this.pos.y = event.pageY - rect.top;
        this.speed.x = 0;
        this.speed.y = 0;
        return this.lastUpdate = Date.now();
      }
    };

    ParticleEffect.prototype.animate = function() {
      var ctx, i, p, particle, rect, speedX, speedY, _i, _j, _k, _len, _len1, _ref, _ref1;
      rect = this.target.getBoundingClientRect();
      this.target.width = rect.width;
      this.target.height = rect.height;
      ctx = this.target.getContext('2d');
      if (Math.abs(this.speed.x) > 0 || Math.abs(this.speed.y) > 0) {
        for (i = _i = 0; _i < 4; i = ++_i) {
          speedX = Math.abs(this.speed.x) * 4 + 1.0 * Math.random();
          speedY = this.speed.y * 4 + 1.0 * Math.random();
          this.particles.push(new Particle({
            x: this.pos.x,
            y: this.pos.y
          }, {
            x: speedX,
            y: speedY
          }, this.speed.x < 0));
        }
      }
      _ref = this.particles;
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        particle = _ref[_j];
        particle.update();
      }
      this.particles = this.particles.filter(function(p) {
        return p.opacity > 0;
      });
      ctx.clearRect(0, 0, rect.width, rect.height);
      _ref1 = this.particles;
      for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
        p = _ref1[_k];
        ctx.fillStyle = "rgba(255,255,255, " + p.opacity + ")";
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      window.requestAnimationFrame(((function(_this) {
        return function() {
          return _this.animate();
        };
      })(this)));
      this.speed.x = 0;
      return this.speed.y = 0;
    };

    return ParticleEffect;

  })();

}).call(this);

//# sourceMappingURL=particle.js.map
