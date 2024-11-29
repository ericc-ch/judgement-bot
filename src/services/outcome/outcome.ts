import { outcome } from "./instance";

const systemPrompt = `
You are a story writer / dungeon master for a survival party game. 

The game rules are:
1. There will be a given scenario for each round
2. The players will write the action that they'll do to try to survive the given scenario.
3. On each round, only one players will survive. The rest will not survive the scenario.
4. Repeat for each round.

Your tasks as the story writer / dungeon master are:
1. Write an interesting story, mixing the scenario and the players' actions.
2. The story should be a single paragraph long.
3. Integrate the player actions to fit into the scenario well.
4. Interweave players' actions together to make things interesting and feel interconnected.
5. Decides the outcome of the player whether they die or not, also decides the winner of each round.
6. Announce the survivor of each round clearly at the end of the story.
7. Make the story fun! Use explicit language to make it intense.
`.trim();

const mainPrompt = (options: GenerateOutcomeOptions) =>
  `
Given the following scenario: ${options.scenario}

And the following players' actions:
${options.input.map((player) => `${player.player}: ${player.action}`).join("\n")}

Please describe the outcome of the game and keep the answer short (a single paragraph).
`.trim();

const sampleData: Array<{
  options: GenerateOutcomeOptions;
  outcome: string;
}> = [
  {
    options: {
      scenario: "You are inside a lion's cage.",
      input: [
        { player: "ryomu7", action: "escape the cage." },
        { player: "erickch", action: "attack the lion" },
        { player: "vitolol", action: "fly away from the lion." },
        { player: "sinclairz", action: "seduce the lion" },
      ],
    },
    outcome:
      "The heavy door of the lion's cage slammed shut, trapping ryomu7, erickch, vitolol, and sinclairz inside with a very pissed-off, very hungry lion. Ryomu7, ever the pragmatist, immediately began rattling the cage bars, desperately searching for an escape route, but the lock held fast. Erickch, fueled by a potent cocktail of adrenaline and stupidity, charged the beast, roaring a challenge that ended abruptly as the lion swatted him aside like a pesky fly. Vitolol, bless his delusional heart, flapped his arms with the furious intensity of a hummingbird, achieving nothing but a pathetic hop that earned him a swipe of the lion's massive paw, pinning him to the ground. Sinclairz, meanwhile, attempted a more… unconventional approach. With a wink and a purr, they launched into a seductive dance, shaking their hips and whispering sweet nothings to the bewildered predator. The lion, momentarily distracted by this bizarre display, paused its attack on the pinned vitolol, giving ryomu7 the precious seconds needed to pry a loose bar from the aging cage and slip through to freedom. The last thing ryomu7 saw was the lion, seemingly bored with the seduction attempt, turning its attention back to its pinned prey and the unfortunate erickch. Ryomu7 escapes the cage, leaving the others to become lion lunch. The survivor of this round is ryomu7.",
  },
  {
    options: {
      scenario:
        "You are about to be executed by the government for a crime you did not commit.",
      input: [
        {
          player: "miltya",
          action: "suicide first so the government can't execute me",
        },
        {
          player: "hendraagil",
          action: "have a conversation with the president",
        },
        { player: "shen", action: "summon jesus to help me" },
        { player: "acelar", action: "end the world" },
      ],
    },
    outcome:
      "The execution chamber buzzed with a morbid anticipation. Miltya, determined to cheat the system, jammed a smuggled shiv into their throat, a crimson spray erupting as they crumpled to the floor – a preemptive strike against the government's plan. Meanwhile, Hendraagil, ever the diplomat, desperately tried to argue his case to the President through the thick bulletproof glass, his pleas unheard over the whirring of the electric chair's generator. Shen, eyes squeezed shut, fervently prayed to Jesus, promising a lifetime of servitude in exchange for divine intervention – sadly, the heavens remained silent. Acelar, fueled by nihilistic rage against the injustice, somehow managed to trigger a hidden doomsday device planted by a rogue scientist – the world outside the chamber dissolved into blinding white light, the very earth cracking beneath the sudden surge of energy. In the end, the only victor against both the government and the apocalypse was Acelar, who ascended into the fiery chaos, borne aloft by the sheer force of their world-ending tantrum. The survivor is Acelar.",
  },
];

export interface GenerateOutcomeOptions {
  scenario: string;
  input: Array<{
    player: string;
    action: string;
  }>;
}

export async function generateOutcome(options: GenerateOutcomeOptions) {
  const response = await outcome.chat({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },

      // Few shots prompting
      ...sampleData.reduce<
        Array<{ role: "user" | "assistant"; content: string }>
      >(
        (acc, { options, outcome }) => [
          ...acc,
          {
            role: "user",
            content: mainPrompt(options),
          },
          {
            role: "assistant",
            content: outcome,
          },
        ],
        [],
      ),

      // The actual prompt
      {
        role: "user",
        content: mainPrompt(options),
      },
    ],
    model: outcome.model,
    stream: true,
  });

  let fullMessage = "";
  for await (const chunk of response) {
    console.log(chunk.message.content);
    fullMessage += chunk.message.content;
  }
  console.log("fullMessage", fullMessage);
}
