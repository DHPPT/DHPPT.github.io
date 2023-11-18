"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __pow = Math.pow;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };

  // src/AnimatorControl.ts
  var { regClass, property } = Laya;
  var AnimatorControl = class extends Laya.Script {
    constructor() {
      super();
    }
    onStart() {
      this._anim = this.owner.getComponent(Laya.Animator);
    }
    isPlayanimaByName(layerIndex = 0) {
      let layer = this._anim.getControllerLayer(layerIndex);
      if (layer == void 0) {
        return false;
      }
      let state = layer.getCurrentPlayState();
      if (state == void 0) {
        return false;
      }
      if (state.animatorState.clip.islooping) {
        return true;
      }
      return state._finish;
    }
    /**
     * 检查是否正在播放制动动画
     * @param	name 名字播放动画。
     */
    isSameByName(name, layerIndex = 0) {
      let layer = this._anim.getControllerLayer(layerIndex);
      if (layer == void 0) {
        return false;
      }
      let state = layer.getCurrentPlayState();
      if (state == void 0) {
        return false;
      }
      if (state.animatorState.name == name) {
        return true;
      }
    }
    /**
     * 播放动画。
     * @param	name 如果为null则播放默认动画，否则按名字播放动画片段。
     * @param	isForce 是否强制替换动作
     */
    playAnim(name, isForce = false) {
      if (isForce) {
        if (this.isSameByName(name)) {
          return;
        } else {
          this._anim.play(name, 0, 0);
        }
        return;
      }
      if (this.isPlayanimaByName()) {
        return;
      } else {
        this._anim.play(name, 0, 0);
      }
    }
  };
  AnimatorControl = __decorateClass([
    regClass("q0uAMn-DTUm70T4fGtxGlw")
  ], AnimatorControl);

  // src/components/CameraControll.ts
  var { regClass: regClass2, property: property2 } = Laya;
  var CameraControll = class extends Laya.Script {
    constructor() {
      super();
      this.distanceUp = 0.5;
      //相机与目标的竖直高度参数
      this.distanceAway = 10;
      //相机与目标的水平距离参数
      this.smooth = 2;
      //位置平滑移动插值参数值
      this.camDepthSmooth = 20;
    }
    /**
     * 组件被激活后执行，此时所有节点和组件均已创建完毕，次方法只执行一次
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onAwake() {
      this.curpos = new Laya.Vector3();
    }
    /**
     * 第一次执行update之前执行，只会执行一次
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onStart() {
      this.camera = this.owner;
      if (this.target) {
        this.target.transform.position.cloneTo(this.curpos);
        this.delatpos = new Laya.Vector3();
      }
    }
    /**
     * 每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onUpdate() {
      if (!this.target || !this.camera)
        return;
      this.target.transform.position.vsub(this.curpos, this.delatpos);
      this.camera.transform.position.vadd(this.delatpos, this.delatpos);
      this.camera.transform.position = this.delatpos;
      this.target.transform.position.cloneTo(this.curpos);
    }
  };
  __decorateClass([
    property2({ type: Laya.Sprite3D })
  ], CameraControll.prototype, "target", 2);
  CameraControll = __decorateClass([
    regClass2("m_MLD7poSNGNcVN-rmzq7A")
  ], CameraControll);

  // src/components/DirectMove.ts
  var { regClass: regClass3, property: property3 } = Laya;
  var DirectMove = class extends Laya.Script {
    constructor() {
      super();
      this.mspeed = 0.05;
    }
    /**
     * 组件被激活后执行，此时所有节点和组件均已创建完毕，次方法只执行一次
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onAwake() {
      console.log("Direct Start=============");
      this.target = this.owner;
      this.targetRig = this.target.getComponent(Laya.Rigidbody3D);
      this.forwardlenth = new Laya.Vector3();
    }
    /**
     * 每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onUpdate() {
      if (this.ismoveing) {
        var curpos = this.target.transform.position;
        curpos.vadd(this.forwardlenth, curpos);
        this.targetRig.isKinematic = true;
        this.target.transform.position = curpos;
        this.targetRig.isKinematic = false;
      }
    }
    directMove(angle = 0) {
      angle = angle - 180;
      if (this.m_camera) {
        angle = angle + this.m_camera.transform.localRotationEulerY;
      }
      this.target.transform.localRotationEulerY = angle;
      var forward = new Laya.Vector3();
      this.target.transform.getForward(forward);
      Laya.Vector3.normalize(forward, forward);
      Laya.Vector3.scale(forward, this.mspeed, this.forwardlenth);
      this.ismoveing = true;
      if (this.anim) {
        this.anim.playAnim("run", true);
      }
    }
    moveStop() {
      this.ismoveing = false;
      if (this.anim) {
        this.anim.playAnim("idle", true);
      }
    }
  };
  __decorateClass([
    property3({ type: Laya.Camera })
  ], DirectMove.prototype, "m_camera", 2);
  __decorateClass([
    property3({ type: "number" })
  ], DirectMove.prototype, "mspeed", 2);
  __decorateClass([
    property3({ type: AnimatorControl })
  ], DirectMove.prototype, "anim", 2);
  DirectMove = __decorateClass([
    regClass3("-TPsukOSSJurYXlQ7iE3dg")
  ], DirectMove);

  // src/components/Roker.ts
  var { regClass: regClass4, property: property4 } = Laya;
  var Script = class extends Laya.Script {
    constructor() {
      super(...arguments);
      this.target = null;
      // 设置私有属性变量
      this.directComponent = null;
      this.currRockerBar = null;
      this.maxDistance = 100;
      this.isMouseDown = false;
      this.mouseDownPosition = new Laya.Point();
      this._currentMouse = new Laya.Point();
      this.initRockerBarPosition = new Laya.Point();
    }
    onStart() {
      this.currRockerBar = this.owner.getChildByName("freebar");
      this.initialise();
      if (this.target) {
        this.directComponent = this.target.getComponent(DirectMove);
      }
    }
    // 事件和初始状态的初始化
    initialise() {
      this.initRockerBarPosition.setTo(this.currRockerBar.x, this.currRockerBar.y);
      this.currRockerBar.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
      Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
      Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    }
    // 处理鼠标按下事件
    onMouseDown(e) {
      e.stopPropagation();
      this.isMouseDown = true;
      this.currRockerBar.selected = true;
      this.mouseDownPosition.setTo(this.owner.mouseX, this.owner.mouseY);
    }
    // 处理鼠标抬起事件
    onMouseUp(e) {
      if (!this.isMouseDown) {
        return;
      }
      this.endClick();
    }
    // 结束点击，重置摇杆的位置和鼠标按下状态
    endClick() {
      this.isMouseDown = false;
      this.currRockerBar.x = this.initRockerBarPosition.x;
      this.currRockerBar.y = this.initRockerBarPosition.y;
      this.currRockerBar.selected = false;
      if (this.directComponent)
        this.directComponent.moveStop();
    }
    /*
    * 处理鼠标移动事件
    */
    onMouseMove(e) {
      if (!this.isMouseDown || !this.currRockerBar) {
        return;
      }
      e.stopPropagation();
      this._currentMouse.setTo(e.stageX, e.stageY);
      const localMouse = this.owner.globalToLocal(this._currentMouse, false);
      localMouse.x /= Laya.stage.clientScaleY;
      localMouse.y /= Laya.stage.clientScaleY;
      const distanceX = localMouse.x - this.mouseDownPosition.x;
      const distanceY = localMouse.y - this.mouseDownPosition.y;
      const distance = Math.sqrt(__pow(distanceX, 2) + __pow(distanceY, 2));
      if (distance < this.maxDistance) {
        this.currRockerBar.x = this.initRockerBarPosition.x + distanceX;
        this.currRockerBar.y = this.initRockerBarPosition.y + distanceY;
      } else {
        const radians = Math.atan2(distanceX, distanceY);
        this.currRockerBar.x = Math.sin(radians) * this.maxDistance + this.initRockerBarPosition.x;
        this.currRockerBar.y = Math.cos(radians) * this.maxDistance + this.initRockerBarPosition.y;
      }
      if (this.directComponent) {
        const angle = Math.atan2(distanceX, distanceY) * 180 / Math.PI;
        this.directComponent.directMove(angle);
      }
    }
  };
  __decorateClass([
    property4({ type: Laya.Sprite3D })
  ], Script.prototype, "target", 2);
  Script = __decorateClass([
    regClass4("7cTqWb35RwygSkuWy4QkgQ")
  ], Script);

  // src/logic/GameManager.ts
  var _GameManager = class _GameManager {
    constructor() {
      this.validEnemyList = [];
    }
    static getInstance() {
      if (_GameManager.instance == null) {
        _GameManager.instance = new _GameManager();
        return _GameManager.instance;
      } else {
        return _GameManager.instance;
      }
    }
    init() {
      this.validEnemyList = [];
    }
    insertValidList(item) {
      if (!this.isFInd(item, this.validEnemyList)) {
        this.validEnemyList.push(item);
      }
    }
    isFInd(item, _list) {
      var state = false;
      if (!item || !_list || _list.length <= 0) {
        state = false;
      }
      for (let index = 0; index < _list.length; index++) {
        if (_list[index].id == item.id) {
          return true;
        }
      }
      return state;
    }
    isFIndIndex(item, _list) {
      var state = -1;
      if (!item || !_list || _list.length <= 0) {
        state = -1;
      }
      for (let index = 0; index < _list.length; index++) {
        if (_list[index].id == item.id) {
          state = index;
        }
      }
      return state;
    }
    removeValidListByValue(item) {
      if (!item || !this.validEnemyList || this.validEnemyList.length <= 0) {
        return;
      }
      var _index = this.isFIndIndex(item, this.validEnemyList);
      if (_index != -1) {
        this.validEnemyList.splice(_index, 1);
      }
    }
    createEnemy(parentNode, index) {
      Laya.Sprite3D.load("resources/prefab/enemy.lh", Laya.Handler.create(null, function(sp) {
        parentNode.addChild(sp);
        sp.getComponent(EnemyMove).speed = 0.02 + index * 3e-3;
        sp.getComponent(EnemyMove).setCurrentIndex(index);
      }));
    }
    getValidList() {
      return this.validEnemyList;
    }
    playMusic() {
      Laya.SoundManager.playMusic("resources/music/bgm.mp3", 0, Laya.Handler.create(null, () => {
      }));
    }
    playSound(musicType) {
      var fileName = "";
      if (musicType == 1 /* ePuGong */) {
        fileName = "resources/music/pugong";
      } else if (musicType == 2 /* eEnemyAttack */) {
        fileName = "resources/music/enemyHit";
      } else if (musicType == 3 /* eDaZhao */) {
        fileName = "resources/music/dazhao";
      }
      Laya.SoundManager.playSound(fileName + ".wav", 1, Laya.Handler.create(null, () => {
      }));
    }
    setCurrentHero(hero) {
      this.currentHero = hero;
    }
    getCurrentHero() {
      return this.currentHero;
    }
    setCurrentPlane(plane) {
      this.planeNode = plane;
    }
    getCurrentPlane() {
      return this.planeNode;
    }
  };
  _GameManager.instance = null;
  var GameManager = _GameManager;

  // src/logic/ParticleTool.ts
  var ParticleTool = class {
    /**
     * 播放英雄粒子
     * @param resName 资源路径
     * @param skillIndex  技能id
     * @param parentNode 父节点
     */
    static playSkillEffect(resName, skillIndex, parentNode) {
      var array = ["Attack01", "Attack02", "Attack03", "Attack04"];
      var skillName = array[skillIndex];
      Laya.Sprite3D.load(resName, Laya.Handler.create(null, function(sp) {
        parentNode.addChild(sp);
        var _p = sp.getChildByName(skillName);
        _p.active = true;
        var _partice = _p.getComponent(Laya.ShurikenParticleRenderer);
        _partice._particleSystem.play();
        setTimeout(() => {
          sp.removeSelf();
        }, 1e3);
      }));
    }
    /**
     * 播放敌人攻击特效
     * @param resName 资源路径
     * @param parentNode 父节点
     */
    static playEnemyHurtSkillEffect(resName, parentNode) {
      Laya.Sprite3D.load(resName, Laya.Handler.create(null, function(sp) {
        parentNode.addChild(sp);
        var _name = "Attack";
        var _p = sp.getChildByName(_name);
        var _partice = _p.getComponent(Laya.ShurikenParticleRenderer);
        _partice._particleSystem.play();
        if (_p.numChildren > 0) {
          for (let index = 0; index < _p.numChildren; index++) {
            var _p1 = _p.getChildAt(index);
            var _partice1 = _p1.getComponent(Laya.ShurikenParticleRenderer);
            _partice1._particleSystem.play();
          }
        }
        setTimeout(() => {
          sp.removeSelf();
        }, 1e3);
      }));
    }
    /**
     * 播放普通特效
     * @param resName 资源路径
     * @param parentNode 父节点
     */
    static playNormalEffect(resName, parentNode) {
      Laya.Sprite3D.load(resName, Laya.Handler.create(null, function(sp) {
        parentNode.addChild(sp);
        var _p = sp;
        var _partice = _p.getComponent(Laya.ShurikenParticleRenderer);
        _partice._particleSystem.play();
        if (_p.numChildren > 0) {
          for (let index = 0; index < _p.numChildren; index++) {
            var _p1 = _p.getChildAt(index);
            var _partice1 = _p1.getComponent(Laya.ShurikenParticleRenderer);
            _partice1._particleSystem.play();
          }
        }
        setTimeout(() => {
          sp.removeSelf();
        }, 1e3);
      }));
    }
  };

  // src/logic/EnemyMove.ts
  var { regClass: regClass5, property: property5 } = Laya;
  var EnemyMove = class extends Laya.Script {
    constructor() {
      super();
      //@property()
      this.followTarget = null;
      this.speed = 0.02;
      this.mLife = 5;
      this.mIsEnd = false;
      this.mIsAttack = false;
      this.mIsAttackStart = false;
      this.mCanPlayFirst = true;
      this.mAttackDelayTime = 0;
      this.mCurrentIndex = 0;
      this.followTarget = GameManager.getInstance().getCurrentHero();
    }
    /**
     * 每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
     * 此方法为虚方法，使用时重写覆盖即可
    */
    onUpdate() {
      if (this.mIsEnd) {
        return;
      }
      if (this.followTarget == null) {
        this.followTarget = GameManager.getInstance().getCurrentHero();
      }
      var Vec1 = new Laya.Vector3(this.followTarget.transform.position.x, 0, this.followTarget.transform.position.z);
      var Vec2 = new Laya.Vector3(this.owner.transform.position.x, 0, this.owner.transform.position.z);
      var dis = Laya.Vector3.distance(Vec1, Vec2);
      if (dis < 10) {
        if (dis <= 1) {
          if (this.mIsAttack) {
            this.isAttackendByPlayer();
          } else {
            if (this.mCanPlayFirst) {
              this.mCanPlayFirst = false;
              this.attackPlayer();
            } else {
              this.mAttackDelayTime = this.mAttackDelayTime + Laya.timer.delta;
              if (this.mAttackDelayTime > 1e3) {
                this.mAttackDelayTime = 0;
                this.attackPlayer();
              }
            }
            this.mIsAttackStart = false;
          }
          GameManager.getInstance().insertValidList(this.owner);
        } else {
          this.mAttackDelayTime = 0;
          var cha = new Laya.Vector3();
          Laya.Vector3.subtract(Vec1, Vec2, cha);
          Laya.Vector3.normalize(cha, cha);
          this.owner.transform.lookAt(Vec1, Laya.Vector3.Up);
          var curpos = this.owner.transform.position;
          curpos.vadd(new Laya.Vector3(cha.x * this.speed, 0, cha.z * this.speed), curpos);
          this.owner.transform.position = curpos;
          this.anim && this.anim.playAnim("run", true);
          this.mCanPlayFirst = true;
          this.mIsAttackStart = false;
          this.mIsAttack = false;
        }
      } else {
        if (this.anim) {
          this.anim.playAnim("ldle", true);
        }
        GameManager.getInstance().removeValidListByValue(this.owner);
      }
      if (this.mLife <= 0) {
        this.mIsEnd = true;
        if (this.anim) {
          this.anim.playAnim("die", true);
        }
        setTimeout(() => {
          GameManager.getInstance().removeValidListByValue(this.owner);
          this.owner.removeSelf();
          var plane = GameManager.getInstance().getCurrentPlane();
          var index = this.mCurrentIndex;
          GameManager.getInstance().createEnemy(plane.getChildAt(index), index);
        }, 600);
      }
    }
    setCurrentIndex(index) {
      this.mCurrentIndex = index;
    }
    setLife(_life) {
      this.mLife = _life;
    }
    attackPlayer() {
      ParticleTool.playEnemyHurtSkillEffect("resources/prefab/eff_monster.lh", this.owner.getChildAt(0));
      GameManager.getInstance().playSound(2 /* eEnemyAttack */);
      this.anim && this.anim.playAnim("attack", true);
      setTimeout(() => {
        if (this.mIsEnd) {
          return;
        }
        this.anim && this.anim.playAnim("ldle", true);
      }, 500);
    }
    isAttackendByPlayer() {
      if (!this.mIsAttackStart) {
        this.anim && this.anim.playAnim("shouji", true);
        ParticleTool.playNormalEffect("resources/prefab/eff_shouji.lh", this.owner.getChildAt(0));
        setTimeout(() => {
          if (this.mIsEnd) {
            return;
          }
          this.anim && this.anim.playAnim("shouji", true);
          this.mIsAttack = false;
        }, 500);
        this.mIsAttackStart = true;
      }
    }
    getLife() {
      return this.mLife;
    }
    setIsAttack(state) {
      this.mIsAttack = state;
    }
  };
  __decorateClass([
    property5({ type: AnimatorControl })
  ], EnemyMove.prototype, "anim", 2);
  __decorateClass([
    property5({ type: "number" })
  ], EnemyMove.prototype, "speed", 2);
  EnemyMove = __decorateClass([
    regClass5("eWO-rqURQ6ag7phXtJPZCA")
  ], EnemyMove);

  // src/logic/GameScene.ts
  var { regClass: regClass6, property: property6 } = Laya;
  var GameScene = class extends Laya.Script {
    constructor() {
      super();
    }
    // /**
    //  * 组件被激活后执行，此时所有节点和组件均已创建完毕，次方法只执行一次
    //  * 此方法为虚方法，使用时重写覆盖即可
    //  */
    onAwake() {
      GameManager.getInstance().init();
      this.m_scene = this.owner;
      GameManager.getInstance().scene = this.m_scene;
      GameManager.getInstance().setCurrentHero(this.hero);
      GameManager.getInstance().setCurrentPlane(this.planeNode);
    }
    /**
     * 第一次执行update之前执行，只会执行一次
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onStart() {
      GameManager.getInstance().playMusic();
      this.initEnemy();
    }
    initEnemy() {
      var planeNode = this.planeNode;
      if (planeNode.numChildren > 0) {
        for (let index = 0; index < planeNode.numChildren; index++) {
          var _parentNode = planeNode.getChildAt(index);
          GameManager.getInstance().createEnemy(_parentNode, index);
        }
      }
    }
  };
  __decorateClass([
    property6({ type: Laya.Sprite3D })
  ], GameScene.prototype, "hero", 2);
  __decorateClass([
    property6({ type: Laya.Sprite3D })
  ], GameScene.prototype, "planeNode", 2);
  GameScene = __decorateClass([
    regClass6("FMBAETngRGikJ3hfdLj9fw")
  ], GameScene);

  // src/util/Tool.ts
  var Tool = class {
    constructor() {
    }
    static distancePoint(x1, y1, x2, y2) {
      return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    /**
    * 在朝向上创建多个点，每个点相聚25像素
    *sx:起点x
    *sx:起点y
    *angle:朝向
    *segment:数量
    *leng：每点距离
    */
    static createDirectPath(sx, sy, angle, segment = 40, leng = 25) {
      var path = [];
      var radian = angle * Math.PI / 180;
      for (var i = 1; i < segment; ++i) {
        var directX = sx;
        var directY = sy + leng * i;
        var targetX = -(directY - sy) * Math.sin(radian) + sx;
        var targetY = (directY - sy) * Math.cos(radian) + sy;
        path.push(targetX, targetY);
      }
      return path;
    }
    /**
    * 在点集上，以终点开始，回退指定距离，得到新的点集
    *list:点集，至少2个点，即长度为4
    */
    static pointsBack(list, backlength) {
      if (backlength <= 0)
        return list;
      if (!list)
        return list;
      if (list.length < 4)
        return list;
      var totalLen = 0;
      var cx = -1;
      var cy = -1;
      for (var i = 0; i < list.length; i += 2) {
        var dx = list[i];
        var dy = list[i + 1];
        if (cx > 0 && cy > 0) {
          totalLen += this.distancePoint(cx, cy, dx, dy);
        }
        cx = dx;
        cy = dy;
      }
      if (totalLen < backlength)
        return null;
      var points = list.concat();
      var distance = 0;
      var delta = 0;
      while (points && points.length >= 4 && distance < backlength) {
        var lasty = points.pop();
        var lastx = points.pop();
        var y = points[points.length - 1];
        var x = points[points.length - 2];
        distance += this.distancePoint(x, y, lastx, lasty);
        delta = distance - backlength;
        if (delta > 0) {
          var radian = Math.atan2(y - lasty, x - lastx);
          var angle = radian * 180 / Math.PI + 90;
          radian = angle * Math.PI / 180;
          var directY = y + delta;
          var targetX = -(directY - y) * Math.sin(radian) + x;
          var targetY = (directY - y) * Math.cos(radian) + y;
          points.push(targetX, targetY);
        }
      }
      return points;
    }
    /**
    * 将一线段分成多端
    *sx:起点x
    *sx:起点y
    *ex:终点x
    *ey:终点y
    *leng:每段长度
    *distance:与目标点保持距离
    */
    static createLinePath(sx, sy, ex, ey, leng = 25, distance = 0) {
      var path = [];
      var radian = Math.atan2(ey - sy, ex - sx);
      radian = (radian * 180 / Math.PI - 90) * Math.PI / 180;
      var totalLen = this.distancePoint(sx, sy, ex, ey) - distance;
      var currentLen = 0;
      var i = 0;
      while (totalLen > currentLen) {
        var directX = sx;
        var directY = sy + leng * i;
        var targetX = -(directY - sy) * Math.sin(radian) + sx;
        var targetY = (directY - sy) * Math.cos(radian) + sy;
        currentLen = this.distancePoint(sx, sy, targetX, targetY);
        if (totalLen > currentLen) {
          path.push(targetX, targetY);
        }
        i++;
      }
      if (distance == 0) {
        path.push(ex, ey);
      }
      return path;
    }
    /**
    * 转换坐标到地图坐标, point是相对角色的正面 
    */
    static rolePosTransform(mainrole, role, point) {
      var matrix = new Laya.Matrix();
      matrix.rotate(Math.PI / 180 * (mainrole.modelAngle - 90));
      matrix.translate(role.x, role.y);
      return matrix.transformPoint(point);
    }
    /**
    * 判断点是否在封闭区域内
    */
    static pointtInPolygon(p, areaPoints) {
      var nCross = 0;
      for (var i = 0; i < areaPoints.length; i++) {
        var p1 = areaPoints[i];
        var p2 = areaPoints[(i + 1) % areaPoints.length];
        if (p1.y == p2.y)
          continue;
        if (p.y < Math.min(p1.y, p2.y))
          continue;
        if (p.y >= Math.max(p1.y, p2.y))
          continue;
        var x = (p.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
        if (x > p.x) {
          nCross++;
        }
      }
      return nCross % 2 == 1;
    }
    /**
    * 判断点是否在扇形区域内
    */
    static pointInPie(piex, piey, startangle, endangle, radius, targetPoint) {
      var angle = Math.atan2(targetPoint.y - piey, targetPoint.x - piex) * 180 / Math.PI;
      var distance = this.distancePoint(piex, piey, targetPoint.x, targetPoint.y);
      if (angle >= startangle && angle <= endangle && distance <= radius)
        return true;
      return false;
    }
    static getRandInRound(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // /**
    // * 从2D角度获得3D角度
    // */
    // public static angel2dTo3d(x0:number,y0:number,x:number,y:number):number
    // {
    // 	var dy:number = (y0-y)/GameWorld.camerSinAngle;
    // 	return Math.atan2(dy,x0-x)*180/Math.PI-90;
    // }
  };

  // src/logic/PlayerFight.ts
  var { regClass: regClass7, property: property7 } = Laya;
  var PlayerFight = class extends Laya.Script {
    constructor() {
      super();
      this.animname = "";
      this.force = false;
      this.isBig = false;
      this.isCanClick = true;
    }
    onMouseClick(evt) {
      if (!this.isCanClick) {
        return;
      }
      if (this.isCanClick) {
        this.isCanClick = false;
      }
      var _list = GameManager.getInstance().getValidList();
      Laya.Tween.to(this.btn_pic, { scaleX: 1.1, scaleY: 1.1 }, 250, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
        Laya.Tween.to(this.btn_pic, { scaleX: 1, scaleY: 1 }, 150, Laya.Ease.linearIn);
      }));
      var skillIndex = 0;
      if (!this.isBig) {
        var array = ["attack1", "attack2", "attack3"];
        skillIndex = Tool.getRandInRound(0, array.length - 1);
        this.animname = array[skillIndex];
        if (_list.length > 0) {
          var Vec1 = _list[0].transform.position;
          var Vec2 = this.player.transform.position;
          var angle = this.getCurrentAngle(Vec1, Vec2);
          this.player.transform.localRotationEulerY = angle + 180;
          if (Laya.Vector3.distance(new Laya.Vector3(Vec1.x, 0, Vec1.z), new Laya.Vector3(Vec2.x, 0, Vec2.z)) < 1) {
            var item = _list[0].getComponent(EnemyMove);
            if (item.getLife() > 0) {
              item.setLife(item.getLife() - 1);
            }
            item.setIsAttack(true);
          }
        }
        GameManager.getInstance().playSound(1 /* ePuGong */);
      } else {
        skillIndex = 3;
        this.animname = "attack4";
        if (_list.length > 0) {
          for (let index = 0; index < _list.length; index++) {
            var Vec11 = _list[index].transform.position;
            var Vec22 = this.player.transform.position;
            if (Laya.Vector3.distance(new Laya.Vector3(Vec11.x, 0, Vec11.z), new Laya.Vector3(Vec22.x, 0, Vec22.z)) < 1) {
              var item = _list[index].getComponent(EnemyMove);
              if (item.getLife() > 0) {
                item.setLife(item.getLife() - 1);
              }
              item.setIsAttack(true);
            }
          }
        }
        GameManager.getInstance().playSound(3 /* eDaZhao */);
      }
      ParticleTool.playSkillEffect("resources/prefab/eff_play.lh", skillIndex, this.player);
      if (this.anim1) {
        this.anim1.playAnim(this.animname, this.force);
        setTimeout(() => {
          this.anim1.playAnim("idle", this.force);
          this.isCanClick = true;
        }, 500);
      }
    }
    getCurrentAngle(Vec1, Vec2) {
      var cha = new Laya.Vector3();
      Laya.Vector3.subtract(Vec1, Vec2, cha);
      Laya.Vector3.normalize(cha, cha);
      var angle = Math.atan2(cha.x, cha.z) * 180 / Math.PI;
      if (angle < 0) {
        angle = angle + 360;
      }
      angle = Math.round(angle);
      return angle;
    }
  };
  __decorateClass([
    property7({ type: AnimatorControl })
  ], PlayerFight.prototype, "anim1", 2);
  __decorateClass([
    property7({ type: "string" })
  ], PlayerFight.prototype, "animname", 2);
  __decorateClass([
    property7({ type: "boolean" })
  ], PlayerFight.prototype, "force", 2);
  __decorateClass([
    property7({ type: Laya.Sprite3D })
  ], PlayerFight.prototype, "player", 2);
  __decorateClass([
    property7({ type: "boolean" })
  ], PlayerFight.prototype, "isBig", 2);
  __decorateClass([
    property7({ type: Laya.Sprite })
  ], PlayerFight.prototype, "btn_pic", 2);
  PlayerFight = __decorateClass([
    regClass7("ye1w48wgTbqktuLPDOjmkw")
  ], PlayerFight);
})();
