
namespace game {

    export class GameManagerSystem extends ut.ComponentSystem {

        OnUpdate(): void {
            const config = this.world.getConfigData(game.GameConfig);
            const world = this.world;
            const dt = this.scheduler.deltaTime();
            switch (config.state) {
                case GameState.Initialize:
                    console.log("initialize");
                    GameService.initialize(world);
                    break;
                case GameState.MainInit: {
                    console.log("MainInit " + config.stateTime);
                    if (config.stateTime < 1) {
                        const centerTelopEntity = world.getEntityByName("centerTelop");
                        const centerTelopText = world.getComponentData(centerTelopEntity, ut.Text.Text2DRenderer);
                        centerTelopText.text = "START";
                        world.setComponentData(centerTelopEntity, centerTelopText);
                        config.stateTime += dt;
                    } else {
                        const centerTelopEntity = world.getEntityByName("centerTelop");
                        const centerTelopText = world.getComponentData(centerTelopEntity, ut.Text.Text2DRenderer);
                        centerTelopText.text = "";
                        world.setComponentData(centerTelopEntity, centerTelopText);

                        config.state = GameState.Main;
                    }
                    world.setConfigData(config);
                    break;
                }
                case GameState.Main: {
                    var playerEntity = world.getEntityByName("player_body_0");
                    var player = world.getComponentData(playerEntity, game.Player);
                    var playerPos = world.getComponentData(playerEntity, ut.Core2D.TransformLocalPosition);
                    var playerRot = world.getComponentData(playerEntity, ut.Core2D.TransformLocalRotation);
                    //playerRot.rotation.multiplyVector3(new Vector3(0, -1, 0));
                    var playerVec = new Vector3(0, 1, 0).multiplyScalar(config.playerMoveDistance);
                    playerVec = playerVec.applyQuaternion(playerRot.rotation);

                    {
                        let rot = 0;
                        if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.LeftArrow)) {
                            rot = 1;
                        }
                        if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.RightArrow)) {
                            rot = -1;
                        }

                        var euler = new Euler().setFromQuaternion(playerRot.rotation);
                        euler.z += rot * MathService.degToRad(config.playerRotationSpeed) * dt;
                        playerRot.rotation = new Quaternion().setFromEuler(euler);
                        world.setComponentData(playerEntity, playerRot);
                    }

                    const hasForward =
                        (player.moveIndex == 0) && ut.Runtime.Input.getKeyDown(ut.Core2D.KeyCode.Z) ||
                        (player.moveIndex == 1) && ut.Runtime.Input.getKeyDown(ut.Core2D.KeyCode.X) ||
                        (player.moveIndex == 2) && ut.Runtime.Input.getKeyDown(ut.Core2D.KeyCode.C) ||
                        (player.moveIndex == 3) && ut.Runtime.Input.getKeyDown(ut.Core2D.KeyCode.V) ||
                        (player.moveIndex == 4) && ut.Runtime.Input.getKeyDown(ut.Core2D.KeyCode.Space)
                        ;

                    if (hasForward) {
                        world.forEach([ut.Core2D.TransformLocalPosition, game.PlyaerBody], (trLocalPos, playerBody) => {
                            if (playerBody.index != player.moveIndex) return;
                            if (playerBody.index == 0) {
                                playerBody.targetPosition = playerPos.position.clone().add(playerVec);
                            } else {
                                // 親の取得.
                                // 親に向かう.
                                var parentEntity = world.getEntityByName("player_body_" + (playerBody.index - 1));
                                var parentPos = world.getComponentData(parentEntity, ut.Core2D.TransformLocalPosition);
                                var tPos = new Vector3(
                                    MathService.lerp(trLocalPos.position.x, parentPos.position.x, 0.5),
                                    MathService.lerp(trLocalPos.position.y, parentPos.position.y, 0.5),
                                    MathService.lerp(trLocalPos.position.z, parentPos.position.z, 0.5)
                                );
                                playerBody.targetPosition = tPos;
                            }
                        });
                        player.moveIndex = (player.moveIndex + 1) % 5;
                        world.setComponentData(playerEntity, player);
                    }


                    world.forEach([ut.Core2D.TransformLocalPosition, game.PlyaerBody],
                        (transformLocalPosition, playerBody) => {
                            var tpos = playerBody.targetPosition.clone();
                            var pos = transformLocalPosition.position.clone();
                            var addPos = tpos.clone().sub(pos).multiplyScalar(config.playerSpeed * dt);

                            // transformLocalPosition.position.add(addPos); // これは反応しない.
                            transformLocalPosition.position = pos.add(addPos);
                        });

                    break;
                }
            }
        }
    }
}
