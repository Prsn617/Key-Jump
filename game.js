import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

kaboom({
  global: true,
  width: 850,
  height: 600,
  scale: 1,
  debug: true,
  background: [250, 250, 250],
});

const SPEED = 150;
let isGrounded = true;

loadSprite("player", "sprites/player.png");
loadSprite("player-alt", "sprites/player-alt.png");
loadSprite("spike", "sprites/star.png");
loadSprite("jumpBoost", "sprites/jumper.png");
loadSprite("key", "sprites/key.png");
loadSprite("door", "sprites/door3.png");

loadSound("game", "sound/game.wav");
loadSound("death", "sound/death.wav");
loadSound("jump", "sound/jump.wav");
loadSound("keyPick", "sound/keyPick.wav");
loadSound("powerUp", "sound/powerUp.wav");

scene("main", (levelIdx) => {
  let hasKey = false;
  let hasJumpBoost = false;

  const levels = [
    [
      "================",
      "=              =",
      "=              =",
      "=              =",
      "=              =",
      "=   $          =",
      "=              =",
      "=              =",
      "=   =          |",
      "= @ =          |",
      "================",
    ],
    [
      "================",
      "=              =",
      "=              =",
      "=              =",
      "=   $          =",
      "=              =",
      "=              =",
      "=              =",
      "=      =       |",
      "= @ =  =       |",
      "================",
    ],
    [
      "================",
      "=              =",
      "=           $  =",
      "=              =",
      "=              =",
      "=              =",
      "=              =",
      "=              =",
      "=              |",
      "= @            |",
      "================",
    ],
    [
      "================",
      "=              =",
      "=           $  =",
      "=              =",
      "=              =",
      "=              =",
      "=              =",
      "=              =",
      "=              |",
      "= @ ******     |",
      "================",
    ],
    [
      "================",
      "=              =",
      "=           $  =",
      "=              =",
      "=              =",
      "=              =",
      "=             *=",
      "=             *=",
      "=*             |",
      "=*  @          |",
      "================",
    ],
    [
      "================",
      "=              =",
      "=           $  =",
      "=              =",
      "=              =",
      "=              =",
      "=*            *=",
      "=*            *=",
      "=              |",
      "=   @ #        |",
      "================",
    ],
    [
      "============   =",
      "=            =$=",
      "=            ===",
      "=              =",
      "=              =",
      "=              =",
      "=              =",
      "=              =",
      "=              |",
      "=    @         |",
      "================",
    ],
    [
      "================",
      "=    $ *      |=",
      "=   == *      |=",
      "=  *   *     ===",
      "=      *       =",
      "=      *       =",
      "=      *      *=",
      "=      *      *=",
      "=              =",
      "=   @#         =",
      "================",
    ],
    [
      "================",
      "=    $         =",
      "=   ==*********|",
      "=              |",
      "=     *********=",
      "=              =",
      "=              =",
      "=              =",
      "=              =",
      "=    @        #=",
      "================",
    ],
    [
      "================",
      "=   *****     |=",
      "=     ===     |=",
      "=            ===",
      "=              =",
      "=              =",
      "=              =",
      "=              =",
      "=    #         =",
      "=   @*****    $=",
      "================",
    ],
  ];

  addLevel(levels[levelIdx], {
    width: 50,
    height: 50,
    pos: vec2(50, 50),
    "=": () => [rect(50, 50), area(), solid(), color(10, 10, 10), "ground"],
    "*": () => [sprite("spike"), area(), "spike"],
    $: () => [sprite("key"), area(), "key"],
    "#": () => [sprite("jumpBoost"), area(), "jumpBoost"],
    "-": () => [rect(50, 50), area(), color(80, 250, 80), "bullet"],
    "@": () => [sprite("player"), area(), body(), "player"],
    "|": () => [sprite("door"), area(), color(), solid(), "door"],
  });

  const dialog = add([
    text(`Level:${levelIdx + 1} `, { size: 32 }),
    pos(400, 60),
  ]);

  const player = get("player")[0];

  onKeyDown("a", () => {
    player.flipX(1);
    player.move(-SPEED, 0);
  });
  onKeyDown("d", () => {
    player.flipX(0);
    player.move(SPEED, 0);
  });

  player.onCollide("ground", () => {
    isGrounded = true;
  });

  player.onCollide("key", (key) => {
    play("keyPick");
    destroy(key);
    hasKey = true;
  });

  player.onCollide("jumpBoost", (jumpBoost) => {
    play("powerUp");
    destroy(jumpBoost);
    gravity(0);
    player.move(player.pos.x, 0);
    hasJumpBoost = true;
  });

  player.onCollide("spike", () => {
    play("death");
    destroy(player);
    go("main", levelIdx);
  });

  onKeyPress("space", () => {
    if (isGrounded) {
      let jumper = play("jump");
      jumper.volume(0.7);
      player.jump();
    }
    isGrounded = false;
  });

  onKeyPress("s", () => {
    if (hasJumpBoost) {
      gravity(1600);
      hasJumpBoost = false;
    }
  });

  onCollide("player", "door", () => {
    if (hasKey) {
      let gameOver = play("game");
      gameOver.volume(0.3);
      if (levelIdx + 1 < levels.length) {
        go("main", levelIdx + 1);
      } else {
        dialog.text = "Win";
      }
    } else {
      dialog.text = "You got no key!";
    }
  });
});

go("main", 0);
