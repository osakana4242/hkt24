
namespace game {

    export class GameManagerSystem extends ut.ComponentSystem {

        OnUpdate(): void {
            var config = this.world.getConfigData(game.GameConfig);
            switch (config.state) {
                case GameState.Initialize:
                    console.log("initialize");
                    GameService.initialize(this.world);
                    break;
                case GameState.Main:
                    break;
            }
        }
    }
}
