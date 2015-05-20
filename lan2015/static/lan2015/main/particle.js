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
      if (now <= this.creationTime) {
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

    ParticleEffect.prototype.mouseDown = false;

    ParticleEffect.prototype.lastUpdate = null;

    function ParticleEffect(target) {
      this.target = target;
      this.pos = null;
      this.lastPos = null;
      this.particles = [];
      this.stickyParticles = [];
      target.addEventListener("mousedown", ((function(_this) {
        return function(e) {
          return _this.onMouseDown(e);
        };
      })(this)));
      target.addEventListener("mouseup", ((function(_this) {
        return function(e) {
          return _this.onMouseUp(e);
        };
      })(this)));
      target.addEventListener("mouseout", ((function(_this) {
        return function(e) {
          return _this.onMouseUp(e);
        };
      })(this)));
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

    ParticleEffect.prototype.onMouseDown = function(e) {
      return this.mouseDown = true;
    };

    ParticleEffect.prototype.onMouseUp = function(e) {
      var i, _i, _ref, _results;
      this.mouseDown = false;
      _results = [];
      for (i = _i = 0, _ref = this.stickyParticles.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.stickyParticles[i].creationTime = Date.now() + i * 2);
      }
      return _results;
    };

    ParticleEffect.prototype.updateMouse = function(event) {
      var rect;
      rect = this.target.getBoundingClientRect();
      return this.pos = {
        x: event.pageX - rect.left,
        y: event.pageY - rect.top
      };
    };

    ParticleEffect.prototype.animate = function() {
      var ctx, i, now, p, particle, rect, speed, speedX, speedY, x, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _n, _ref, _ref1, _ref2, _ref3;
      now = Date.now();
      if (this.pos == null) {
        window.requestAnimationFrame(((function(_this) {
          return function() {
            return _this.animate();
          };
        })(this)));
        return;
      }
      if (this.lastPos == null) {
        this.lastPos = this.pos;
        window.requestAnimationFrame(((function(_this) {
          return function() {
            return _this.animate();
          };
        })(this)));
        return;
      }
      if (this.lastUpdate == null) {
        this.lastUpdate = now;
        window.requestAnimationFrame(((function(_this) {
          return function() {
            return _this.animate();
          };
        })(this)));
        return;
      }
      speed = {
        x: (this.pos.x - this.lastPos.x) / ((now - this.lastUpdate) / 1000),
        y: (this.pos.y - this.lastPos.y) / ((now - this.lastUpdate) / 1000)
      };
      this.lastPos = this.pos;
      rect = this.target.getBoundingClientRect();
      this.target.width = rect.width;
      this.target.height = rect.height;
      ctx = this.target.getContext('2d');
      if (Math.abs(speed.x) > 0 || Math.abs(speed.y) > 0) {
        for (i = _i = 0; _i < 4; i = ++_i) {
          speedX = Math.abs(speed.x) / 200 + 2.0 * Math.random();
          speedY = speed.y / 200 + -2.0 + 4.0 * Math.random();
          this.particles.push(new Particle({
            x: this.pos.x,
            y: this.pos.y
          }, {
            x: speedX,
            y: speedY
          }, speed.x < 0));
        }
        if (this.mouseDown) {
          for (i = _j = 0; _j < 4; i = ++_j) {
            x = this.pos.x - 10.0 + 10.0 * Math.random();
            y = this.pos.y - 10.0 + 10.0 * Math.random();
            this.stickyParticles.push(new Particle({
              x: x,
              y: y
            }, {
              x: 0,
              y: 0
            }, false));
          }
        }
      }
      _ref = this.particles;
      for (_k = 0, _len = _ref.length; _k < _len; _k++) {
        particle = _ref[_k];
        particle.update();
      }
      if (!this.mouseDown) {
        _ref1 = this.stickyParticles;
        for (_l = 0, _len1 = _ref1.length; _l < _len1; _l++) {
          particle = _ref1[_l];
          particle.update();
        }
      }
      this.particles = this.particles.filter(function(p) {
        return p.opacity > 0;
      });
      this.stickyParticles = this.stickyParticles.filter(function(p) {
        return p.opacity > 0;
      });
      ctx.clearRect(0, 0, rect.width, rect.height);
      _ref2 = this.particles;
      for (_m = 0, _len2 = _ref2.length; _m < _len2; _m++) {
        p = _ref2[_m];
        ctx.fillStyle = "rgba(255,255,255, " + p.opacity + ")";
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      _ref3 = this.stickyParticles;
      for (_n = 0, _len3 = _ref3.length; _n < _len3; _n++) {
        p = _ref3[_n];
        ctx.fillStyle = "rgba(171, 215, 229, " + p.opacity + ")";
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      this.lastUpdate = now;
      return window.requestAnimationFrame(((function(_this) {
        return function() {
          return _this.animate();
        };
      })(this)));
    };

    return ParticleEffect;

  })();

}).call(this);

//# sourceMappingURL=particle.js.map
