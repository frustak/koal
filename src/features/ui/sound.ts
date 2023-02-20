import { Howl } from "howler";

export const sound = new Howl({
    src: ["./sounds/click.mp3"],
    volume: 0.25,
    preload: true,
});
