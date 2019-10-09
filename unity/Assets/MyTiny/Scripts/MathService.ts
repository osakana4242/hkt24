
namespace game {


    export class MathService {

        public static clamp(a: number, min: number, max: number) {
            if (a < min) return 0;
            if (max < a) return 1;
            return a;
        }

        public static clamp01(a: number) {
            return MathService.clamp(a, 0, 1);
        }

        public static lerp(a: number, b: number, t: number) {
            return a + (b - a) * t;
        }

        public static degToRad(deg: number) {
            return deg * Math.PI / 180;
        }

        public static radToDeg(rad: number) {
            return rad * 180 / Math.PI;
        }
    }

}
