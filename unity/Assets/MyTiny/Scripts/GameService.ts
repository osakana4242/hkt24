
namespace game {

    export class GameService {

        static kGameSceneName: string = "game.Main";

        /**
         * Clears all game entities from the world to prepare for a new game
         */
        static clear(world: ut.World) {
            ut.Tweens.TweenService.removeAllTweensInWorld(world);
            ut.EntityGroup.destroyAll(world, this.kGameSceneName);
        };

        public static initialize(world: ut.World): void {
            // create a new game scene and score
            ut.EntityGroup.instantiate(world, this.kGameSceneName);

            // setup the initial state for the game
            let config = world.getConfigData(game.GameConfig);
            // config.currentScore = 0;
            // config.currentScrollSpeed = config.scrollSpeed;
            config.state = GameState.Main;
            world.setConfigData(config);
        }
    }
}
