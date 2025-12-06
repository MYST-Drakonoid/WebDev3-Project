export function isInappropriateGame(game) {
    const bad = [
        "waifu","hentai","lewd","slut","xxx","adult","nsfw","sexy","harem","ecchi",
        "oppai","nude","erotic","18+","porn","sex","strip","dating sim","visual novel","king"
    ];

    const name = (game.name || "").toLowerCase();
    return bad.some(k => name.includes(k));
}
